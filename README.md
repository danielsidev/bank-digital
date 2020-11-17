# API
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Uma API para gerenciar cntas bancárias

### Requerimentos

Requer [Node.js](https://nodejs.org/) v12+ , [Typescript](https://www.typescriptlang.org/) v3+, MySQL 5.7 para rodar.

### Configuração
Edite as variáveis de ambiente no arquivo .env na raiz do projeto para configurar o acesso ao banco de dados.
Coloque os valores de acesso para um mysql local com o usuário, senha, nome do banco e host.

Abra um terminal, na raiz do projeto e aloque as variáveis de ambiente, através no comando:
```sh
$ set -a; source .env; set +a
```
### Instalação
Abra um terminal, na raiz do projeto, e instale as dependências. 
```sh
$ npm install 
```
Execute a criação das tabelas através do comando:
```sh
$ npm run migration 
```
### Para ambiente Dev
Abra uma segunda guia do terminal, na raiz do projeto, e execute:
```sh
$ npm run gulp
```
Na primeira guia do terminal, na raiz do projeto, execute:
```sh
$ npm run dev 
```

### Para ambiente Prod

```sh
$ npm run prod 
```
----
 >O Gulp, através do typescript, realizará a transpilação do código .ts em .js, e alocará no diretório dist na raiz do projeto. Esse é o diretório para publicação.
 
 ----
 >No ambiente de DEV, o gulp ficará assistindo os arquivos .ts, logo a cada alteração em um arquivo .ts, dentro de 5 segundos, um novo arquivo .js será gerado ou atualizado.
 ----
 >No ambiente de PROD, o gulp gerará um única vez o diretório dist com a transpilação dos arquivos Typescript e acionará o node para levantar a aplicação apontando para o server na raiz do dist.
 ---
 # Postman - Testes
 ---
 Importar no Postman a collection Z-Tech.postman_collection.json que encontra-se dentro do diretório postman.
 >/postman/Z-Tech.postman_collection.json
 
 
 O número das contas é criado randomicamente, logo bastar acessar o folder Account e cria 2 usuarios que 2 contas serão criadas. Depois basta acessar o endpoint para listar os contas e verificar as contas e usuários donos delas. 
 
 ---
 # Rotas da Aplicação
 #### Host: localhost:5000
 
## Criação de Conta
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/account|

```
Example:
 {
    "fullname":"Silvana da Silva",
    "cpf":"009.123.876.00"
 }
```
|Response JSON| Status 200| 
|---|---|  
```
{
    result:true, 
    response:'Create account with sucess!'
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"User already exists"
}
```

|Response JSON| Status 400| 
|---|---|  

```
/** Se o horário conflitar com algum existente no mesmo dia da semana **/
{
    "success": false,
    "error": "We can not create account in this moment"
}
```
---
## Listar Contas Paginadas
|Request || 
|---| ---| 
|Content-Type|application/json| 
|GET: | /accounts/{init}/{limit}|
|PARAM| init: number|
|PARAM| limit: number|


|Response JSON |Status 200|  
|---|---|  
```
Example:
 {
    "result": true,
    "response": "Get accounts by init:0 and limit:2 with success",
    "data": [
        {
            "account_id": 1,
            "account_number": "9813958-3",
            "account_agency": "0001",
            "user_id": 1,
            "account_balance": 4952,
            "account_type": "pf",
            "user_fullname": "Silvana da Silva",
            "user_cpf": "009.123.876.00"
        },
        {
            "account_id": 2,
            "account_number": "6310026-9",
            "account_agency": "0001",
            "user_id": 2,
            "account_balance": 0,
            "account_type": "pf",
            "user_fullname": "Marcos da Silva",
            "user_cpf": "109.623.976.00"
        }
    ]
}
```
---
## Criação de Depósito
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/transaction/deposit|

```
Example:
 {
    "value":5000.00,
    "account_number":"9813958-3", /* Utilize a rota: /accounts/all/0/100 para selecionar uma conta */
    "origin_transaction":"Bank slip - Account deposit"
 }
```
|Response JSON| Status 200| 
|---|---|  
```
{
    result:true, 
    response:'Deposit done with success. Account Update!'
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Account Not found"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Invalid fields"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Error on set deposit"
    data: Error Object Response
}
```


---
## Criação de Saque
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/transaction/withdraw|

```
Example:
 {
    "value":50.00,
    "account_number":"9813958-3", /* Utilize a rota: /accounts/all/0/100 para selecionar uma conta */
    "origin_transaction":"ATM 24h"
 }
```
|Response JSON| Status 200| 
|---|---|  
```
{
    result:true, 
    response:'Withdraw done with success. Account Update!'
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Account Not found"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"The new balance will be zero or negative!"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Invalid fields"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Error on set withdraw"
    data: Error Object Response
}
```
---
## Criação de Transferência
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/transaction/transfer|

```
Example:
 {
    "value":100.00,
    "account_number_origin":"9813958-3",/* Utilize a rota: /accounts/all/0/100 para selecionar uma conta */
    "account_number_destiny":"6310026-9"/* Utilize a rota: /accounts/all/0/100 para selecionar uma conta */
 }
```
|Response JSON| Status 200| 
|---|---|  
```
{
    result:true, 
    response:'Transfered with success!'
}
```


|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"One of the accounts was not found"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Error on Withdraw! Rollback Transfer!"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"The new balance will be zero or negative!"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Invalid fields"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    result:false, 
    response:"Error on set transfer"
    data: Error Object Response
}
```
---
## Listar Transações Paginadas
|Request || 
|---| ---| 
|Content-Type|application/json| 
|GET: | /transactions/all/{init}/{limit}|
|PARAM| init: number|
|PARAM| limit: number|


|Response JSON |Status 200|  
|---|---|  
```
Example:
 {
    "result": true,
    "response": "Transactions loaded with success",
    "data": [
        {
            "transaction_id": 1,
            "transaction_origin": "Bank slip - Account deposit",
            "transaction_destiny": "9813958-3",
            "transaction_type": 1,
            "transaction_value": 5002.5,
            "transaction_value_original": 5000,
            "transaction_deposit_fee": 0.0005,
            "transaction_withdrawal_fee": 0,
            "transaction_type_operation": 1,
            "transaction_account": 1,
            "transaction_created_at": "2020-11-16T20:46:36.000Z",
            "transaction_updated_at": "2020-11-16T20:46:36.000Z",
            "transaction_type_id": 1,
            "transaction_type_name": "entrada",
            "transaction_type_operation_id": 1,
            "transaction_type_operation_name": "deposito",
            "account_id": 1,
            "account_number": "9813958-3",
            "account_agency": "0001",
            "user_id": 1,
            "account_balance": 5002.5,
            "account_type": "pf"
        }
    ]
}
```
---




