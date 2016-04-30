import './board.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint,
	resetTeams,
	editTerraformableSquares
} from '../../client/lib/helperFunctions.js';

const MAX_ACTIONS = 2;

Template.board.onCreated(function(){
	this.board = new ReactiveVar([
			[    // ROW 1
				buildTile(0,0,'land',0),
				buildTile(0,1,'land',0),
				buildTile(0,2,'land',0),
				buildTile(0,3,'land',0),
				buildTile(0,4,'land',0),
				buildTile(0,5,'land',0),
				buildTile(0,6,'land',0),
				buildTile(0,7,'land',0),
				buildTile(0,8,'land',0),
				buildTile(0,9,'land',0),
			],
			[    // ROW 2
				buildTile(1,0,'land',0),
				buildTile(1,1,'land',0),
				buildTile(1,2,'land',0),
				buildTile(1,3,'land',0),
				buildTile(1,4,'land',0),
				buildTile(1,5,'land',0),
				buildTile(1,6,'land',0),
				buildTile(1,7,'land',0),
				buildTile(1,8,'land',0),
				buildTile(1,9,'land',0),
			],
			[    // ROW 3
				buildTile(2,0,'land',0),
				buildTile(2,1,'land',0),
				buildTile(2,2,'land',0),
				buildTile(2,3,'land',0),
				buildTile(2,4,'land',0),
				buildTile(2,5,'land',0),
				buildTile(2,6,'land',0),
				buildTile(2,7,'land',0),
				buildTile(2,8,'land',0),
				buildTile(2,9,'land',0),
			],
			[    // ROW 4
				buildTile(3,0,'land',0),
				buildTile(3,1,'land',0),
				buildTile(3,2,'land',0),
				buildTile(3,3,'land',0),
				buildTile(3,4,'land',0),
				buildTile(3,5,'land',0),
				buildTile(3,6,'land',0),
				buildTile(3,7,'land',0),
				buildTile(3,8,'land',0),
				buildTile(3,9,'land',0),
			],
			[    // ROW 5
				buildTile(4,0,'land',0),
				buildTile(4,1,'land',0),
				buildTile(4,2,'land',0),
				buildTile(4,3,'land',0),
				buildTile(4,4,'land',0),
				buildTile(4,5,'land',0),
				buildTile(4,6,'land',0),
				buildTile(4,7,'land',0),
				buildTile(4,8,'land',0),
				buildTile(4,9,'land',0),
			],
			[    // ROW 6
				buildTile(5,0,'land',0),
				buildTile(5,1,'land',0),
				buildTile(5,2,'land',0),
				buildTile(5,3,'land',0),
				buildTile(5,4,'land',0),
				buildTile(5,5,'land',0),
				buildTile(5,6,'land',0),
				buildTile(5,7,'land',0),
				buildTile(5,8,'land',0),
				buildTile(5,9,'land',0),
			],
			[    // ROW 7
				buildTile(6,0,'land',0),
				buildTile(6,1,'land',0),
				buildTile(6,2,'land',0),
				buildTile(6,3,'land',0),
				buildTile(6,4,'land',0),
				buildTile(6,5,'land',0),
				buildTile(6,6,'land',0),
				buildTile(6,7,'land',0),
				buildTile(6,8,'land',0),
				buildTile(6,9,'land',0),
			],
			[    // ROW 8
				buildTile(7,0,'land',0),
				buildTile(7,1,'land',0),
				buildTile(7,2,'land',0),
				buildTile(7,3,'land',0),
				buildTile(7,4,'land',0),
				buildTile(7,5,'land',0),
				buildTile(7,6,'land',0),
				buildTile(7,7,'land',0),
				buildTile(7,8,'land',0),
				buildTile(7,9,'land',0),
			],
			[    // ROW 9
				buildTile(8,0,'land',0),
				buildTile(8,1,'land',0),
				buildTile(8,2,'land',0),
				buildTile(8,3,'land',0),
				buildTile(8,4,'land',0),
				buildTile(8,5,'land',0),
				buildTile(8,6,'land',0),
				buildTile(8,7,'land',0),
				buildTile(8,8,'land',0),
				buildTile(8,9,'land',0),
			],
			[    // ROW 10
				buildTile(9,0,'land',0),
				buildTile(9,1,'land',0),
				buildTile(9,2,'land',0),
				buildTile(9,3,'land',0),
				buildTile(9,4,'land',0),
				buildTile(9,5,'land',0),
				buildTile(9,6,'land',0),
				buildTile(9,7,'land',0),
				buildTile(9,8,'land',0),
				buildTile(9,9,'land',0),
			]
	]);

	this.selectedSoldier = new ReactiveVar(null);

	let startRowRed = 0;
	let startRowBlack = 9;

	this.soldiersRed = new ReactiveVar([
		buildSoldier(1,true,startRowRed,0,2,'soldier', 2),
		buildSoldier(2,true,startRowRed,1,3,'knight', 2),
		buildSoldier(3,true,startRowRed,2,2,'mage', 2),
		buildSoldier(4,true,startRowRed,3,2,'archer', 2),
		buildSoldier(5,true,startRowRed,4,2,'soldier', 2),
		buildSoldier(6,true,startRowRed,5,2,'soldier', 2),
		buildSoldier(7,true,startRowRed,6,2,'archer', 2),
		buildSoldier(8,true,startRowRed,7,2,'mage', 2),
		buildSoldier(9,true,startRowRed,8,3,'knight', 2),
		buildSoldier(10,true,startRowRed,9,2,'soldier', 2),
	]);

	this.soldiersBlue = new ReactiveVar([
		buildSoldier(11,false,startRowBlack,0,2,'soldier', 2),
		buildSoldier(12,false,startRowBlack,1,3,'knight', 2),
		buildSoldier(13,false,startRowBlack,2,2,'mage', 2),
		buildSoldier(14,false,startRowBlack,3,2,'archer', 2),
		buildSoldier(15,false,startRowBlack,4,2,'soldier', 2),
		buildSoldier(16,false,startRowBlack,5,2,'soldier', 2),
		buildSoldier(17,false,startRowBlack,6,2,'archer', 2),
		buildSoldier(18,false,startRowBlack,7,2,'mage', 2),
		buildSoldier(19,false,startRowBlack,8,3,'knight', 2),
		buildSoldier(20,false,startRowBlack,9,2,'soldier', 2)
	]);

	// add the soldiers to the field
	for(let i=0;i<this.soldiersRed.get().length;i++){
		let soldier = this.soldiersRed.get()[i];
		this.board.get()[soldier.x][soldier.y].occupy(soldier);
	}

	for(let i=0;i<this.soldiersBlue.get().length;i++){
		let soldier = this.soldiersBlue.get()[i];
		this.board.get()[soldier.x][soldier.y].occupy(soldier);
	}

	this.actionsTaken = new ReactiveVar(0);

	this.isAActive = new ReactiveVar(true); // 0 is teamA, 1 is teamB

	this.isTerraformingState = new ReactiveVar(false);

	this.terraformingType = new ReactiveVar('land0');
});

Template.board.helpers({
	board: function(){
		return Template.instance().board.get();
	},
	selectedSoldier: function(){
		return Template.instance().selectedSoldier.get();
	},
	isAActive: function(){
		return Template.instance().isAActive.get();
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
				console.log(selectedSoldier.performedActionCount);
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
	}
});

Template.board.events({
	'click .tile': function(event, template){

		// this will be tracking actions taken and will flip the turn if all actions taken
		if(Template.instance().actionsTaken.get() >= MAX_ACTIONS){
			endTurn();
		}

		// resets board after other templates events have finished
		template.board.set(template.board.get());
	},

	'click .terraform': function(event, template){

		if(template.isTerraformingState.get()){
			clearSelectableTiles(template.board.get());
			template.selectedSoldier.set(null);
		}else{
			editTerraformableSquares(template.board.get(),
						       template.selectedSoldier.get().x,
						       template.selectedSoldier.get().y,
						       true);
		}

		template.isTerraformingState.set(!template.isTerraformingState.get());
		template.board.set(template.board.get());	// redraw
	},
	'click .end-turn': function(event, template){

		endTurn();

		// resets board after other templates events have finished
		template.board.set(template.board.get());
	},
	'click .terra-state': function(event, template){
		template.terraformingType.set(event.target.value);
	}
});

function endTurn(){
	clearSelectableTiles(Template.instance().board.get());				// clear any moveable tiles - redundancy

	Template.instance().isTerraformingState.set(false);				// reset terraforming - redundancy

	Template.instance().selectedSoldier.set(null);					// remove selected

	checkForBattleVictories(Template.instance().board.get());			// resolve battles

	resetTeams(Template.instance());								// reset soldier movement count

	Template.instance().actionsTaken.set(0);					// reset actions taken count

	Template.instance().isAActive.set(!Template.instance().isAActive.get()); 	// flip the turn
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

		tile.flee();		// remove soldier from tile
	}
}

function buildTile(x, y, type, depth){
	return {
		x: x,
		y: y,
		type: type,
		depth: depth,
		isOccupied: false,
		isMoveable: false,
		tester: type+depth,
		styleclass: function(){
			if(this.isMoveable)
				return this.terrastate() + ' tile moveable';
			else
				return this.terrastate() + ' tile';
		},
		aquaify: function(){
			this.depth = 0;
			this.type = 'water';
		},
		occupy: function(soldier){
			this.isOccupied = true;
			this.soldier = soldier;
		},
		flee: function(){
			this.isOccupied = false;
			this.soldier = null;
		},
		terraform: function(type,depth){
			this.type = type;
			this.depth = depth;
		},
		terrastate: function(){
			return this.type + this.depth;
		}
	}
}

function buildSoldier(id, team, x, y, movement, category, maxActions){
	return {
		movement: movement,
		x: x,
		y: y,
		id: id,
		teamA: team, // true = red, false = black
		performedActionCount: 0,
		movementTaken: 0,
		category: category,
		maxActions: maxActions,
		styleclass: function(){
			if(this.category === 'soldier')
				return 'soldier';
			else if(this.category === 'mage')
				return 'soldier mage';
			else if(this.category === 'archer')
				return 'soldier archer';
			else if(this.category === 'knight')
				return 'soldier knight';
			else
				return '';
		},
		move: function(x, y){
			this.x = x;
			this.y = y;
		},
		resetActions: function(){
			this.performedActionCount = 0;
			this.movementTaken = 0;
		},
		incrementAction: function(actionsTaken){
			this.performedActionCount = this.performedActionCount + actionsTaken;
		},
		incrementMovement: function(spacesMoved){
			this.movementTaken = this.movementTaken + Math.ceil(spacesMoved);
			console.log('movement taken is: ' + this.movementTaken + ' of ' + this.movement);
		}
	};
}