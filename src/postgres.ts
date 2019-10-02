import { Client, QueryConfig, QueryResult } from 'pg';
import * as faker from 'faker';

export class Postgres {
  private client: Client;
  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: '192.168.99.100',
      database: 'postgres',
      password: 'postgrespassword',
      port: 5432,
    });
  }
  public async init() {
    try {
      this.client.connect();
      console.info(`connected to db`);
    } catch (err) {
      console.error(`couldn't connect to db. error=${err}`);
    }
  }
  public async finish() {
    try {
      this.client.end();
      console.info(`closed connection to db`);
    } catch (err) {
      console.error(`couldn't close connection to db. error=${err}`);
    }
  }

  private async query(query: QueryConfig): Promise<QueryResult> {
    try {
      const data = await this.client.query(query);
      console.info(`query OK. text=${query.text} values=${query.values}`);
      return data;
    } catch (err) {
      const msg = `query error. query text=${query.text} values=${query.values}. error=${err.message}`;
      console.error(msg);
    }
  }

  public async getTime(): Promise<Date> {
    const data = await this.query({
      text: `SELECT NOW() as now`,
    });
    return new Date(data.rows[0].now);
  }

  public async saveJson(id: number, obj: object) {
    await this.query({
      text: `insert into public.json(ID, data) VALUES($1, $2)
      on conflict ON CONSTRAINT jsonPrimaryKey
      DO UPDATE
      SET data = EXCLUDED.data;`,
      values: [id, obj],
    });
  }

  public async saveJsonStringify(id: number, obj: object) {
    await this.query({
      text: `insert into public.json(ID, data) VALUES(${id}, '${JSON.stringify(
        obj,
      )}')
      on conflict ON CONSTRAINT jsonPrimaryKey
      DO UPDATE
      SET data = EXCLUDED.data;`,
    });
  }

  public async getContOfJsonByKeyValue(
    key: string,
    value: string,
  ): Promise<number> {
    const data = await this.query({
      text: `select count(*) from public.json where data->>$1=$2;`,
      values: [key, value],
    });
    return data.rows[0].count;
  }

  public async fillDatabase(num: number) {
    for (let i = 0; i < num; i++) {
      await this.saveJson(i, {
        name: faker.name.firstName(),
        age: faker.random.number({ min: 1, max: 99 }),
        isCitizen: faker.random.boolean(),
      });
    }
  }

  public async getNamesWhereAgeOver(age: number): Promise<string[]> {
    const { rows } = await this.query({
      text: `select data from ( 
        select id, data, (data->'age')::integer as age_int 
        from public.json
        ) sq1
        where age_int > $1;`,
      values: [age],
    });
    return rows.map((person) => {
      return person.data.name;
    });
  }
}
