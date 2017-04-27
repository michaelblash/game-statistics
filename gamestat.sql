--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: match; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE match (
    server_adr cidr NOT NULL,
    server_port smallint NOT NULL,
    server_mode character varying(20) NOT NULL,
    time_end timestamp without time zone NOT NULL,
    map character varying(80),
    frag_limit smallint,
    time_limit real,
    time_elapsed real
);


--
-- Name: player; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE player (
    server_adr cidr NOT NULL,
    server_port smallint NOT NULL,
    server_mode character varying(20) NOT NULL,
    match_time_end timestamp without time zone NOT NULL,
    name character varying(80) NOT NULL,
    frags smallint,
    kills smallint,
    deaths smallint,
    place smallint
);


--
-- Name: server; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE server (
    adr cidr NOT NULL,
    port smallint NOT NULL,
    name character varying(80)
);


--
-- Name: server_mode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE server_mode (
    server_adr cidr NOT NULL,
    server_port smallint NOT NULL,
    mode character varying(20) NOT NULL
);


--
-- Name: match_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY match
    ADD CONSTRAINT match_pkey PRIMARY KEY (server_adr, server_port, time_end);


--
-- Name: player_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY player
    ADD CONSTRAINT player_pkey PRIMARY KEY (server_adr, server_port, server_mode, match_time_end, name);


--
-- Name: server_mode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY server_mode
    ADD CONSTRAINT server_mode_pkey PRIMARY KEY (server_adr, server_port, mode);


--
-- Name: server_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY server
    ADD CONSTRAINT server_pkey PRIMARY KEY (adr, port);


--
-- Name: match_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY player
    ADD CONSTRAINT match_fkey FOREIGN KEY (server_adr, server_port, match_time_end) REFERENCES match(server_adr, server_port, time_end) ON DELETE CASCADE;


--
-- Name: match_server_adr_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY match
    ADD CONSTRAINT match_server_adr_fkey FOREIGN KEY (server_adr, server_port, server_mode) REFERENCES server_mode(server_adr, server_port, mode) ON DELETE CASCADE;


--
-- Name: server_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY match
    ADD CONSTRAINT server_fkey FOREIGN KEY (server_adr, server_port) REFERENCES server(adr, port) ON DELETE CASCADE;


--
-- Name: server_mode_server_adr_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY server_mode
    ADD CONSTRAINT server_mode_server_adr_fkey FOREIGN KEY (server_adr, server_port) REFERENCES server(adr, port) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

