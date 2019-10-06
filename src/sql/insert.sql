insert into public.json(ID, data) VALUES(1, '{}')
on conflict ON CONSTRAINT jsonPrimaryKey DO
      UPDATE
     SET data = EXCLUDED.data;