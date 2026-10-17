// HTTP Basic Auth in front of every path (pages, /sounds.json, /audio/*, everything).
// Vercel Routing Middleware runs before the CDN cache, so nothing is served unchecked.
// Any username is accepted; only the password matters.
import { next } from '@vercel/functions';
import { createHash, timingSafeEqual } from 'node:crypto';

export const config = { runtime: 'nodejs' };

const REALM = 'Basic realm="Old Road", charset="UTF-8"';

// Hash both sides first so the buffers are always the same length;
// timingSafeEqual then compares without leaking where they differ.
const digest = s => createHash('sha256').update(s, 'utf8').digest();
const sameSecret = (a, b) => timingSafeEqual(digest(a), digest(b));

function passwordFrom(request){
  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !encoded) return null;
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const colon = decoded.indexOf(':');
  return colon === -1 ? null : decoded.slice(colon + 1);   // passwords may contain ':'
}

export default function middleware(request){
  const expected = process.env.SOUNDBOARD_PASSWORD;
  // Fail closed: without a configured password, never serve the site.
  if (!expected) {
    return new Response('Soundboard is not configured.', {
      status: 503, headers: {'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8'}
    });
  }
  const given = passwordFrom(request);
  if (given === null || !sameSecret(given, expected)) {
    return new Response('Password required.', {
      status: 401,
      headers: {'WWW-Authenticate': REALM, 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8'}
    });
  }
  return next();
}
