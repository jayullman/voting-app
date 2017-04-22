# Voting App with Authentication

A full stack application integrated with MongoDB. Created with a Node/Express backend and a ReactJS front end.

### User Stories:
1. As an authenticated user, I can keep my polls and come back later to access them.

2. As an authenticated user, I can share my polls with my friends.

3. As an authenticated user, I can see the aggregate results of my polls.

4. As an authenticated user, I can delete polls that I decide I don't want anymore.

5. As an authenticated user, I can create a poll with any number of possible items.

6. As an unauthenticated or authenticated user, I can see and vote on everyone's polls.

7. As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

8. As an authenticated user, if I don't like the options on a poll, I can create a new option.

***

### API endpoints

#### Unprotected Routes (user does not have to be authenticated)

get list of all polls available to all viewers

`GET /polls`

Signs up new user and adds to DB

`POST /signup`

Logs user in

`POST /login`

Logs user out

`POST /logout`

Vote on a poll

`PUT /polls/:pollId?option=`

#### Protected Routes (user must be authenticated)

Go to the create new poll page if authenticated

`GET /createpoll`

create new poll if authenticated

`POST /createpoll`

Add option to poll if authenticated

`PUT /polls/newoption/:pollId?option=`

Delete poll if authenticated

`DELETE /polls/:pollId`

Get list of users poll if authenticated

`GET /mypolls`





