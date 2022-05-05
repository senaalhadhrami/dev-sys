   const { db, origin} = require('./config.json');
   var express = require('express'); 
   const {MongoClient} = require('mongodb');
   var bodyParser = require('body-parser');
   var cors = require('cors')
   const path = require('path');

   var app = express();
   
   var corsOptions = {
       origin
     };
   
   
   var indexRouter = require('./routes/index'); 
   var courseRouter = require('./routes/CourseRoutes'); 
   var examRouter = require('./routes/ExamRoutes'); 
   var departmentRouter = require('./routes/DepartmentRoutes'); 
   var auditRouter = require('./routes/AuditRoutes'); 
   var profileRouter = require('./routes/ProfileRoutes'); 
   var userRouter = require('./routes/UserRoutes'); 
   
   
   
   const PORT = process.env.PORT || 8080;
   
   // Middleware
   app.use(cors(corsOptions));
   // parse requests of content-type - application/json
   app.use(bodyParser.json());
   // parse requests of content-type - application/x-www-form-urlencoded
   app.use(bodyParser.urlencoded({ extended: true }));
   
   // allow to save images
   app.use("/api/images", express.static(path.join("api/images")));

   // allowing headers for Token and others
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });


   app.use('/api', indexRouter); 
   app.use('/api/course', courseRouter); 
   app.use('/api/exam', examRouter); 
   app.use('/api/profile', profileRouter); 
   app.use('/api/department', departmentRouter);  
   app.use('/api/audit', auditRouter);  
   app.use('/api/auth', userRouter);  
   
   app.listen(PORT, ()=>{
       console.log(`Server is running on port ${PORT}.`);
   })
   
   app.get("/", (req, res) => {
       res.json({ message: "Welcome to Fake Neptun!." });
   });