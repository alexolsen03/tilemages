Games = new Meteor.Collection('games');

/*

game = {
	currentTurn = [],
	gameLog = [],
	players: {
		a: {

		},

		b: {

		}
	},
	inProgress: true / false,
	started: date,
	finished: date,
	winner: id
}



*/

if(Meteor.isServer) {
	Meteor.publish('games', function(){
		return Games.find({ currentTurn: this.userId });
	});

	Meteor.publish('users', function(){
		return Meteor.users.find();
	});
}

if(Meteor.isClient){
	Meteor.subscribe('games');
	Meteor.subscribe('users');
}

Meteor.methods({
	createGame: function(otherPlayerId){
		let game = GameFactory.createGame([Meteor.userId(), otherPlayerId]);
		console.log('created game!');
		console.log(game);
		Games.insert(game);
	},
	updateBoard: function(gameId, id, board){
		let game = Games.findOne(gameId);

		game.board = board;

		Games.update(gameId, game);
	},
	takeTurn: function(gameId, id, board, isAActive, teamATaken, teamBTaken){
		let game = Games.findOne(gameId);

		let prevActive = game.isAActive;

		if(prevActive !== isAActive){ // turn flipped
			let temp = game.currentTurn[0];
			game.currentTurn[0] = game.currentTurn[1];
			game.currentTurn[1] = temp;
		}

		game.teamATakenSoldiers = teamATaken;
		game.teamBTakenSoldiers = teamBTaken;

		game.board = board;
		game.isAActive = isAActive;

		Games.update(gameId, game);
	}
})