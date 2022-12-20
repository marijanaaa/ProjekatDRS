#5 commends here is layers of our image. images is based on our layers. every layer is cached
FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
#expose is more for documentation
EXPOSE 3000 
CMD ["npm","start"]