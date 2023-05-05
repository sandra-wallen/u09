# u09

### Information about the project
This project was built as the 9th assignment in the Fullstack Developer program at Chas Academy.

My initial idea was that I wanted to build a schedule generating app. The user could create schedules, 
enter how long the schedule would be ongoing and then add courses to the schedule. And my vision what that this 
would then be generated to a visual presentation of the schedule in a weekly view, where each course would 
be aligned in the view based on the start time and duration. This idea came from
the app Agendo which is used by dance studios, fitness studios and others. 

The project unfortunately did not turn out that way, along the way I realised that the auto generated 
schedule idea was too complicated for this assignment. The set up of the API and the required front end 
logic to even be able to CRUD users, CRUD schedules, CRUD courses etc. left no time to start working on 
the main idea of the app. So I had to rethink and came to the conclusion that as it is now, that is the
minimal valuable product and the auto generated schedule is a stretch goal. Even thought the application 
doesn't really fulfil the purpose as it is now, I hope that it will at least meet the requirements of the 
assignment.

### How to use the app
To be able to use the app the user must create an account and then log in. Once logged in the user can start 
creating schedules and courses. All schedules and courses are tied to the user and cannot be 
shared by multiple users. Schedules and courses are not tied to each other, a course is created in another 
table in the database and when the course is added to a schedule there's the courses id is patched to the 
schedule. This enables courses to be added to multiple schedules without having to create a new one for each 
schedule.

Admin users are the only ones who can create admin users or update existing user to admin in the frontend. 
Admins can CRUD all the users. 

### Deployment
This repo is a monorepo and both backend and frontend are deployed at render.
* Backend - https://sandra-wallen-u09.onrender.com
* Frontend - https://u09-fe.onrender.com

### Other notes
I started the frontend as a React app but realised pretty quickly that I wanted to write it in Vue instead. 
The frontend that is deployed and working is FE/vue-app.
Documentation on the API endpoints can be found in the readme inside BE/.
