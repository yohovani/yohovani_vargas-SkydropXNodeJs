--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-0ubuntu0.21.10.1)
-- Dumped by pg_dump version 13.3

-- Started on 2021-12-22 22:19:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3030 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16416)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
CREATE DATABASE IF NOT EXISTS 'nodeskx';
USE 'nodeskx';

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    company character varying(100) NOT NULL,
    url character varying(100) NOT NULL,
    description character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16414)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3032 (class 0 OID 0)
-- Dependencies: 200
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2890 (class 2604 OID 16419)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3024 (class 0 OID 16416)
-- Dependencies: 201
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, company, url, description) FROM stdin;
2	perlavargas@gmail.com	Perla	Vargas	TCS	https://github.com/Perla	test 02
3	test_email	test_fn	test_ln	test_c	test:u	test_d
4	test_email_2	test_fn_2	test_ln_2	test_c_2	test:u_2	test_d_
1	Yohovanivargas@gmail.com	yohovani	vargas	TCS	https://github.com/yohovani	Software Developer
\.


--
-- TOC entry 3034 (class 0 OID 0)
-- Dependencies: 200
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 2892 (class 2606 OID 16424)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3031 (class 0 OID 0)
-- Dependencies: 201
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO cliente;


--
-- TOC entry 3033 (class 0 OID 0)
-- Dependencies: 200
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO cliente;


-- Completed on 2021-12-22 22:19:02

--
-- PostgreSQL database dump complete
--

