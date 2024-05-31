import express, { request, response } from "express";
import data from "./data/MOCK_DATA.json";

const app =express(); //Function that returns instance(object) of Express Application that has methods and properties. This object is assigned to constant app

const PORT = 3000;


//Middleware Function
app.use((request,response,next)=>{
    console.log(`${request.method} : ${request.url}`);
    next();
  
});

//To serve static files we can use middleware function express.static
//Using a public folder at a root of project
//Root directory will be folder where the server will first check for resources requested
app.use(express.static("public"));

//Use images folder at the route /images
app.use('/images',express.static("images"));




app.get("/",(request,response)=>{
    response.json(data);
});



app.get("/class/:id",(request,response)=>{
    const studentId = Number(request.params.id);
    let student = NaN;
    let studentFound = false;
    for (let index = 0; index < data.length; index++) {
        if (studentId === data[index].id) {
            student = data[index];
            studentFound = true;
        }
        
    }
    
    if (studentFound) {
        response.send(student);
    } else {
        response.send(`Student with id: ${studentId} not found`);
    }
});

//Using filter method of javascript
app.get("/students/:id",(request,response)=>{
    //Middleware: Access the routing parameters
    const studentId = Number(request.params.id);

    //Everthing above this line of code is middleware 
    response.send(data.filter((student) =>student.id === studentId));
});

//POST request
app.post("/create",(req,res)=> {
    res.send("This is a POST Method at /create");
});

// PUT request
app.put("/edit",(req,res)=>{
    res.send("This is a PUT method at /edit");
});

// DELETE request
app.delete("/delete",(req,res)=>{
    res.send("This is a DELETE Method at /delete");
});

//Using next to create Multiple call back.
app.get('/next',(request,response,next)=>{
    const userId = request.params.id;
    next()
 },(request,response)=>{

    response.send('This is second callback Function');
 });

//Redirect Response Method
app.get('/redirect',(request,response)=>{
    response.redirect('https://www.geeksforgeeks.org/');
});

//Download Response Method
app.get('/download',(request,response)=>{
    response.download('./images/mt-Fuji.jpg');
})



//Accessing request and response object in middleware function
//Here printUserId is middleware function
app.get('/sum',sum,(request,response)=>{
    
    response.send('Sum:' +request.sum);
    
});

function sum(request,response,next) {
    const number1 = Number(request.query.number1);
    const number2 = Number(request.query.number2);
    
    request.sum = number1 + number2;
    next();
};

//use of next('route');

function checkAdmin(request,response,next) {
    const isAdmin = request.query.admin === 'true'; // Check if admin query parameter is true

    if (!isAdmin) {
        console.log('Not an admin, skipping admin middleware...');
        next('route'); // Skip the remaining middleware for this route
    } else {
        console.log('Admin user, processing admin middleware...');
        next(); // Proceed to the next middleware
    } 
    
}

function adminMiddleware(request, response, next) {
    console.log('Admin middleware executed');
    next(); // Proceed to the next middleware or route handler
}

app.get('/user/:id', checkAdmin, adminMiddleware, (request, response) => {
    response.send(`User route: User ID is ${request.params.id}`);
});

app.get('/user/:id', (request, response) => {
    response.send(`userid: ${request.params.id}`);
});



//Route Chaining
//Route chaining is ideal to use for routes with same route path but have different http methods
app
.route('/class')
.get((request,response)=>{
    response.send("Retrieving Class Data");
})
.post((request,response)=>{
    response.send("Creating Class Data");
})
.put((resquest,response)=>{
    response.send("Editing Class Data");
})
.delete((request,response)=>{
    response.send("Deleting Class Data");
})

//Middleware Function
//For the below http method GET placeOrder function is middleware which has access to request,response and next object and we can directly define the function body of middleware as an argument.
app.get('/middleware',function placeOrder(request,response) {
    const id = request.query.orderId;
    response.send(`Order with order id: ${id} placed!` );
    
});


// the fact that you are modifying the in-memory representation of your data but not persisting these changes back to the MOCK_DATA.json file. When you modify data (which is initially loaded from MOCK_DATA.json), these changes only exist in the memory of your running Node.js application. They do not automatically get written back to the file.

//Making use of express.json() to send JSON payload 
// app.use(express.json());

// Making use of express.urlencoded to send JSON payload.
// Only the way we pass JSON data changes as reposne using express.JOSN() and express.urlencoded() remains same 
app.use(express.urlencoded({extended:true}));

//Making use of request object to access JSON payload
app.post('/item',(request,response)=>{
    console.log(request.body);
    data.push(request.body);
    response.send(data);
});

//Throw error using Error()
app.get("/error/checkerror",(request,response)=>{
    throw new Error();
});

// Error handling middleware
app.use('/error',(error,request,response,next)=>{
    console.error(error.stack);
    response.status(500).send("Something is broken!");
});


app.listen(PORT,()=>{
    console.log(`This server is up and running at port:${PORT}!!!`)
    // console.log(data[11].id);
    // const studentFound = true;
    // console.log(typeof(studentFound));
    // const number = [99,97,95,93];
    const uid = 19;
    console.log(typeof(uid));
    const users = [];
    data.forEach(user => {
        if (user.id === uid) {
            
            console.log(user); 
        }   
    });
  
});