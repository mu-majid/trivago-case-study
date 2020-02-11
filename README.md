<h1  align="center"> Trivago Case Study </h1>  <br>

  

<p  align="center">

Sample microservice description.

</p>

  
  

## Table of Contents

  

-  [Table of Contents](#table-of-contents)

-  [Introduction](#introduction)

-  [Features](#features)

-  [Requirements](#requirements)

-  [Local](#local)

-  [Docker](#docker)

-  [Quick Start](#quick-start)


-  [Run Docker](#run-docker)

-  [Testing](#testing)

-  [Flow Charts](#flow-charts)


  
  
  
  

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

![Alt text](images/Arch.png?raw=true "Architecture")
  
## Database Models: 

Database Used Is MongoDB.

Each service has its own database (following microservices architecture), and the following are database entities per service:

* Business Logic Service:
  - 
  - it has three different entities :

	Booking entity
	``` 
	bookingKey: {type:  String, required:  true },
	travellerKey: { type:  String, required:  true },
	roomKey: { type:  String, required:  true },
	status: { type:  String, enum: ['RESERVED', 'PENDING_APPROVAL', 'CANCELLED'] },
	active: { type:  Boolean, default:  true }
	```
	Room entity
	``` 
	roomName: { type:  String, required:  true },
	roomKey: { type:  String, required:  true },
	requiredPoints: { type:  Number, default:  0 },
	availableAmount: { type:  Number, default:  1 }, // available rooms
	```
	Traveller entity
	``` 
	email: { type:  String, required:  true, unique:  true },
	name: { type:  String },
	travellerKey: { type:  String, required:  true },
	bonusPoints: { type:  Number, default:  0 }
	```
 * Monitor Service
   -
   - It has only one model
	Audit entity
		```
		userId: { type:  String, required:  true },
		resource: { type:  String, required:  true },
		resourceId: { type:  String, required:  true },
		action: { type:  String, required:  true },
		data:{ type:  Schema.Types.Mixed },
		status: { type:  String, enum: ['SUCCESS', 'ERROR'] }
		```

 * API GateWay Service
   -
   - It has three models
	User entity
		```
		userId: { type:  String, required:  true },
		role: { type:  String, required:  true, enum: ['CUSTOMER', 'ADMIN'] },
		email: { type:  String },
		name: { type:  String }
		```
		
		Log entity
		```
		userId: { type:  Schema.Types.Mixed },
		method: { type:  String },
		status: { type:  String },
		path: { type:  String },
		statusCode: { type:  Number },
		response: { type:  Schema.Types.Mixed },
		payload: { type:  Schema.Types.Mixed }
		```
		
		Consumer entity
		```
		api_key: { type:  String, required:  true },
		type: { type:  String, required:  true, enum: ['public', 'private'] },
		```
## Requirements


An internet connection of course.

### Local
*  NodeJS v12.14.0
*  MongoDB
*  Npm v6.13.4

### Docker
*  Docker version 19.03.2
*  docker-compose version 1.21.0

 
## Quick Start

When a traveller is created, a token id sent back in the response. This token with traveller email or his key (userId in req body) should be passed with each request a traveller issues.

For the admin user there is only one user seeded (I have not added routes to create system users).

Tokens for public and private users could be found in the seeded data snippets below.

The database of each service will be seeded when you start the application to make testing easier, and here is the data seeded for each service:

  I had different ideas to seed the database ( with a container that whole purpose is to seed the database when we run `docker-compose up` , A route that you make a request to and db will be seeded, and the third option was to insert documents when each service connect to the database ).

I chose the third option, so now when you start the app, each service will seed its data.

* Business Service:
``` javascript
const  travellers  = [
	{
		email:  "test@test.com",
		bonusPoints:  75,
		travellerKey:  'KeyOne',
		name: 'JohnDoe'
	},
	{
		email:  "test2@test.com",
		bonusPoints:  150,
		travellerKey:  'KeyTwo',
		name: 'JohnDoe2'
	},
	{
		email:  "test3@test.com",
		bonusPoints:  35,
		travellerKey:  'KeyThree',
		name: 'JohnDoe3'
	}
];

const  rooms  = [
	{
		roomName:  "Suite C2",
		requiredPoints:  250,
		availableAmount:  2,
		roomKey:  'RoomOne'
	},
	{
		roomName:  "Single Room C2",
		requiredPoints:  100,
		availableAmount:  1,
		roomKey:  'RoomTwo'
	},
	{
		roomName:  "Single Room C3",
		requiredPoints:  100,
		availableAmount:  5,
		roomKey:  'RoomThree'
	}
];

```
  

* API GateWay:
```javascript
const  users  = [
	{
		email:  "admin@admin.com", 
		userId:  '111',
		role:  'ADMIN',
		name:  'John Admin',
		token:  'private-token' // P/oa1XVdX0rkOQLNjNpAvv/2oCdZlC5fwzyaK/mvdPk=
	},
	{
		email:  "test@test.com",
		role:  'CUSTOMER',
		userId:  'KeyOne',
		name:  'JohnDoe',
		token:  'public-token-1'  // MXFTroJt3r8037wCXq0wA+gWCTP1QoG884F5fdk39J4=
	},
	{
		email:  "test2@test.com",
		role:  'CUSTOMER',
		userId:  'KeyTwo',
		name:  'JohnDoe2',
		token:  'public-token-2'  // t3sgjSE66KsuTBtRI21/PUU7oPUpwwIOrzpAUPrrW/8=
	},
	{
		email:  "test3@test.com",
		role:  'CUSTOMER',
		userId:  'KeyThree',
		name:  'JohnDoe3',
		token:  'public-token-3'  // vYSYLt1OzKvkWtmYuVUYmCRbSf20H4b/Gr1C1DzBmp8=
	}
];

const  consumers  = [
	{
		api_key:  "MXFTroJt3r8037wCXq0wA+gWCTP1QoG884F5fdk39J4=",
		type:  'public'
	},
	{
		api_key:  "t3sgjSE66KsuTBtRI21/PUU7oPUpwwIOrzpAUPrrW/8=",
		type:  'public'
	},
	{
		api_key:  "vYSYLt1OzKvkWtmYuVUYmCRbSf20H4b/Gr1C1DzBmp8=",
		type:  'public'
	},
	{
		api_key:  "P/oa1XVdX0rkOQLNjNpAvv/2oCdZlC5fwzyaK/mvdPk=",
		type:  'private'
	}
];
```
  

### Run Docker

  Change directory to the project's root (where `docker-compose.yml` is ) and run the following command which will build the images if the images **do not exist** and starts the containers.

When ready, run it:

```bash

$ docker-compose up

```

Application (ApiGateway Public Service) will run by default on port `8080`

  

Configure the port by changing `services.gateway.ports` in __docker-compose.yml__. Port 8080 was used by default so the value is easy to identify and change in the configuration file.

  
  

## Testing

### Configure Api Keys.

When testing the Api, every call requires an api key. Public Api Key for public endpoints, and Private Api Key for the restricted ones.

When importing postman collection for testing (Section Below). provide these keys: 

```
public-api-secret: public-api-secret
private-api-secret: private-api-secret
```
  

The Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection click `Edit` to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection: (Change these variables when you want test different tokens)

![Alt text](images/import-collection-5.png?raw=true "Image 5")

Then right click on the `Private Calls` folder, and write the following in the Authorization tab

![Alt text](images/import-collection-5.png?raw=true "Image 6")

![Alt text](images/import-collection-5.png?raw=true "Image 7")

And the sane for the `Public Folder`:

![Alt text](images/import-collection-5.png?raw=true "Image 8")

  
  


## Flow Charts

  

These are the flow charts for the basic POC functionalities :

  

- Public Authentication:

![Alt text](images/public-auth.png?raw=true  "Image 9")

  

- Private Authentication:

![Alt text](images/private-auth.png?raw=true  "Image 10")

  
  

- Making Reservation:

![Alt text](images/make-reservation.png?raw=true  "Image 11")

  

- Cancel Reservation:

![Alt text](images/cancel-reservation.png?raw=true  "Image 11")