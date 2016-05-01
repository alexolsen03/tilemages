import './board.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint,
	resetTeams,
	editTerraformableSquares,
	buildSoldier,
	buildTile,
	calculateMoveableSquares
} from '../../client/lib/helperFunctions.js';

const MAX_ACTIONS = 2;

Template.board.onCreated(function(){

	// adds functions to tiles and soldiers
	this.data.board.forEach(function(row){
		row.forEach(function(tile){
			tile.styleclass = function(){
				if(this.isMoveable)
					return this.terrastate() + ' tile moveable';
				else
					return this.terrastate() + ' tile';
			};
			tile.aquaify = function(){
				this.depth = 0;
				this.type = 'water';
			},
			tile.occupy = function(soldier){
				this.isOccupied = true;
				this.soldier = soldier;
			},
			tile.flee = function(){
				this.isOccupied = false;
				this.soldier = null;
			},
			tile.terraform = function(type,depth){
				this.type = type;
				this.depth = depth;
			},
			tile.terrastate = function(){
				return this.type + this.depth;
			}

			if(tile.soldier != null){
				tile.soldier = buildSoldier(tile.soldier.id,
							      tile.soldier.teamA,
							      tile.x,
							      tile.y,
							      tile.soldier.movement,
							      tile.soldier.category,
							      tile.soldier.maxActions);
			}
		});
	});

	this.selectedSoldier = new ReactiveVar(null);

	this.previousSelectedSoldier = null;

	this.actionsTaken = new ReactiveVar(0);

	this.isTerraformingState = new ReactiveVar(false);

	this.terraformingType = new ReactiveVar('land0');
});

Template.board.helpers({
	selectedSoldier: function(){
		return Template.instance().selectedSoldier.get();
	},
	isAActive: function(){
		return Template.instance().data.isAActive;
	},
	isSelectedMage: function(){
		let selectedSoldier = Template.instance().selectedSoldier.get();

		if(selectedSoldier)
			return selectedSoldier.category === 'mage';

		return false;
	},
	actionsTaken: function(){
		return MAX_ACTIONS - Template.instance().actionsTaken.get();
	},
	ableToTerraform: function(){
		if(Template.instance().actionsTaken.get() < 3){
			let selectedSoldier = Template.instance().selectedSoldier.get();

			if(selectedSoldier){

				if(selectedSoldier.category === 'mage' && selectedSoldier.performedActionCount === 0)
					return true;

			}

			return false;
		}else{
			return false;
		}
	},
	isTerraformingState: function(){
		Template.instance().terraformingType.set('land0');
		return Template.instance().isTerraformingState.get();
	},
	myTurn: function(){
		if(Template.instance().data.currentTurn[0] === Meteor.userId())
			return true;
		else
			return false;
	},
	myTeam: function(){
		return Template.instance().data.players[Meteor.userId()].teamA;
	},
	otherPlayerName: function(){
		return getOtherPlayer().name;
	}
});

Template.board.events({
	'click .soldier': function(event, template){
		console.log('click soldier - board.js template');

		// remove the highlighted squares
		clearSelectableTiles(template.data.board);

		if(Template.instance().selectedSoldier.get()){

			let movementAvailable = Template.instance().selectedSoldier.get().movement - Template.instance().selectedSoldier.get().movementTaken - Template.instance().actionsTaken.get();

			let board = editMoveableTiles(template.data.board, Template.instance().selectedSoldier.get(), movementAvailable);

			Meteor.call('takeTurn', Template.instance().data._id, Meteor.userId(),
				board,
				Template.instance().data.isAActive,
				Template.instance().data.teamATakenSoldiers,
				Template.instance().data.teamBTakenSoldiers);
		}else{
			console.log('NO SELECTED SOLDIERS!');
		}
	},

	'click .tile.moveable': function(event, template){
		console.log('updating in board.js');

		// remove the highlighted squares
		clearSelectableTiles(template.data.board);

		// if clicking in terraformable squares
		if(template.previousSelectedSoldier){
			flee(template.data.board[template.previousSelectedSoldier.x][template.previousSelectedSoldier.y]);
		}

		Meteor.call('takeTurn', Template.instance().data._id, Meteor.userId(),
			template.data.board,
			Template.instance().data.isAActive,
			Template.instance().data.teamATakenSoldiers,
			Template.instance().data.teamBTakenSoldiers);

	},

	'click .tile': function(event, template){

		// this will be tracking actions taken and will flip the turn if all actions taken
		if(Template.instance().actionsTaken.get() >= MAX_ACTIONS){
			endTurn();
		}

		// resets board after other templates events have finished
//		template.board.set(template.board.get());
	},

	'click .terraform': function(event, template){

		if(template.isTerraformingState.get()){
			clearSelectableTiles(Template.instance().data.board);
			template.selectedSoldier.set(null);
		}else{
			editTerraformableSquares(Template.instance().data.board,
						       template.selectedSoldier.get().x,
						       template.selectedSoldier.get().y,
						       true);
		}

		template.isTerraformingState.set(!template.isTerraformingState.get());
//		template.board.set(template.board.get());	// redraw
	},
	'click .end-turn': function(event, template){

		endTurn();

		// resets board after other templates events have finished
		// template.board.set(template.board.get());
	},
	'click .terra-state': function(event, template){
		template.terraformingType.set(event.target.value);
	}
});

function endTurn(){

	clearSelectableTiles(Template.instance().data.board);				// clear any moveable tiles - redundancy

	Template.instance().isTerraformingState.set(false);				// reset terraforming - redundancy

	Template.instance().selectedSoldier.set(null);					// remove selected

	checkForBattleVictories(Template.instance().data.board);			// resolve battles

	resetTeams(Template.instance());						// reset soldier movemnet count

	Template.instance().actionsTaken.set(0);					// reset actions taken count

	Template.instance().data.isAActive = !Template.instance().data.isAActive; 	// flip the turn

	Meteor.call('takeTurn', Template.instance().data._id, Meteor.userId(),
		Template.instance().data.board,
		Template.instance().data.isAActive,
		Template.instance().data.teamATakenSoldiers,
		Template.instance().data.teamBTakenSoldiers);
}

function checkForBattleVictories(board){
	let lostSoldiers = [];

	for(let i=0; i<board.length; i++){
		let row = board[i];

		for(let n=0; n< row.length; n++){
			let tile = row[n];

			if(tile.soldier != null){
				let victim = tile.soldier;
				let adjacentTiles = getTilesAdjacentToPoint(board,tile.x,tile.y, 1);

				let attackerPower = 0;
				let defenderPower = 0;

				if(victim.category !== 'mage' &&
				    victim.category !== 'archer')
					defenderPower++;	// mages and archers have no natural defense

				if(tile.depth > 0)		// if victim is on a hill increase its defense
					defenderPower++;

				for(let j=0; j<adjacentTiles.length; j++){
					let aTile = adjacentTiles[j];

					if(aTile.soldier != null){

						if(aTile.soldier.teamA !== victim.teamA){	// if enemy is near

							if(aTile.soldier.category !== 'archer' &&
						  	    aTile.soldier.category !== 'mage'){	// these classes do not attack adjacent

								attackerPower++;		// increase attack power

								if(aTile.depth > 0)		// if enemy is on a hill
									attackerPower++;	// increase attack power
							}

						}else{						// if adjacent friendly

							if(aTile.soldier.category !== 'archer' &&
						  	    aTile.soldier.category !== 'mage'){	// these calsses do not defend adjacent

								defenderPower++;		// decrease attack power

								if(aTile.depth > 0)		// if adjacent friendly is on a hill
									defenderPower++;	// decrease attack power
							}
						}
					}
				}

				let archerTiles = getTilesAdjacentToPoint(board, tile.x, tile.y, 2);

				for(let j=0; j<archerTiles.length; j++){		// archer tiles are spaces 2 away
					let aTile = archerTiles[j];

					if(aTile.soldier != null &&
					   aTile.soldier.category === 'archer'){	// in the archer tiles, we are only looking for archers

						if(aTile.soldier.teamA !== victim.teamA){	// if enemy is near

							attackerPower++;			// increase attack power

							if(aTile.depth > 0)			// if enemy is on a hill
								attackerPower++;		// increase attack power

						}
					}
				}
						// if i decide that archers provide defense, add here




				if(defenderPower - attackerPower < 0){
					lostSoldiers.push(tile);
				}
			}
		}
	}

	for(let i=0; i<lostSoldiers.length; i++){
		let tile = lostSoldiers[i];

		console.log('blah!' + tile.soldier.teamA);

		if(tile.soldier.teamA){
			let arr = Template.instance().data.teamATakenSoldiers;
			arr.push(tile.soldier);
			Template.instance().data.teamATakenSoldiers = arr;
		}else{
			let arr = Template.instance().data.teamBTakenSoldiers;
			arr.push(tile.soldier);
			Template.instance().data.teamBTakenSoldiers = arr;
		}

		flee(tile);		// remove soldier from tile
	}
}

function flee(tile){
	tile.isOccupied = false;
	tile.soldier = null;
}

function editMoveableTiles(board, selectedSoldier, stepsAvailable){

	calculateMoveableSquares(board, selectedSoldier.x, selectedSoldier.y, [], 0, stepsAvailable);

	return board;
}

function otherId(){
	return Template.instance().data.players[0] === Meteor.userId() ? 1 : 0;
}

function getOtherPlayer(){
	for (var key in Template.instance().data.players) {
	  if (Template.instance().data.players.hasOwnProperty(key)) {
	    if(key != Meteor.userId()){
	    	console.log(key + ' does not equal ' + Meteor.userId())
	    	return Template.instance().data.players[key];
	    }
	  }
	}
}