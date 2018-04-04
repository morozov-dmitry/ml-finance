FROM node:carbon

WORKDIR "/application/src/api"

RUN npm install --global nodemon

RUN npm install
CMD node index.js

EXPOSE 8082

CMD ["nodemon", "-L", "/application/src/api/index.js"]