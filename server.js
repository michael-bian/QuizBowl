var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentUsers = [];
var game_started = false;
var teamOneName = "Team One";
var teamTwoName = "Team Two";
var teamOneScore = 0;
var teamTwoScore = 0;

app.get('/', function(req, res){
	res.sendfile('join.html')
});




io.on('connection', function(socket){
	console.log('a user connected to /join');

	socket.on('new_username_request', function(username_request){
  	
		if(username_request == "iamnotapeasant"){
			socket.emit('admin_access');
		}else{

		  	if(currentUsers.indexOf(username_request) == -1){	
		  		console.log('success: ' + username_request);
		  		currentUsers.push(username_request);
		  		socket.emit('success_username', username_request);

		  	}else{

		  		console.log('failure: ' + username_request);

		  	}
		  }
  	});

	socket.on('buzz', function(username){
		io.sockets.emit('first_buzz', username);
	})

	socket.on('admin_command', function(input_command){
		if(input_command=="help"){
			socket.emit('admin_help');
		}

		if(input_command.indexOf("setTeamOneName ") > -1){
			var attemptedName = input_command.replace("setTeamOneName", "");
			teamOneName = attemptedName+": ";
			io.emit('new_team_one_name', teamOneName);
		}

		if(input_command.indexOf("setTeamTwoName ") > -1){
			var attemptedNameTwo = input_command.replace("setTeamTwoName", "");
			teamTwoName = attemptedNameTwo+": ";
			io.emit('new_team_two_name', teamTwoName);
		}

		if(input_command=="next"){
			io.emit('next_question');
		}

		if(input_command.indexOf("addt1 ")>-1){
			var stringScore = input_command.replace("addt1 ","");
			var intScore = parseInt(stringScore);
			teamOneScore+= intScore;
			console.log(teamOneScore);
			io.emit('new_team_one_score', teamOneScore);
		}

		if(input_command.indexOf("sett1 ")>-1){
			var stringScore = input_command.replace("sett1", "");
			var intScore = parseInt(stringScore);
			teamOneScore = intScore;

			io.emit('new_team_one_score', teamOneScore);
		}

		if(input_command.indexOf("addt2 ")>-1){
			var stringScore = input_command.replace("addt2 ", "");
			var intScore = parseInt(stringScore);
			teamTwoScore += intScore;
			io.emit('new_team_two_score', teamTwoScore);
		}

		if(input_command.indexOf("sett2 ")>-1){
			var stringScore = input_command.replace("sett2 ", "");
			var intScore = parseInt(stringScore);
			teamTwoScore = intScore;
			io.emit('new_team_two_score', teamTwoScore);
		}
	});
});






http.listen(3000, function(){
  console.log('listening on *:3000');
});