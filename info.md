pgadmin4 설치를 실패 -> postgresql를 CLI환경에서 설정
```
/usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start

CREATE DATABASE uber_eats;

ALTER USER postgres WITH PASSWORD 'didc001!!';
```
  
first test  
```
mutation {
  createRestaurant(input:{name: "first test", isVegan: false, address: "K", ownersName: "test", categoryName: "test value"})
}

SELECT * FROM restaurant;
```
```
mutation {
  updateRestaurant(input: {
    id:3,
    data: {
      name: "updated first"
    }
  })
}

SELECT * FROM restaurant;
```
  
first user test  
```
mutation {
  createAccount(input: {
    email:"test@gmail.com",
    password:"12345",
    role:Client
  }) {
    ok
    error
  }
}

SELECT * FROM public.user;
```