# Endpoints

## Unathorized routes
### User

**POST /register**
takes name, e-mail and password

**POST /login**
takes e-mail and password

___
## Authorized routes
Note: All authorized routes requires credentials include
### User

**GET /user**


**PATCH /update-user**
cannot be used to update password, use dedicated route for that

**PATCH /update-password**


**DELETE /delete-user**


**POST /logout**


### Admin
Note: Admin routes can only be accessed by user that is admin 

**GET /admin/users**


**GET /admin/user/:userId**


**PATCH /admin/update-user/:userId**
cannot be used to update password, use dedicated route for that

**PATCH /admin/update-user-password/:userId**


**DELETE /admin/delete-user/:userId**


### Schedule

**GET /schedules**


**GET /schedule/:scheduleId**


**POST /create-schedule**


**PATCH /update-schedule/:scheduleId**


**DELETE /delete-schedule/:scheduleId**


### Course

**GET /courses**


**GET /schedule/courses/:scheduleId**
this route is used to both add and remove a course from a schedule


**GET /course/:courseId**


**POST /create-course**


**PATCH /update-course/:courseId**


**DELETE /delete-course/:courseId**
