// Create web server and listen on port 8080
// run with node comments.js
// test with curl -d "user=test&comment=hello" localhost:8080
var http = require('http');
var qs = require('querystring');
var items = [];

// create web server
var server = http.createServer(function(req, res){
	if('/' == req.url){
		switch(req.method){
			case 'GET':
				show(res);
				break;
			case 'POST':
				add(req, res);
				break;
			default:
				badRequest(res);
		}
	}else{
		notFound(res);
	}
});

// listen on port 8080
server.listen(8080);

// show all comments
function show(res){
	var html = '<html><head><title>Comment</title></head><body>'
			 + '<h1>Comments</h1>'
			 + '<ul>'
			 + items.map(function(item){
			 	return '<li>' + item + '</li>'
			 }).join('')
			 + '</ul>'
			 + '<form method="post" action="/">'
			 + '<p><input type="text" name="user" placeholder="Your Name" /></p>'
			 + '<p><textarea name="comment" placeholder="Your Comment"></textarea></p>'
			 + '<p><input type="submit" value="Submit" /></p>'
			 + '</form></body></html>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

// add a new comment
function add(req, res){
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk){
		body += chunk;
	});
	req.on('end', function(){
		var obj = qs.parse(body);
		items.push(obj.user + ': ' + obj.comment);
		show(res);
	});
}

// 404 not found
function notFound(res){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Not Found');
}

// 400 bad request
function badRequest(res){
	res.statusCode = 400;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Bad Request');
}
