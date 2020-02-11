<h1  align="center"> Trivago Case Study </h1>  <br>

  

<p  align="center">

Sample microservice description.

</p>

  
  

## Table of Contents

  

-  [Table of Contents](#table-of-contents)

-  [Introduction](#introduction)

-  [Features](#features)

-  [Requirements](#requirements)

-  [EGO](#ego)

-  [Local](#local)

-  [Docker](#docker)

-  [Quick Start](#quick-start)

-  [Configure JWT Verification Key](#configure-jwt-verification-key)

-  [Run Local](#run-local)

-  [Run Docker](#run-docker)

-  [Testing](#testing)

-  [API](#api)

-  [Acknowledgements](#acknowledgements)

  
  
  
  

## Introduction

This project is a submission for a task sent by trivago for the recruitment process for a NodeJS job vacancy.
  
For one of your next big projects, the team has decided to go with microservices. There are multiple
experienced engineers with strong knowledge in NodeJS and while other programming languages
were on the table, the team decided to proceed with Node only. It is your task to develop a
containerized prototype for a small and simplified part of the system using docker-compose or
Kubernetes.
This part should enable frequent travellers to bypass the regular checkout flow and reserve a hotel
room using available "bonus points" when they have an account in the system. There are no given
API or payload specs and you are asked to come up with your own. In addition, you decide how the
communication between services should work.

  

## Architecture

The project implements the Micro services Architecture, and it has **three** main services.

 - Business Logic Service: 
   -
   This is the core of the business, it consists of three components (plugins).
   - Traveller Component: used for creating new travellers, and also update specific traveller *bonusPoints*
   - Room Component: Used for creating new rooms.
   - Booking Component: (TASK REQUIREMENT) This compnent has the main login for making reservations and cancelling them.
  - Monitoring Service
    -
    This Service is used for two main purposes: 
     - Audit Trail and monitor every action taken regarding room reservations and cacellation.
     - Sending Emails with reservation detailed info. (whether a one was made or cancelled)
    
    Some might argue that every service should has its logging and monitoring service or database, but i preferred to implement the *[Log Aggregation](https://microservices.io/patterns/observability/application-logging.html)* design pattern. This is the idea behind AWS CloudWatch.
 - Api Gateway Service
   -
   This is the public Service (TASK REQUIREMENT) and it is used to communicate with the BusinessLogic service.
   Authentication and Authorization (AS MENTIONED IN THE TASK) occurs here.

![Alt text](images/Architectue.svg?raw=true "Architecture")



  
  

## Requirements



  
  

### EGO

A running instance of [EGO](https://github.com/overture-stack/ego/) is required to generate the Authorization tokens and to provide the verification key.

  

[EGO](https://github.com/overture-stack/ego/) can be cloned and run locally if no public server is available.

  
  

### Local

*  [Java 8 SDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

*  [Maven](https://maven.apache.org/download.cgi)

  
  

### Docker

*  [Docker](https://www.docker.com/get-docker)

  
  

## Quick Start

Make sure the JWT Verification Key URL is configured, then you can run the server in a docker container or on your local machine.

  

### Configure JWT Verification Key

Update __application.yml__. Set `auth.jwt.publicKeyUrl` to the URL to fetch the JWT verification key. The application will not start if it can't set the verification key for the JWTConverter.

  

The default value in the __application.yml__ file is set to connect to EGO running locally on its default port `8081`.

  

### Run Local

```bash

$ mvn spring-boot:run

```

  

Application will run by default on port `1234`

  

Configure the port by changing `server.port` in __application.yml__

  
  

### Run Docker

  

First build the image:

```bash

$ docker-compose build

```

  

When ready, run it:

```bash

$ docker-compose up

```

  

Application will run by default on port `1234`

  

Configure the port by changing `services.api.ports` in __docker-compose.yml__. Port 1234 was used by default so the value is easy to identify and change in the configuration file.

  
  

## Testing

TODO: Additional instructions for testing the application.

  
  

## API

TODO: API Reference with examples, or a link to a wiki or other documentation source.

  

## Acknowledgements

TODO: Show folks some love.