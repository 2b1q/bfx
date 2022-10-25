# BFX

# init 
```sh
npm i
```

# run grape servers
```sh
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
```

# run
```sh
node server.js # run server
npx nodemon client.js # run client1
npx nodemon client.js # run clientN
```