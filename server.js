var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{id:1,
              desc:"Meet mom for dinner",
              completed: false},
             {id:2,
              desc:"company taxes",
              completed: false},
             {id:3,
              desc:"tennis class",
              completed: true}
            ];

app.get('/', function(req, res){
   res.send('TODO API root page, todos length is now '+ todos.length); 
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

app.listen(PORT, function(){
    console.log('express listening at port ' + PORT);
});