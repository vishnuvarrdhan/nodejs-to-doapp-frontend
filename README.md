# ToDo Application with RestAPI, Mongoose and mongoDb

**DESCRIPTION:** 
  - This is a NodeJS application which enables the authorized user to create, update, delete a list of todos.
  - The user can update the ToDo title and also the status of ToDo from 'not completed' to 'completed' or vice-versa
  - when the complete status is changed to 'completed', the timestamp at which the ToDo got completed is displayed in ToDo item
  - when the complete status is changed to 'Not completed', the timestamp will be removed
  
**FEATURES:**
  - In order to use this application's services, the user has to sign up with this application.
  - Enabled Validation to check whether the entered emailid and password are valid or not.
  - All the user and Todo information is stored in the Database.
  - This application can handle and maintain individual records for each customer.

**TECHNICAL FEATURES:**

**FRONTEND:**
   - The application interface renders depending upon the device screen(mobile or web)
   - Used **Responsive Web Design Styling Techniques** for making the application device screen independent 
   - Used **handlebarsJS** for designing and rendering of the front end
   - Used **Request** library for making Http Request.
   - Used **Express-Session** to maintain the user details within a given session
   - Used **ExpressJS** for building web application
   - Used **momentJS** for displaying the timestamp
   - Hosted this application in **Heroku cloud platform services**

**BACKEND:**
   - Designed a RestAPI for handling authentication, validation and storing of ToDo information in NoSQL mongoDB
   - Designed the RestAPI by using **mongooseJS**, which helps the RestAPI to interact with MongoDB
   - Used **jsonwebtoken** library for security and authentication
   - Used **ExpressJS** for building web application
   - Hosted this application in **Heroku cloud platform services**

**LINK FOR BACKEND CODE:**(https://github.com/YashwanthThota/nodejsTodoRESTapi)
 
**LIBRARIES AND PACKAGES:**
 - **Express:** it is a web application framework that provides you with a simple API to build websites, web apps and back ends
 - **hbs:** it is used for building semantic templates
 - **request:** it is used for communicating with 3rd party application
 - **moment:** used for calculating timestamp
 - **MongoDB:** used for handling and maintaining mongoDB
 - **mongoose:** used for manipulating MongoDB
 
**DEMO LINK(HOSTED IN HEROKU):**
 (https://afternoon-harbor-99864.herokuapp.com/)

