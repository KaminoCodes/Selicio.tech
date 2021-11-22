// variables
var express = require('express');
//var redirect = require("express-redirect");
var fs = require("fs");
var bodyParser = require('body-parser');
const db = require('quick.db');


var app = express(); // express application
app.use(bodyParser.urlencoded({ extended: false }));


// HTML
var preData = '<!DOCTYPE html><html><head><script></script><meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <title>Saliola</title> <link href="../recipe-style.css" rel="stylesheet" type="text/css" /> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></head><body><h1>Saliola</h1><center>';

var postData = `<span class="material-icons" onclick="window.history.back()">navigate_before</span> 
			<span class="material-icons" onclick="window.location.replace('/recipes/random')">navigate_next</span></div></center></body></html>`;

function htmlFile(file,data,response)  {
  var name = "recipes/" + file + ".html";
  var content = preData + data + postData;
  fs.writeFile(`./static/${name}`, content, function (err) {
    if (err) {
      throw err;
      response.send(err);
    }
    else {
      response.send(`<script>alert('Successfully published recipe ${file}! Redirecting to page...')</script><meta http-equiv="Refresh" content="0; url='/recipes/${file}'" />`);
    }
  });
};

// static directory
app.use(express.static('static'))

// Home Page: index.html
app.get('/', (req, res) => {
  res.sendFile('./static/index.html');
});

app.get('/COP26', (req, res) => {
	res.sendFile(__dirname + '/static/COP26.html');
});

// create page
app.get('/page', (req, res) => {
  res.sendFile(__dirname + '/static/create-recipe.html');
});

app.post('/page', function(req, response){
  var file = req.body.file;
  var content = req.body.myPage;
  htmlFile(file,content,response);
});

app.param('recipe', function(req, res, next, recipe) {
  req.recipe = recipe;
  next();
});

app.get('/recipes/:recipe', function(req, res) {
	if(req.recipe === 'random'){
		var files = fs.readdirSync('./static/recipes')
/* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
let randomRecipe = files[Math.floor(Math.random() * files.length)]
		res.send(`<meta http-equiv="Refresh" content="0; url='/recipes/${randomRecipe.split('.')[0]}'" />`)
	}else if(req.recipe === 'create'){
		res.sendFile(`static/create-recipe.html`, { root: __dirname })
	} else {
  	res.sendFile(`static/recipes/${req.recipe}.html`, { root: __dirname })
	}
});

//account shit
app.get('/login'), function(req, res){
	res.sendFile('static/login.html', { root: __dirname })
}
app.get('/login-confirm'), function(req, res){
	if(db.get(`user_${req.body.email}`)){
		res.send(`<meta http-equiv="Refresh" content="0; url='/?logged-in=true&name=${db.get(`user_${req.body.email}_name`)}'" />`)
	}else res.send(`<meta http-equiv="Refresh" content="0; url='/register'" />`)
}

port = 3000;

app.listen(port, (err) => {
  console.log(`The magic happens on port: ${port}`);
});