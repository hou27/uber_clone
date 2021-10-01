pgadmin4 설치를 실패 -> postgresql를 CLI환경에서 설정
```
/usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start

CREATE DATABASE uber_eats;

ALTER USER postgres WITH PASSWORD 'didc001!!';
```