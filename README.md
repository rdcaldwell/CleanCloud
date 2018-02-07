#FiscJanitor

## Node Setup
* Run `npm install` to install the project dependencies
* Run `npm run server` to build the project and run the node server

## Docker setup
* Install docker if you don't have it already
* Pull the docker image with `docker pull mlafeldt/simianarmy`
* Verify your email address in Amazon Simple Email Service before running the container. 

## Docker commands
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

* to remove the container
```
docker rm $containerId
```

* for follow logs
```
docker logs $containerId -f
```

## Links
Simian army terraform link:
https://github.com/kaofelix/simian-army-terraform

Simian army docker link:
https://hub.docker.com/r/mlafeldt/simianarmy/