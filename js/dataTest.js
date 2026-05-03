async function testDataEngine() {
  await DataEngine.init();

  console.log('\n=== CHAPTERS ===');
  DataEngine.getChapters().forEach(c => console.log(c.index, c.name));

  console.log('\n=== CHAPTER 1 ROOMS ===');
  const rooms = DataEngine.getChapterRooms(1);
  console.log('Room count:', rooms.length);
  rooms.forEach(r => {
    console.log('\n---', r.name);
    if (r.readAloud.length) console.log('READ ALOUD:', r.readAloud[0].substring(0, 200));
    if (r.creatures.length) console.log('CREATURES:', r.creatures.join(', '));
    if (r.treasure.length) console.log('TREASURE:', r.treasure[0].substring(0, 100));
  });

  console.log('\n=== MONSTER LOOKUP ===');
  const goblin = DataEngine.getMonster('Goblin');
  console.log(DataEngine.formatMonsterBlock(goblin));
  const bugbear = DataEngine.getMonster('Bugbear');
  console.log(DataEngine.formatMonsterBlock(bugbear));
}

testDataEngine();
