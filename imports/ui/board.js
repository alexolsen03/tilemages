import './board.html';
import { TileMages, load} from 'boardgame';

Template.board.onCreated(function(){
	let game = Games.findOne(Router.current().params._id);

	this.autorun(() => {
		game = Games.findOne(Router.current().params._id);
		this.gameFen = new ReactiveVar(game.fen);
		this.myTurn = new ReactiveVar(game.currentTurn[0] === Meteor.userId() ? true : false);
	});

	// assign players
	let opponent;
	for(let opp in game.players){
		if(opp !== Meteor.userId()){
			opponent = game.players[opp];
			break;
		}
	}

	this.player = game.players[Meteor.userId()];
	this.opponent = opponent;

	this.gameOver = new ReactiveVar();
});

Template.board.onRendered(function(){
	this.autorun(() => {

		let gameId = Template.instance().data._id;
		let userId = Meteor.userId();
		let playerData = Template.instance().data.players;
		let gameFen = Games.findOne(gameId).fen;
		let boardFen = Games.findOne(gameId).boardFen;

		let gameOver = false;

		if(gameFen.split(' ')[3]){
			let gameStatus = gameFen.split(' ')[3];
			Template.instance().gameOver.set(gameStatus);
			gameOver = true;
			Meteor.call('endGame', gameId);
		}

		let tileMages = new TileMages.TileMages(gameFen, boardFen);

		let onDragStart = function(source, piece){
			let game = Games.findOne(gameId);
			let player = game.players[Meteor.userId()];
			let team = player.team;
			let color = team === 'a' ? 'r' : 'w';

			if(color !== tileMages.turn ||
			    team !== piece.charAt(0))
				return;

			return tileMages.generateMoveOptions(source);
		}

		let onDrop = function(source, target){
			if(source !== target)
				return tileMages.move({from: source, to: target});	// return lost soldiers
		}

		let onTerraform = function(){
			let game = Games.findOne(gameId);
			let player = game.players[Meteor.userId()];
			let team = player.team;
			let color = team === 'a' ? 'r' : 'w';

			if(color !== tileMages.turn)
			    	return;

			return tileMages.generateTerraformOptions();
		}

		let terraform = function(type, square){
			let game = Games.findOne(gameId);
			let player = game.players[Meteor.userId()];
			let team = player.team;
			let color = team === 'a' ? 'r' : 'w';

			if(color !== tileMages.turn)
			    	return;

			return tileMages.terraform(type, square);	// returns lost soldiers
		}

		let onTurnEnd = function(){
			if(!gameOver){
				Meteor.call('takeTurn', gameId, userId,
					tileMages.generateFen(),
					tileMages.generateBoardFen()
				);
			}

			// this will return undefined if not over
/*			let gameOver = tileMages.gameOver();
			if(gameOver){
				console.log('game over!');
				console.log('the result is a win for ' + gameOver);
			}else{
				console.log('not over!');
			}*/
		}

		let cfg = {
			onDragStart: onDragStart,
			onDrop: onDrop,
			position: gameFen,
			boardPosition: boardFen,
			dropOffBoard: 'snapback',
			onTerraform: onTerraform,
			terraform: terraform,
			onTurnEnd: onTurnEnd
		}

		load.load('abc','terracontrols',cfg);
	});
});

Template.board.helpers({
	turn: function(){
		return Template.instance().myTurn.get() ? true : false;
	},

	turnColor: function(){
		let color = {
			'a': 'team-a',
			'b': 'team-b'
		}

		return Template.instance().myTurn.get() ? color[Template.instance().player.team] : color[Template.instance().opponent.team];
	},

	me: function(){
		return Template.instance().player;
	},

	opponent: function(){
		return Template.instance().opponent;
	},

	gameOver: function(){
		console.log(Template.instance().gameOver.get());
		return Template.instance().gameOver.get() === undefined ? false : true
	},

	gameOverMsg: function(){
		let status = Template.instance().gameOver.get();
		if(status === 'draw'){
			return "The game is a draw";
		}else if(status === 'r'){
			return "The game was won by red";
		}else{
			return "The game was won by white";
		}
	}
});

Template.board.events({

});

