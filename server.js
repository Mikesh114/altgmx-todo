var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var bodyParser = require('body-parser');
var todoNextId = 1;
app.use(bodyParser.json());

app.get('/', function(req, res){
   res.send('TODO API local root page, todos length is now '+ todos.length); 
});

app.get('/todos', function(req,res){
  res.json(todos);  
});

app.get('/todos/:id', function(req,res){
    todoId = req.params.id;
    notFound = true;
    i=0;
   //res.send('requesting for todo number : '+req.params.id); 
    
    while (i< todos.length && notFound) {
        if (todoId == todos[i].id){
            notFound = false;
         //res.send('id found ');
            res.json(todos[i]);
        } 
        i++;  
    }; //end while
    if (notFound){
            res.status(404).send('No such id exists');
        }  
    
});

app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextId;
    console.log('description ' + body.description);
    todos[todoNextId-1] = body;
    res.json(body);
    todoNextId++;
});

app.listen(PORT, function(){
    console.log('express listening at port ' + PORT);
});