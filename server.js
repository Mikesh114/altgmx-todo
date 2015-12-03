var express = require('express');
var db = require('./db.js');
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

//GET homepage/todos?completed='false'$q='work'

app.get('/todos', function(req,res){
    var query = req.query;
    var where = {};
    
    if (query.hasOwnProperty('completed') && (query.completed == 'true')) {
     where.completed = true;
    } else if (query.hasOwnProperty('completed') && (query.completed == 'false')){
           where.completed = false;
    }
    
    // query for description
        if (query.hasOwnProperty('q') && (query.q.length > 0)) {
           where.description = {
            $like : '%' + query.q + '%'   
           }
            };
    
    db.todo.findAll({where:where}).then( function(todos){
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    })
    /*
    var filteredTodos = todos;
    
    if (queryParams.hasOwnProperty('completed') && (queryParams.completed == 'true')) {
     filteredTodos = _.where(filteredTodos, {completed:true});
    } else if (queryParams.hasOwnProperty('completed') && (queryParams.completed == 'false')){
        filteredTodos = _.where(filteredTodos, {completed:false});
    }
// query for description
        if (queryParams.hasOwnProperty('q') && (queryParams.q.length > 0)) {
            filteredTodos = _.filter(filteredTodos, function(todo){
                return todo.description.indexOf(queryParams.q.toLowerCase()) > -1;
            }); 
            }
    //else res.status(400).send('string not found');
            
  res.json(filteredTodos);  
  */
});

app.get('/todos/:id', function(req,res){
   var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function (todo){
        if(!!todo) {
         res.json(todo.toJSON());   
        } else {
         res.status(404).send();   
        }
    }, function(e) {
        res.status(500).send();
    });
        
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
   // post to DB
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
    
    /*
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
*/
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

db.sequelize.sync().then(function (){
    app.listen(PORT, function(){
    console.log('express listening at port ' + PORT);
});
});

