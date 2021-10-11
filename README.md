# uber_clone
clone project

[nestjs](https://docs.nestjs.com/graphql/quick-start#code-first)

## /uber-backend
```
npm i @nestjs/graphql graphql apollo-server-express
```

### Type ORM
[TypeORM](https://typeorm.io/#/)
- Object Relational Mapping(객체 관계 매핑)
```
npm install --save @nestjs/typeorm typeorm pg
(https://docs.nestjs.com/techniques/database, https://typeorm.io/#/ 참고)
```  
  
[One to One](https://typeorm.io/#/one-to-one-relations)  
  
[Repository](https://docs.nestjs.com/techniques/database)  
  
### postgresql
[postgresql](https://www.postgresql.org/)
[pg_hba.conf](https://mozi.tistory.com/545)
[pgadmin4_key](https://smoh.tistory.com/404)
[pgadmin4](http://forum.goorm.io/topic/9056/pgadmin4-%EC%84%A4%EC%B9%98-%EA%B0%80%EB%8A%A5-%EC%97%AC%EB%B6%80-%EC%A7%88%EB%AC%B8/2)
```
install in goorm.io

	sudo apt update && sudo apt install postgresql postgresql-contrib

database server using:

    /usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start
	
	/usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main stop -m fast
```
```
(pg_hba.conf default setting)

# Database administrative login by Unix domain socket
local   all             postgres                                peer
 
# TYPE  DATABASE        USER            ADDRESS                 METHOD
 
# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
```

[like dotenv in nestjs](https://docs.nestjs.com/techniques/configuration)
```
npm i --save @nestjs/config
```

[joi for validation](https://joi.dev/api/?v=17.4.2)  

[Mapped types(Entitiy generates  db table, graphql type, dto)](https://docs.nestjs.com/graphql/mapped-types)  

[JWT](https://jwt.io/)  

[context](https://github.com/apollographql/apollo-server)  

[nestjs Middleware](https://docs.nestjs.com/middleware)  

[nestjs guard](https://docs.nestjs.com/guards)  
- determine whether a given request will be handled by the route handler or not, depending on certain conditions  
  
[create Random uuid](https://www.npmjs.com/package/uuid)  
  
[mailgun](mailgun.com)  
  
[got](https://github.com/sindresorhus/got#comparison)  
  
[A library to create readable "multipart/form-data" streams](https://www.npmjs.com/package/form-data)  