# fake NEPTUN
This is a Fake Neptun system

## Description
- Three roles: admin, teacher and student. Admin can create and share courses with the students.
Teachers can only create  or modify the courses where they are the given teachers, but cannot share them with students.
The courses that are created by teachers are in draft status, it is open only if the admin confirms that. 
Course information must contain name, description, schedule, student limit, teacher’s name. 
Students can apply for the available courses only if the limit for the number of students is not reached. 
They can also list the available courses and also the taken ones. Registration is open only for students, teachers and admins are pre-registered.


## Running and Installation
### Back End /api
* npm i
* node index

### Front End /client
* npm i
* ng serve

### Administration /admin
* npm i
* ng serve


 
### Schema
![Database Schema](/analysis/schema.jpg)