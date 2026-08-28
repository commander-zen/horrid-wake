// Gold line-emblems, one per character.
//
// These replace the old base64 photo portraits. They are drawn to a SQUARE
// viewBox on purpose: the cards crop to a ~1:6 vertical sliver while the hero
// panels are near full-screen, so the consuming CSS uses `background-size:
// contain` (not `cover`) to keep the whole device visible on every surface.
// See the `--emblem` rules in cards.css / detail.css / sheet.css.

const GOLD = '#c8943a';

const svg = (body) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" ` +
  `stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
);

// Seven stars of Elendil, arced above Andúril's pommel.
const STARS = [40, 58, 76, 100, 124, 142, 160]
  .map((x, i) => `<circle cx="${x}" cy="${[30, 22, 17, 15, 17, 22, 30][i]}" r="2.5" fill="${GOLD}"/>`)
  .join('');

export const CHAR_IMGS = {
  // Andúril, hilt-up, beneath the seven stars of the North Kingdom.
  aragorn: svg(`
    ${STARS}
    <path d="M100 48 L109 78 L107 136 L93 136 L91 78 Z"/>
    <path d="M64 139 L136 139"/>
    <path d="M100 141 L100 170"/>
    <circle cx="100" cy="177" r="7"/>
  `),

  // Elven longbow, strung, with a nocked arrow.
  legolas: svg(`
    <path d="M72 28 Q116 100 72 172"/>
    <path d="M72 28 L72 172"/>
    <path d="M58 100 L152 100"/>
    <path d="M152 100 L138 92 M152 100 L138 108"/>
    <path d="M58 100 L70 93 M58 100 L70 107 M64 100 L76 93 M64 100 L76 107"/>
  `),

  // Crossed dwarven axes.
  gimli: svg(`
    <path d="M58 176 L142 44"/>
    <path d="M142 176 L58 44"/>
    <path d="M142 44 Q168 58 156 86 Q136 74 124 72 Z"/>
    <path d="M58 44 Q32 58 44 86 Q64 74 76 72 Z"/>
    <circle cx="100" cy="110" r="5" fill="${GOLD}"/>
  `),

  // The Horn of Gondor, banded in silver.
  boromir: svg(`
    <path d="M46 142 Q56 74 118 52 Q152 44 160 68 Q152 88 124 82 Q80 96 72 148 Q66 164 50 158 Z"/>
    <path d="M92 62 Q98 84 86 100"/>
    <path d="M64 84 Q72 106 60 122"/>
  `),

  // Barrow-blade — the Númenórean shortsword out of the Downs.
  merry: svg(`
    <path d="M100 58 L108 84 L106 128 L94 128 L92 84 Z"/>
    <path d="M74 131 L126 131"/>
    <path d="M100 133 L100 158"/>
    <path d="M88 164 L112 164"/>
  `),

  // A lute, for the Fool of a Took who could carry a tune.
  pippin: svg(`
    <circle cx="92" cy="138" r="40"/>
    <circle cx="92" cy="128" r="10"/>
    <path d="M114 110 L152 58"/>
    <path d="M152 58 L166 44"/>
    <path d="M148 46 L160 56 M156 40 L168 50"/>
    <path d="M100 172 L120 100 M92 174 L112 100"/>
  `),

  // An empty anvil — build your own.
  forge: svg(`
    <path d="M58 100 L142 100 L132 118 L118 124 L118 142 L82 142 L82 124 L68 118 Z"/>
    <path d="M58 100 L38 108 L58 116"/>
    <path d="M72 148 L128 148 L138 172 L62 172 Z"/>
  `),
};
