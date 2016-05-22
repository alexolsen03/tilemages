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

	Meteor.publish('game', function(id){
//		check(id);
		console.log('publishing game!');
		console.log(Games.find({ _id: id}));
		return Games.find({ _id: id});
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
	updateBoard: function(gameId, id, fen, boardFen){
		let game = Games.findOne(gameId);

		game.fen = fen;
		game.boardFen = boardFen;

		Games.update(gameId, game);
	},
	takeTurn: function(gameId, id, fen, boardFen){
		let game = Games.findOne(gameId);

		game.fen = fen;
		game.boardFen = boardFen;

		let turn = fen.split(' ')[1];


		if(turn !== game.players[game.currentTurn[0]].color){ // turn flipped
			console.log('flipping turn');
			let temp = game.currentTurn[0];
			game.currentTurn[0] = game.currentTurn[1];
			game.currentTurn[1] = temp;
		}

		Games.update(gameId, game);
	},
	endGame: function(gameId){
		let game = Games.findOne(gameId);
		game.inProgress = false;
		Games.update(gameId, game);
	}
})