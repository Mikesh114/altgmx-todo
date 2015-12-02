var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var bodyParser = require('body-parser');
var _ = require('underscore');
var todoNextId = 1;
app.use(bodyParser.json());

app.get('/', function(req, res){
   res.send('TODO API local root page, todos length is now '+ todos.length); 
});

app.get('/todos', function(req,res){
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if (queryParams.hasOwnProperty('completed') && (queryParams.completed == 'true')) {
     filteredTodos = _.where(filteredTodos, {completed:true});
    } else if (queryParams.hasOwnProperty('completed') && (queryParams.completed == 'false')){
        filteredTodos = _.where(filteredTodos, {completed:false});
    }

  res.json(filteredTodos);  
});

app.get('/todos/:id', function(req,res){
   var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id:todoId});
    if (matchedTodo) {
     res.json(matchedTodo);
    } else
        res.status(404).send();
    
});

app.delete('/todos/:id', function(req, res){
   var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
    } else
        res.status(404).send('no matched id');
});
/*
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
*/


app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
   // var todoId = parseInt(req.params.id,10);
   // var matchedTodo = _.findWhere(todos,{id:todoId});
    
   // if (!matchedTodo) return res.status(404).send('something wrong in posting');
    
    if ((!_.isBoolean(body.completed) || !_.isString(body.description)) || (body.description.trim().length === 0))
        { return res.status(400).send('bad request sent sending back 400');
        } else {
         
    body.id = todoNextId;
    body.description = body.description.trim();
    console.log('description ' + body.description);
    todos[todoNextId-1] = body;
    res.json(body);
    todoNextId++;
        }

});

app.put('/todos/:id', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    var validAttributes = {};
    
    if (!matchedTodo) return res.status(404).send();
    
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
        } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send('something went wrong in completed');
        }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0 ) {
            validAttributes.description = body.description;
        } else if (body.hasOwnProperty('description')) {
                   res.status(400).send('something wrong in desc');
                   }
        _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

}); //end PUT function

app.listen(PORT, function(){
    console.log('express listening at port ' + PORT);
});