#imagem NodeJS
FROM node:20

#definição do diretório de trabalho no contêiner
WORKDIR /app

#copiando os arquivos package e package-lock.json
COPY package*.json ./

#remover a pasta node_modules, caso exista
RUN rm -rf node_modules

#instalação de dependências
RUN npm install

#copiando o restante dos arquivos para o diretório de trabalho
COPY . .

#expondo a porta que a aplicação irá utilizar
EXPOSE 3333

#comando para rodar a aplicação
CMD [ "npm", "run", "dev" ]