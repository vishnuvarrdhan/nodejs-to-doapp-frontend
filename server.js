// /const request = require('request');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require('moment');
const hbs = require('hbs');
const publicPath = path.join(__dirname, '/public')
//config for heroku
const port = process.env.PORT || 3000;

var url = 'https://obscure-tor-77056.herokuapp.com';
var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
app.use(express.static(publicPath));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.set('viewengine', 'hbs');

app.all('/',(req,res) => {

res.render('index.hbs',{
});
});
app.all('/logout',(req,res) => {
  req.session.destroy();
  //req.session.save();
  res.render('index.hbs',{
  });
});
app.all('/create',(req,res) => {

res.render('create.hbs',{
});
});

app.all('/register', (req,res) =>{
//it renders about.hbs page and it will send the values to that page
res.render('register.hbs', {
  // pageTitle: 'About Page',
  // currentYear: new Date().getFullYear()
});
});

app.all('/view/:view', (req,res) =>{
  var value = req.params.view;
  console.log(value);
  if(!req.session.id){
  req.session.id = value;
  req.session.save();
}
  console.log(value);
  var data = {
      url: url+'/todos/'+ value,
      method: "GET",
      json: true,
      headers: {
                "x-auth": req.session.authkey
                }
      };

  request(data, function (error, response, body) {
    if(response.statusCode == 200){
      if(body.todo.completedAt && body.todo.completed===true){
       body.todo.completedAt = moment(body.todo.completedAt).format("DD MMM YYYY hh:mm a");
       body.todo.completed = "Yes";
       body.todo.class = "result";
  }else{
    body.todo.completedAt = "";
    body.todo.completed = "No";
    body.todo.class = "resultred";
  }
    res.render('singleview.hbs', {
    result: body.todo
    });
  }else{
    res.redirect('/');
  }
  });
//it renders about.hbs page and it will send the values to that page
});

app.get('/delete', (req,res) =>{
  var value = req.query.delete;
  var data = {
      url: url+'/todos/'+value,
      method: "DELETE",
      json: true,
      headers: {
                "x-auth": req.session.authkey
                }
      };

  request(data, function (error, response, body) {
    res.redirect('/home');
  });
//it renders about.hbs page and it will send the values to that page
});

app.get('/update', (req,res) =>{
  var value = req.query.update;
  var data = {
      url: url+'/todos/'+ value,
      method: "GET",
      json: true,
      headers: {
                "x-auth": req.session.authkey
                }
      };
  request(data, function (error, response, body) {
    if(response.statusCode == 200) {
    var text = body.todo.text;
    var status = body.todo.completed;
    //console.log(typeof(status))
    if(status === false){
    var  notcomplete = 'checked';
    }
    else {
    var  complete = 'checked';
    }
    console.log("here", body);
    res.render('updateview.hbs', {
    result: body.todo,
    notcomplete: notcomplete,
    complete: complete,
    });
  }else{
    res.redirect('/');
  }
  });
//it renders about.hbs page and it will send the values to that page
});

app.get('/updatedprocess', (req,res) =>{
  var value;
  var id = req.query.id;
  var text = req.query.text;
  var dummy = req.query.status;
  if(dummy === "true"){
    value = true
  }else if(dummy === "false"){
    value = false
  }
 // var value = Boolean(req.query.status);
  console.log(value+" "+text+" "+id);
  var requestData = {
    text: text,
    completed: value
  };
  var data = {
      url: url+'/todos/'+id,
      method: "PATCH",
      json: true,
      body: requestData,
      headers: {
                "x-auth": req.session.authkey
                }
      };

  request(data, function (error, response, body) {
    console.log(response.statusCode);
    console.log(body);
    res.redirect('/home');
  });
//it renders about.hbs page and it will send the values to that page
});

app.post('/registerreply', (req,res) =>{
var result,success;
var email = req.body.email;
var password = req.body.pwd;
if(email && password){
var requestData = {
  email: email,
  password: password
};
var data = {
    url: url+'/users',
    method: "POST",
    json: true,
    body: requestData
}
request(data, function (error, response, body) {
   if(response.statusCode == 400){
     console.log(body);
      if(body.errmsg && body.errmsg.includes("E11000 duplicate key error index")){
          result = "Email already Taken, Try with different Email";
          res.render('register.hbs', {
            result: result
          });
        }else if(body.errors.password.message && body.errors.password.message.includes("minimum allowed length")){
          result = "password must contain more than 6 characters";
          res.render('register.hbs', {
            result: result
          });
        }
      }
      else{
        success = "successfully registered into the ToDo system"
        res.render('index.hbs', {
          success: success
        });
      }
});
}else if(!email){
  result = "please enter email";
  res.render('register.hbs', {
    result: result
  });
}else{
 result = "please enter password";
 res.render('register.hbs', {
   result: result
 });
}

});

app.post('/login', (req,res) =>{
var result;
var email = req.body.email;
var password = req.body.pwd;
var requestData = {
  email: email,
  password: password
};
var data = {
    url: url+'/users/login',
    method: "POST",
    json: true,
    body: requestData
}
request(data, function (error, response, body) {
   if(response.statusCode == 400){
      result = "please check your username and password"
      res.render('index.hbs', {
        result: result
      });
      }
      else{
        //result = "successfully registered into the ToDo system"
        if(!req.session.authkey){
        req.session.authkey = response.headers['x-auth'];
        req.session.save();
      }
      res.redirect('/home');
        // res.render('home.hbs', {
        // });
      }
});
});

app.all('/home', (req,res) =>{
  var color;
var data = {
    url: url+'/todos',
    method: "GET",
    json: true,
    headers: {
              "x-auth": req.session.authkey
              }
    };
console.log(req.session.authkey);
request(data, function (error, response, body) {
  if(response.statusCode == 200){
  if(body.todos.length==0){
    var notodo = "No Todo's Yet :(, please click on create to create todo"
  }
  else{
  for(var i=0; i<body.todos.length; i++){
    if(body.todos[i].completedAt && body.todos[i].completed===true){
     body.todos[i].completedAt = moment(body.todos[i].completedAt).format("DD MMM YYYY hh:mm a");
     body.todos[i].completed = "Yes";
     body.todos[i].class="result";
}else{
  body.todos[i].completedAt = "";
  body.todos[i].completed = "No";
  body.todos[i].class="resultred";
}
}
}
  res.render('home.hbs', {
    result: body.todos,
    notodo: notodo
  });
}else{
  res.redirect('/');
}
});
});

app.post('/created', (req,res) =>{
var todo = req.body.todo;
//console.log(todo);
var requestData = {
  text: todo
};
var data = {
    url: url+'/todos',
    method: "POST",
    json: true,
    body: requestData,
    headers: {
              "x-auth": req.session.authkey
              }
    };
request(data, function (error, response, body) {

});
res.redirect('/home');
});


app.listen(port, ()=> {
console.log(`Server is up at ${port}`)
});
