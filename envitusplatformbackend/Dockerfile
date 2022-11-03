FROM node:latest
ARG runCommand="build:prod"
ENV RUNCOMMAND=$runCommand
RUN npm install pm2 -g
RUN pm2 install typescript
WORKDIR /home/node/app
COPY / /home/node/app
EXPOSE 27017
EXPOSE 3000
RUN echo "$RUNCOMMAND"
ENTRYPOINT ["sh", "-c", "npm run $RUNCOMMAND"]