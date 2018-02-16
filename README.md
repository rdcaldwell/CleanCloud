# FiscJanitor

## Node Setup
* Run `npm install` to install the project dependencies

## Envrionment Variables Setup
* Create a '.env' file in the root directory of the project that looks like this:
```
DB_USERNAME=
DB_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
REGION=
JWT_SECRET=
``` 

## Development Servers
* Run `npm run angular` to run the Angular server
* Run `npm run node` to run the Node.js server
* Port 4200

## Production Server
* Run `npm start`
* Port 3000

## Docker setup
* Install docker if you don't have it already
* Pull the docker image with `docker pull mlafeldt/simianarmy`
* Verify your email address in Amazon Simple Email Service before running the container

## Docker commands
* Run docker container
```
docker run -d \
    -e SIMIANARMY_CLIENT_AWS_ACCOUNTKEY=$your_account_key \
    -e SIMIANARMY_CLIENT_AWS_SECRETKEY=$your_secret_key \
    -e SIMIANARMY_CLIENT_AWS_REGION=$your_region \
    -e SIMIANARMY_CALENDAR_ISMONKEYTIME=true \
    -e SIMIANARMY_CHAOS_ENABLED=false \
    -e SIMIANARMY_CHAOS_LEASHED=false \
    -e SIMIANARMY_JANITOR_ENABLED=true \
    -e SIMIANARMY_JANITOR_LEASHED=false \
    -e SIMIANARMY_JANITOR_NOTIFICATION_DEFAULTEMAIL=$your_email \
    -e SIMIANARMY_JANITOR_SUMMARYEMAIL_TO=$your_email \
    -e SIMIANARMY_JANITOR_NOTIFICATION_SOURCEEMAIL=$your_email \
    -p 8080:8080 \
    mlafeldt/simianarmy
```
* Show the containers that are running currently
```
docker ps
```

* Stop the running container using the container id from the ps command 
```
docker stop $containerId
``` 

* Remove the container
```
docker rm $containerId
```

* Follow logs
```
docker logs $containerId -f
```

## Links
Simian army terraform:
https://github.com/kaofelix/simian-army-terraform

Simian army docker:
https://hub.docker.com/r/mlafeldt/simianarmy/