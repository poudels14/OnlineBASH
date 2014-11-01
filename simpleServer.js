var express = require('express');
var fs=require('fs')
var app = express();
var sleep = require('sleep');
	
function saveSearch(json){
	searchedItems.push(json);
	fs.writeFile(searchedItemsFile,"searchedItems = " +JSON.stringify(searchedItems));
}


function postItem(json){
	availableItems.push(json);
	fs.writeFile(availableItemsFile,"availableItems = " +JSON.stringify(availableItems));
}

function saveAvailableItems(json){
	availableItems.push(json);
}

function saveRentedItems(json){
	rentedItems.push(json);
}

var connections = [];


var s = require('sys');

app.get('/*', function(req, res){
	console.log("Url : " + req.url);
	if (req.url == "/index.html") {
		res.sendfile("./index.html");
	}
	else if(req.param('c') != null && req.param('c') != "undefined") {
		
		var rid = req.param('id');
		console.log("RandomId : " + rid);
		var cmd = req.param("c");
		var hasDir = false;

		if(connections.hasOwnProperty(rid)) {
			process.chdir(connections[rid]);
		}
		else {
			console.log('Making new dir');
			s.exec('mkdir ' + rid);
			connections[rid] = "/home/ubuntu/" + rid;
			setTimeout(function(){process.chdir("/home/ubuntu/"+rid);},1000);
		}
		console.log("Command: " + cmd);
		if (cmd.substr(0,5) == "cd ..") {
			var sp = connections[rid].split("/");
			var substring = connections[rid].search(sp[sp.length-1]);
			console.log("Substing : " + substring);
			var newDir = connections[rid].substr(0,substring);
			console.log("new dir :" + newDir);			
			connections[rid] = newDir;
			res.send(newDir);	
		}
		else if(cmd.substr(0,2) == "cd") {
			var initD = process.cwd();
			process.chdir(cmd.substr(3));
			connections[rid] = cmd.substr(3);
			var laterD = process.cwd();
			if (laterD.substr(0,5) != "/home") {
				process.chdir("/home/");
				res.send("Will you please stop here?");	
			}
			
   			setTimeout(function(){s.exec("pwd");},1000);
		}
		else if(cmd.substr(0,2) == "su") {
			res.send("Don't FUCK up my server! Bitch!");
		}
		else {
			s.exec(req.param("c") + " > /home/ubuntu/results.txt");
   			setTimeout(function(){res.sendfile('/home/ubuntu/results.txt');},1000);
		}
	}
	process.chdir("/home/ubuntu/");
});




var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
