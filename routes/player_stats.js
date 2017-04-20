SELECT (SELECT count(*) AS total_matches_played FROM player WHERE name = '') AS totalmatchesplayed, (SELECT count(*) FROM player WHERE name = '' and place = 0) AS totalmatcheswon, servfav.server_adr as fav_serv_adr, servfav.server_port as fav_serv_port, 


 FROM (SELECT server_adr, server_port, max(matches) AS maxmatches FROM (SELECT server_adr, server_port, count(*) AS matches FROM player WHERE name = '' GROUP BY server_adr, server_port) AS servermatchcount GROUP BY server_adr, server_port) AS servfav