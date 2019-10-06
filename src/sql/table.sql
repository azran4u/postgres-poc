drop table public.json;
CREATE TABLE public.json(
    ID INT NOT NULL,
    data JSONB,
    CONSTRAINT jsonPrimaryKey PRIMARY KEY(ID)
);