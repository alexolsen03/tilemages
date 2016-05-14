import './board.html';
import { TileMages, load} from 'boardgame';

Template.board.onCreated(function(){
//	Meteor.subscribe('game', Router.current().params._id);
	this.autorun(() => {
		console.log('autorunning!');
		Template.currentData(); // Reactive dependency
		if(Template.instance().gameFen){
			let game = Games.findOne(Router.current().params._id);

			Template.instance().gameFen.set(game.fen);
			Template.instance().gameBoardFen.set(game.boardFen);

			let gameId = Template.instance().data._id;
			let userId = Meteor.userId();
			let playerData = Template.instance().data.players;
			let gameFen = game.fen;
			let boardFen = game.boardFen;

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

				console.log(tileMages.turn, color);

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
				Meteor.call('takeTurn', gameId, userId,
					tileMages.generateFen(),
					tileMages.generateBoardFen()
				);
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
		}

		this.subscribe('game', Router.current().params._id);
	});

	let game = Games.findOne(Router.current().params._id);

	this.gameFen = new ReactiveVar(game.fen);
	this.gameBoardFen = new ReactiveVar(game.boardFen);
});

Template.board.onRendered(function(){
	let gameId = Template.instance().data._id;
	let userId = Meteor.userId();
	let playerData = Template.instance().data.players;
	let gameFen = Games.findOne(gameId).fen;
	let boardFen = Games.findOne(gameId).boardFen;

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

		console.log(tileMages.turn, color);

		if(color !== tileMages.turn)
		    	return;

		    console.log('generating terraform options');
		    console.log(tileMages.generateTerraformOptions());
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
		Meteor.call('takeTurn', gameId, userId,
			tileMages.generateFen(),
			tileMages.generateBoardFen()
		);
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

Template.board.helpers({
	gameFen: function(){
		return Template.instance().gameFen.get();
	}
});

Template.board.events({

});

