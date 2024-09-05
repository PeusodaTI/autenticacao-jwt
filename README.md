# API Biblioteca Virtual
[![NPM](https://img.shields.io/npm/l/react)]([(https://github.com/PeusodaTI/autenticacao-jwt/blob/main/LICENSE)]) 

# Sobre o projeto

https://api-autenticacao-jwr.onrender.com/docs-api/

API Autenticação JWT é uma aplicação desenvolvida para aprimorar meus conhecimentos em desenvolvimento de API Restfull.

A aplicação consistem em uma ferramenta para gerência de usuários utilizando a estratégia de autenticação JWT. Assim, é possível realizar as quatro operações básicas de banco de dados, cadastro, leitura, atualização e exclusão, desde que seja realizado o login e inserido o token nas requisições para o servidor.

A aplicação foi documentada utilizando a ferramenta Swagger UI. Desse modo, qualquer usuário pode testar os endpoints da aplicação através da interface de usuário.

## Layout Swagger
![Swagger](https://github.com/PeusodaTI/autenticacao-jwt/blob/main/assets/swagger.png)

# Tecnologias utilizadas
## Back end
- Docker
- Express
- Json Web Token (JWT)
- Node
- Prisma
- Typescript
- Zod
  
## UI
- Swagger UI

## Implantação em produção
- Back end: Render
- Banco de dados: Postgresql

# Como executar o projeto

## Back end
Pré-requisitos: Docker, Node v20.16.0, Npm v10.8.1 

```bash
# clonar repositório
git clone https://github.com/PeusodaTI/autenticacao-jwt.git

# entrar na pasta do projeto back end
cd autenticacao-jwt

# instalar dependências
npm install

# iniciar o docker para criação do container para utilização de uma instância do banco de dados PostgreSql e da API
docker compose up --build

# executar as migrations
obs: é necessário criar o arquivo .env e copiar as informações de configurações do DB dentro do arquivo .env.example para o arquivo .env. após isso, execute o comando:

npx prisma migrate dev 

# executar o projeto
npm run dev

# utilizar interface do Prisma para acompanhamento das persistências de dados
npx prisma studio

# acessar a interface da API
http://localhost:3333/docs-api

```

# Autor

Pedro Henrique Sousa Nascimento

https://www.linkedin.com/in/peusodati

