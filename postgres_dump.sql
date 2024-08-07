--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Ubuntu 14.12-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.12 (Ubuntu 14.12-0ubuntu0.22.04.1)

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
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    restaurant_id integer,
    comment text,
    created_at timestamp without time zone,
    visible boolean
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer,
    restaurant_id integer,
    comment_id integer,
    rating integer,
    created_at timestamp without time zone,
    rating_visible boolean
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: restaurant_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_categories (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    category text NOT NULL,
    category_visible boolean
);


ALTER TABLE public.restaurant_categories OWNER TO postgres;

--
-- Name: restaurant_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_categories_id_seq OWNER TO postgres;

--
-- Name: restaurant_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_categories_id_seq OWNED BY public.restaurant_categories.id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants (
    id integer NOT NULL,
    restaurant_name text,
    address text,
    restaurant_visible boolean
);


ALTER TABLE public.restaurants OWNER TO postgres;

--
-- Name: restaurants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurants_id_seq OWNER TO postgres;

--
-- Name: restaurants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    is_admin boolean,
    email text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
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
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: restaurant_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_categories ALTER COLUMN id SET DEFAULT nextval('public.restaurant_categories_id_seq'::regclass);


--
-- Name: restaurants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, restaurant_id, comment, created_at, visible) FROM stdin;
1	1	1	Arabian Krung Thep Thai Bistro on ebin mage :D	2024-07-31 19:25:38.668893	t
2	1	2	Thai Meelom on ebin mage :D hyvä thaimaalainen	2024-07-31 19:25:38.670147	t
3	1	3	El Karim on kiva egyptiläinen	2024-07-31 19:25:38.671054	t
4	1	4	Käpygrilli on ebin mage :D	2024-07-31 19:25:38.672097	t
5	1	5	Hese on ebin mage :D	2024-07-31 19:25:38.67309	t
6	1	6	Nyyrikki on ebin mage :D	2024-07-31 19:25:38.674224	t
7	1	7	Iso Paja on ebin mage :D olibas iso baja deillä. Bajabäänä dyggään govasdi :D	2024-07-31 19:25:38.675171	t
8	1	8	Hese on parempi :D	2024-07-31 19:25:38.675997	t
9	1	9	Seor Cafe on tosi chilli kahvila...	2024-07-31 19:25:38.676864	t
10	1	10	Sotto on ebin mage :D	2024-07-31 19:25:38.67791	t
11	1	11	Old Sophie on ebin mage :D eigä Sophie niin wanha ole wielä :D	2024-07-31 19:25:38.678724	t
12	1	12	CoolHead Brew on ebin mage :D	2024-07-31 19:25:38.679471	t
13	1	13	Harju 8 on ebin mage :D	2024-07-31 19:25:38.680255	t
14	1	14	Platinum Lounge on ebin mage :D	2024-07-31 19:25:38.681032	t
15	1	15	Kahvila Aurinko on ebin mage :D	2024-07-31 19:25:38.681778	t
16	1	16	Frangipanissa on hyvät paninit!	2024-07-31 19:25:38.682739	t
17	1	17	Oljenkorsi on paras :D galja on hywää c:	2024-07-31 19:25:38.683589	t
18	1	18	Tandoori YES YES YES YES! :D givad ganad deillä c:	2024-07-31 19:25:38.684394	t
19	1	19	Jano on ebin mage :D galja on hywää c:	2024-07-31 19:25:38.68515	t
20	1	20	Cafe Amore on läbbä :D giwad gahwid deillä c:	2024-07-31 19:25:38.686097	t
23	2	1	New Comment!	2024-07-31 20:35:16.889952	t
24	2	1	NEWCOMMENT!!!!!!!!	2024-07-31 20:37:23.615985	t
27	2	1	normaali	2024-07-31 21:33:39.515245	t
26	2	1	<script>alert("Hacked again!")</script>	2024-07-31 21:30:31.075203	f
28	2	1	<script> lol äksdee	2024-07-31 21:34:16.262001	f
21	2	1	<script>alert("UHKA!")</script>	2024-07-31 19:32:50.245771	t
22	2	1	<script>alert("HACKED!")</script>	2024-07-31 20:34:03.823664	t
25	2	1	<script>alert("HACKED!")</script>	2024-07-31 21:29:34.830442	f
30	2	1	<script></script>	2024-07-31 23:12:29.975328	t
29	2	1	testi\n	2024-07-31 23:12:05.465078	t
32	2	1	'><>'?+("=))0983=%(	2024-08-01 01:16:24.279753	t
33	2	1	")(¤)(#"=%(")(%"&*!^"&"`&#?)=(&)"=#&"#(&)	2024-08-01 01:16:49.024498	t
34	2	1	ACTUAL FEEDBACK!	2024-08-01 03:23:51.705274	t
35	2	1	Should work c:	2024-08-01 03:26:10.737345	t
36	2	1	csrf?	2024-08-01 03:59:53.091019	t
31	2	1	<script>LOL	2024-08-01 01:15:54.260515	t
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, restaurant_id, comment_id, rating, created_at, rating_visible) FROM stdin;
1	1	1	1	3	2024-07-31 19:25:38.691447	t
2	1	2	2	4	2024-07-31 19:25:38.692596	t
3	1	3	3	3	2024-07-31 19:25:38.693471	t
4	1	4	5	5	2024-07-31 19:25:38.694579	t
5	1	5	6	3	2024-07-31 19:25:38.69559	t
6	1	6	7	5	2024-07-31 19:25:38.696638	t
7	1	7	8	4	2024-07-31 19:25:38.697649	t
8	1	8	9	3	2024-07-31 19:25:38.698546	t
9	1	9	10	4	2024-07-31 19:25:38.699541	t
10	1	10	10	3	2024-07-31 19:25:38.700318	t
11	1	11	11	5	2024-07-31 19:25:38.701183	t
12	1	12	12	5	2024-07-31 19:25:38.701917	t
13	1	13	13	4	2024-07-31 19:25:38.702712	t
14	1	14	14	3	2024-07-31 19:25:38.703467	t
15	1	15	15	4	2024-07-31 19:25:38.704294	t
16	1	16	16	4	2024-07-31 19:25:38.705002	t
17	1	17	17	5	2024-07-31 19:25:38.705816	t
18	1	18	18	4	2024-07-31 19:25:38.706509	t
19	1	19	19	4	2024-07-31 19:25:38.707335	t
20	1	20	20	4	2024-07-31 19:25:38.7081	t
23	2	1	23	5	2024-07-31 20:35:16.902389	t
24	2	1	24	5	2024-07-31 20:37:23.62866	t
27	2	1	27	4	2024-07-31 21:33:39.529375	t
21	2	1	21	5	2024-07-31 19:32:50.259232	f
22	2	1	22	1	2024-07-31 20:34:03.840145	f
25	2	1	25	5	2024-07-31 21:29:34.844563	t
26	2	1	26	5	2024-07-31 21:30:31.092098	t
28	2	1	28	5	2024-07-31 21:34:16.275549	t
29	2	1	29	5	2024-07-31 23:12:05.480807	f
30	2	1	30	5	2024-07-31 23:12:29.988609	t
32	2	1	32	4	2024-08-01 01:16:24.2934	t
33	2	1	33	3	2024-08-01 01:16:49.038594	t
34	2	1	34	5	2024-08-01 03:23:51.72129	t
35	2	1	35	3	2024-08-01 03:26:10.750727	t
36	2	1	36	5	2024-08-01 03:59:53.101803	t
31	2	1	31	3	2024-08-01 01:15:54.278591	t
\.


--
-- Data for Name: restaurant_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_categories (id, restaurant_id, category, category_visible) FROM stdin;
1	1	thai	t
2	1	asian	t
6	4	grill	t
7	4	fried	t
8	5	burger	t
9	5	finnish	t
10	8	burger	t
11	14	lounge	t
12	18	indian	t
13	18	tandoori	t
14	1	restaurant	t
15	1	food	t
17	21	restaurant	t
18	21	food	t
20	3	egyptian	t
22	22	shopping_mall	t
23	22	supermarket	t
24	22	cafe	t
25	22	grocery_or_supermarket	t
26	22	clothing_store	t
27	22	store	t
28	22	restaurant	t
29	22	food	t
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurants (id, restaurant_name, address, restaurant_visible) FROM stdin;
2	Thai Ravintola Meelom Oy	Koskelantie 56, 00610 Helsinki	f
3	Egyptiläinen ravintola El Karim	Koskelantie 52, 00610 Helsinki	f
4	Ravintola Käpygrilli	Osmontie 5, 00610 Helsinki	f
5	Hesburger Käpylä Drive-In	Vähänkyröntie 2, 00610 Helsinki	f
6	Ravintola Nyyrikki	Pohjolankatu 2, 00610 Helsinki	f
7	Ravintola Iso Paja	Radiokatu 3, 00240 Helsinki	f
8	Burger King	Vähänkyröntie 2, 00610 Helsinki	f
9	Manse Seor Cafe	Intiankatu 33 00560 Helsinki	f
10	Sotto Pizza & Bar Käpylä	Mäkelänkatu 87 00610 Helsinki	f
11	Ravintola Old Sophie	Koskelantie 9 00610 Helsinki	f
12	CoolHead Brew / CoolHead Taproom	Gardenia Päärakennus Koetilantie 1 00790 Helsinki	f
13	Harju 8	Harjutori 8 00500 Helsinki Finland	f
14	Platinum Lounge	Areenankuja 1 00240 Helsinki Finland	f
15	Kahvila Aurinko	Jyrängöntie 2 00560 Helsinki Finland	f
16	Frangipani Bakery & Café	Intiankatu 25 00560 Helsinki	f
17	Beer restaurant Oljenkorsi / Olutravintola Oljenkorsi	Intiankatu 18 00560 Helsinki	f
18	Ravintola Tandoori Villa Metsälä	Niittyläntie 2 00620 Helsinki	f
19	Beer restaurant Jano / Olutravintola Jano	Mäkitorpantie 11 00620 Helsinki	f
20	Cafe Amore	Oulunkyläntie 7 00600 Helsinki	f
1	Krung Thep Thai Bistro Arabia	Hämeentie 153, 00560 Helsinki, Finland	t
21	Pizzeria Toli	Laurintie 147, 01400 Vantaa, Finland	f
23	joku	paikka	f
22	Shopping Centre Jumbo-Flamingo	Vantaanportinkatu 3, 01510 Vantaa, Finland	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, is_admin, email) FROM stdin;
1	dummy	doesnt_work_not_hashed	f	testi@esimerkki.fi
2	testi	scrypt:32768:8:1$TjnxviIkE1eCNNxE$9ab7cb5fbcb1ac6b057cfd936a81b29ee67a566d8fdc370ffeaef26c714b26c676f89944b52bde0813dd311fd9dee90a869ad2fc88631533f0c2987ebe64504a	f	testi@osote.com
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 36, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 36, true);


--
-- Name: restaurant_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_categories_id_seq', 29, true);


--
-- Name: restaurants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurants_id_seq', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: restaurant_categories restaurant_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_categories
    ADD CONSTRAINT restaurant_categories_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments comments_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ratings ratings_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: ratings ratings_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: restaurant_categories restaurant_categories_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_categories
    ADD CONSTRAINT restaurant_categories_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- PostgreSQL database dump complete
--

