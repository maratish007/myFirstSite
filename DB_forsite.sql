--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-31 14:29:43

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16903)
-- Name: not_proved_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.not_proved_users (
    id integer NOT NULL,
    email character varying(40),
    password character varying(200),
    code integer
);


ALTER TABLE public.not_proved_users OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16901)
-- Name: notProvedUsers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."notProvedUsers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."notProvedUsers_id_seq" OWNER TO postgres;

--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 202
-- Name: notProvedUsers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."notProvedUsers_id_seq" OWNED BY public.not_proved_users.id;


--
-- TOC entry 208 (class 1259 OID 25106)
-- Name: spravki; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spravki (
    spravka_id integer NOT NULL,
    user_id integer,
    date timestamp without time zone,
    type character varying(200),
    description character varying(300),
    quantity smallint,
    facultet character varying(50),
    solved boolean
);


ALTER TABLE public.spravki OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 25104)
-- Name: spravki_spravka_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spravki_spravka_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.spravki_spravka_id_seq OWNER TO postgres;

--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 207
-- Name: spravki_spravka_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spravki_spravka_id_seq OWNED BY public.spravki.spravka_id;


--
-- TOC entry 206 (class 1259 OID 25096)
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    id integer,
    fname character varying(50),
    mname character varying(50),
    lname character varying(50),
    facultet character varying(50),
    ed_form character varying(50),
    grupa character varying(50)
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16913)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50),
    password character varying(200)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16911)
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
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 204
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2704 (class 2604 OID 16906)
-- Name: not_proved_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.not_proved_users ALTER COLUMN id SET DEFAULT nextval('public."notProvedUsers_id_seq"'::regclass);


--
-- TOC entry 2706 (class 2604 OID 25109)
-- Name: spravki spravka_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spravki ALTER COLUMN spravka_id SET DEFAULT nextval('public.spravki_spravka_id_seq'::regclass);


--
-- TOC entry 2705 (class 2604 OID 16916)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2845 (class 0 OID 16903)
-- Dependencies: 203
-- Data for Name: not_proved_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.not_proved_users (id, email, password, code) FROM stdin;
39	qwe@edu.hse.ru	$2b$10$BuX3/80BGJXj/IxNdE9KPeXvkPphvWv5jtKqfuBVd651z/tdkvP6C	440047
40	q@edu.hse.ru	$2b$10$BuX3/80BGJXj/IxNdE9KPecbjVaqiNWzJyAje.dBpksXSthqQxn6i	887702
\.


--
-- TOC entry 2850 (class 0 OID 25106)
-- Dependencies: 208
-- Data for Name: spravki; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spravki (spravka_id, user_id, date, type, description, quantity, facultet, solved) FROM stdin;
1	20	2020-05-29 13:48:13.961	Справка об успеваемости (выписка всех оценок на русском языке)	Нет	3	ББИ	t
2	20	2020-05-29 19:54:51.222	Справка об обучении на русском языке	Нет	5	ББИ	f
3	20	2020-05-30 13:06:27.862	Другое:	Такая-то прикольная справка нужна	5	ББИ	f
4	21	2020-05-30 18:02:44.882	Справка об уровне владения английским языком	Нет	5	ББИ	f
5	21	2020-05-30 18:02:48.123	Справка об уровне владения английским языком	Нет	5	ББИ	f
6	21	2020-05-30 18:02:48.302	Справка об уровне владения английским языком	Нет	5	ББИ	f
7	21	2020-05-30 18:02:48.485	Справка об уровне владения английским языком	Нет	5	ББИ	f
8	21	2020-05-30 18:02:48.677	Справка об уровне владения английским языком	Нет	5	ББИ	f
9	21	2020-05-30 18:02:48.861	Справка об уровне владения английским языком	Нет	5	ББИ	f
10	21	2020-05-30 18:02:49.056	Справка об уровне владения английским языком	Нет	5	ББИ	f
11	21	2020-05-30 18:02:49.229	Справка об уровне владения английским языком	Нет	5	ББИ	f
12	21	2020-05-30 18:02:49.406	Справка об уровне владения английским языком	Нет	5	ББИ	f
13	21	2020-05-30 18:02:49.573	Справка об уровне владения английским языком	Нет	5	ББИ	f
14	21	2020-05-30 18:02:49.757	Справка об уровне владения английским языком	Нет	5	ББИ	f
15	21	2020-05-30 18:02:49.93	Справка об уровне владения английским языком	Нет	5	ББИ	f
16	21	2020-05-30 18:03:05.15	Другое:	adfsafadfadfafadfa	5	ББИ	f
17	20	2020-05-30 18:37:12.563	Справка об успеваемости (выписка всех оценок на русском языке)	Нет	3	ББИ	f
\.


--
-- TOC entry 2848 (class 0 OID 25096)
-- Dependencies: 206
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_info (id, fname, mname, lname, facultet, ed_form, grupa) FROM stdin;
20	Насибуллин	Марат	Фаридович	ББИ	Бакалавриат	ББИ181
21	Безбородова	Арина	Сергеевна	ББИ	Бакалавриат	ББИ181-2018
22	Саббаг	Амаль	Махамедовна	БСТ	Бакалавриат	БСТ171-2017
23	Борзенков	Арсений	Анатольевич	БИС	Бакалавриат	БИС181-2018
24	Миколенко	Николай	Андреевич	ББИ	Бакалавриат	ББИ185-2018
\.


--
-- TOC entry 2847 (class 0 OID 16913)
-- Dependencies: 205
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
9	kek10@edu.hse.ru	$2b$10$tsKBdg8hjUj7Mea96hW2GeyR/ENZ4ZyxLcSey04VXUY40bsCxPTiO
10	kek11@edu.hse.ru	$2b$10$mwrJpfjDIV57aG8ei0drWemnlDd/zyegd1zDjIZKBaugWrBKs4akG
11	kek12@edu.hse.ru	$2b$10$diLG67VGoqsTyeH3kqv/y.ZIKH2S3815Fv/yhC9DDFFj8tolA9reK
20	mfnasibullin@edu.hse.ru	$2b$10$l1Xn3ptQ/VownNrTvcDmgOjH46uf1cCqIqARfzhLZQ9EeQb2rBNia
21	asbezborodova_1@edu.hse.ru	$2b$10$ybMmYP7rjBDGaTq41dwc5uZExZDSB5gpnhIi3en.7VFeWX/kxyuBy
22	amsabbag@edu.hse.ru	$2b$10$IBglKLVCZhUK.sJhSXz37uZgmn7BugsknAzThewpQgQ/.NyFh/rCi
23	aaborzenkov@edu.hse.ru	$2b$10$aGrh713jfPlmjrtqXLZRru/cng84LKCqOtMecbRjeiz5ggeskf1Fy
24	namikolenko@edu.hse.ru	$2b$10$4blMhOl/35AZ0wbg0Mjg4Or2P5LNjvrT4Jl9zuL3Gc7mame7OE346
\.


--
-- TOC entry 2859 (class 0 OID 0)
-- Dependencies: 202
-- Name: notProvedUsers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."notProvedUsers_id_seq"', 41, true);


--
-- TOC entry 2860 (class 0 OID 0)
-- Dependencies: 207
-- Name: spravki_spravka_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spravki_spravka_id_seq', 17, true);


--
-- TOC entry 2861 (class 0 OID 0)
-- Dependencies: 204
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 24, true);


--
-- TOC entry 2708 (class 2606 OID 16910)
-- Name: not_proved_users notProvedUsers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.not_proved_users
    ADD CONSTRAINT "notProvedUsers_email_key" UNIQUE (email);


--
-- TOC entry 2710 (class 2606 OID 16908)
-- Name: not_proved_users notProvedUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.not_proved_users
    ADD CONSTRAINT "notProvedUsers_pkey" PRIMARY KEY (id);


--
-- TOC entry 2716 (class 2606 OID 25114)
-- Name: spravki spravki_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spravki
    ADD CONSTRAINT spravki_pkey PRIMARY KEY (spravka_id);


--
-- TOC entry 2712 (class 2606 OID 16920)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2714 (class 2606 OID 16918)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2717 (class 2606 OID 25115)
-- Name: spravki spravki_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spravki
    ADD CONSTRAINT spravki_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2020-05-31 14:29:45

--
-- PostgreSQL database dump complete
--

