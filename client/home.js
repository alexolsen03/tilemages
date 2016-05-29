function otherId(game){
	return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
}

Template.gameList.helpers({
	yourTurnGames: function(){
		let games = Games.find({inProgress: true}).map(function(game){
			if(game.currentTurn[0] === Meteor.userId()){
				game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
				game.started = moment(game.started).fromNow();
				return game;
			}
		});

		// removes undefined values from array
		games = games.filter(Boolean);

		return games;
	},
	theirTurnGames: function(){
		let games = Games.find({inProgress: true}).map(function(game){
			if(game.currentTurn[0] !== Meteor.userId()){
				game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
				game.started = moment(game.started).fromNow();
				return game;
			}
		});

		// removes undefined values from array
		games = games.filter(Boolean);

		return games;
	}
});

Template.completedGameList.helpers({
	completedGames: function(){
		console.log('getting completed');
		return Games.find({inProgress: false}, {limit: 10}).map(function(game){
			game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
			game.startedAt = moment(game.started).format('MMMM Do');

			let result = game.fen.split(' ')[3]; // gives 'r' or 'w' or 'd'

			if(result === 'd'){
				game.result = 'D';
			}else{
				let myColor = game.players[Meteor.userId()].teamA ? 'r' : 'w';

				if(result === myColor)
					game.result = 'W';
				else
					game.result = 'L';
			}

			return game;
		})
	}
});

Template.completedGameItem.helpers({
	gameResultClass: function(result){
		if(result.toUpperCase() === 'W')
			return 'game-win';
		else if(result.toUpperCase() === 'L')
			return 'game-loss';
	}
});

Template.userList.helpers({
	users: function(){
		let myId = Meteor.userId();
		let cantPlayAgainst = [myId];

		Games.find({ inProgress: true }).forEach(function(game){
			cantPlayAgainst.push(otherId(game));
		});

		return Meteor.users.find({ _id: { $not: { $in: cantPlayAgainst } } });
	}
});

Template.userItem.events({
	'click .user-item': function(event, template){
		Meteor.call('createGame', template.data._id);
	}
})