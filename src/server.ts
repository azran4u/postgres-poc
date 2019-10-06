import { Postgres } from './postgres';

const regularJson = {
  a: 1,
  b: 2,
  c: 3,
};

const complexJson = {
  a: `a'a`,
  b: 2,
  c: 3,
};

async function start() {
  const db = new Postgres();
  try {
    await db.init();
    // console.log(await db.getTime());
    // await db.saveJson(1, regularJson);
    // await db.saveJson(2, complexJson);
    // await db.saveJsonStringify(3, regularJson);
    // await db.saveJsonStringify(4, complexJson);
    // console.log(await db.getContOfJsonByKeyValue('a', '1'));
    // await db.fillDatabase(10000);
    console.log(await db.getNamesWhereAgeOver(90));
  } catch (err) {
    console.error(err);
  } finally {
    await db.finish();
  }
}

start();
