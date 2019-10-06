import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Postgres } from '../postgres';
import { exist } from '@hapi/joi';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('postgres query', () => {
  it('getNamesWhereAgeOver', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    const result = await db.getNamesWhereAgeOver(90);
    // Assert
    expect(result.length).to.be.gte(0);
    await db.finish();
  });
  it('getTime', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    const time = await db.getTime();
    // Assert
    expect(time).to.be.instanceOf(Date);
    await db.finish();
  });
});

describe('postgres save json', () => {
  const standardJson = {
    a: 1,
    b: 2,
    c: 3,
  };

  const jsonWithTag = {
    a: `a'a`,
    b: 2,
    c: 3,
  };
  it('save regular json', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    // Assert
    await expect(await db.saveJson(1, standardJson)).to.not.throw;
    await db.finish();
  });
  it('save json with tag', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    // Assert
    await expect(await db.saveJson(1, jsonWithTag)).to.not.throw;
    await db.finish();
  });
  it('save standard json using stringify', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    // Assert
    await expect(await db.saveJsonStringify(1, standardJson)).to.not.throw;
    await db.finish();
  });
  it('save json with tag using stringify - should throw error', async () => {
    // Arrange
    const db = new Postgres();
    await db.init();
    // Act
    // Assert
    await expect(await db.saveJsonStringify.bind(db, 1, jsonWithTag)).to.throw;
    await db.finish();
  });
});
