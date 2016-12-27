var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	stylus = require('stylus'),
	mongoose = require('mongoose');

var app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

function compile(str,path){
	return stylus(str).set('filename',path);
}

app.set('view engine','pug');
app.set('views',__dirname+'/server/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use(express.static(__dirname+'/public'));
app.use(stylus.middleware({
	src: __dirname+'/public',
	compile: compile
}));

mongoose.connect('mongodb://localhost/multivision');
var db = mongoose.connection;
db.on('error',console.error.bind(console,"Error with Mogno"));

app.get('/partials/:partialPath',function(req,res){
	res.render('/partials/'+req.params.partialPath);
});

app.get('*',function(req,res){
	res.render('index');
});


app.listen(port,function(){
	console.log("Listening to port: ",port);
});