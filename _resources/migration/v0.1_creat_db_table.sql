CREATE TABLE public."user" (
    id uuid NOT NULL,
    username character varying(50) NOT NULL,
    registration_date timestamp without time zone,
    password character varying(20) NOT NULL,
    deleted boolean
);