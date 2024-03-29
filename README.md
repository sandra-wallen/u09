# u09

## NOTE
PLEASE NOTE THAT THE FRONTEND THAT IS BEING USED IS THE VUE-APP! THE REACT APP IS CONSIDERED ARCHIVED BUT I AM AFRAID TO DELETE IT :P.

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

### PWA
It is a requirement of the assignment that the application is a progressive web app. It has to be
available for download and have minimal offline functionality.

I've used IndexedDb to store schedules, courses and users (admin only) and logged in user is stored in 
localStorage. I've used an npm package called Localbase (https://github.com/dannyconnell/localbase) to work with indexedDb. Thank god for the creators of
that package, indexedDb was not the most fun tool to work with :P. 

Schedules, courses and users are all stored in different databases which might seem odd since they could just be
stored in different object stores within the same database but I ran into some issues with querying the same database
at the same time from multiple places that's why I've set it up this way.

Functionality when offline is very limited. It is only possible to read all schedules, courses, users and logged in user.
There is no possibility to create, update or delete and I've hidden or disabled links and buttons that would do those type of operations.

### Deployment
This repo is a monorepo and both backend and frontend are deployed at render.

Please note that as the backend is deployed at Render it takes a few minutes to kick
start the server when it hasn't been queried for a while.

There is also a hickup where Render doesn't know what to render at /, which is set in the router to render schedules page.
I have fixed the other issues with routing that I encountered when deploying at Render but this one won't work unfortunately.
If you run in to this problem where no page is rendered, only the nav bar is visible, please just click any link in the nav bar and everything
should work.
* Backend - https://sandra-wallen-u09.onrender.com
* Frontend - https://u09-fe.onrender.com

### Other notes
I started the frontend as a React app but realised pretty quickly that I wanted to write it in Vue instead. 
The frontend that is deployed and working is FE/vue-app.
Documentation on the API endpoints can be found in the readme inside BE/.
