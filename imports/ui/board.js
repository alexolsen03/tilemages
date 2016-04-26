import './board.html';

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
				buildTile(0,9,'water',0),
			],
			[    // ROW 2
				buildTile(1,0,'water',0),
				buildTile(1,1,'water',0),
				buildTile(1,2,'land',0),
				buildTile(1,3,'land',0),
				buildTile(1,4,'land',0),
				buildTile(1,5,'land',0),
				buildTile(1,6,'land',0),
				buildTile(1,7,'land',0),
				buildTile(1,8,'land',0),
				buildTile(1,9,'water',0),
			],
			[    // ROW 3
				buildTile(2,0,'water',0),
				buildTile(2,1,'water',0),
				buildTile(2,2,'land',0),
				buildTile(2,3,'land',0),
				buildTile(2,4,'land',0),
				buildTile(2,5,'land',0),
				buildTile(2,6,'land',0),
				buildTile(2,7,'land',0),
				buildTile(2,8,'land',0),
				buildTile(2,9,'water',0),
			],
			[    // ROW 4
				buildTile(3,0,'water',0),
				buildTile(3,1,'water',0),
				buildTile(3,2,'land',0),
				buildTile(3,3,'land',0),
				buildTile(3,4,'water',0),
				buildTile(3,5,'water',0),
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
				buildTile(4,5,'water',0),
				buildTile(4,6,'land',0),
				buildTile(4,7,'land',0),
				buildTile(4,8,'land',0),
				buildTile(4,9,'water',0),
			],
			[    // ROW 6
				buildTile(5,0,'water',0),
				buildTile(5,1,'water',0),
				buildTile(5,2,'land',0),
				buildTile(5,3,'land',0),
				buildTile(5,4,'land',0),
				buildTile(5,5,'water',0),
				buildTile(5,6,'land',0),
				buildTile(5,7,'land',0),
				buildTile(5,8,'water',0),
				buildTile(5,9,'land',0),
			],
			[    // ROW 7
				buildTile(6,0,'water',0),
				buildTile(6,1,'land',0),
				buildTile(6,2,'land',0),
				buildTile(6,3,'land',0),
				buildTile(6,4,'land',0),
				buildTile(6,5,'water',0),
				buildTile(6,6,'water',0),
				buildTile(6,7,'land',0),
				buildTile(6,8,'land',0),
				buildTile(6,9,'land',0),
			],
			[    // ROW 8
				buildTile(7,0,'land',0),
				buildTile(7,1,'water',0),
				buildTile(7,2,'land',0),
				buildTile(7,3,'land',0),
				buildTile(7,4,'water',0),
				buildTile(7,5,'land',0),
				buildTile(7,6,'land',0),
				buildTile(7,7,'land',0),
				buildTile(7,8,'land',0),
				buildTile(7,9,'water',0),
			],
			[    // ROW 9
				buildTile(8,0,'land',0),
				buildTile(8,1,'land',0),
				buildTile(8,2,'land',0),
				buildTile(8,3,'land',0),
				buildTile(8,4,'land',0),
				buildTile(8,5,'land',0),
				buildTile(8,6,'land',0),
				buildTile(8,7,'water',0),
				buildTile(8,8,'land',0),
				buildTile(8,9,'water',0),
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

	this.soldiersRed = new ReactiveVar([
			buildSoldier(1,true,0,3,2,'soldier'),
			buildSoldier(2,true,0,4,2,'soldier'),
			buildSoldier(3,true,0,5,2,'mage'),
			buildSoldier(4,true,0,6,2,'soldier'),
			buildSoldier(5,true,0,7,2,'soldier')
		]);

	this.soldiersBlue = new ReactiveVar([
			buildSoldier(6,false,9,3,2,'soldier'),
			buildSoldier(7,false,9,4,2,'soldier'),
			buildSoldier(8,false,9,5,2,'mage'),
			buildSoldier(9,false,9,6,2,'soldier'),
			buildSoldier(10,false,9,7,2,'soldier')
		]);

	// add the soldiers to the field
	for(let i=0;i<5;i++){
		let soldier = this.soldiersRed.get()[i];
		this.board.get()[soldier.x][soldier.y].occupy(soldier);
	}

	for(let i=0;i<5;i++){
		let soldier = this.soldiersBlue.get()[i];
		this.board.get()[soldier.x][soldier.y].occupy(soldier);
	}

	this.actionsTaken = new ReactiveVar(0);

	this.isAActive = new ReactiveVar(true); // 0 is teamA, 1 is teamB

	this.isTerraformingState = new ReactiveVar(false);
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
});

Template.board.events({
	'click .tile': function(event, template){

		// this will be tracking actions taken and will flip the turn if all actions taken
		if(Template.instance().actionsTaken.get() > 3){
			Template.instance().isAActive.set(!Template.instance().isAActive.get());
			Template.instance().actionsTaken.set(0);

			resetTeams(template);
		}

		// resets board after other templates events have finished
		template.board.set(template.board.get());
	},

	'click .inserter': function(event, template){
		let rx = Math.floor(Math.random() * 10);
		let ry = Math.floor(Math.random() * 10);

		template.board.get()[rx][ry].occupy({ name: 'soldier'});

		template.board.set(template.board.get());
	},

	'click .terraform': function(event, template){

		if(template.isTerraformingState.get()){
			editTerraformableSquares(template, false);
			template.selectedSoldier.set(null);
		}else{
			editTerraformableSquares(template, true);
		}

		template.isTerraformingState.set(!template.isTerraformingState.get());
		template.board.set(template.board.get());	// redraw
	}
});

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
				return type + depth + ' tile moveable';
			else
				return type + depth + ' tile';
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
		}
	}
}

function buildSoldier(id, team, x, y, movement, category){
	return {
		movement: movement,
		x: x,
		y: y,
		id: id,
		teamA: team, // true = red, false = black
		performedActionCount: 0,
		maxActions: 2,
		category: category,
		styleclass: function(){
			if(this.category === 'soldier')
				return 'soldier';
			else if(this.category === 'mage')
				return 'soldier mage';
			else
				return '';
		},
		move: function(x, y){
			this.x = x;
			this.y = y;
			this.performedActionCount++;
		},
		resetActions: function(){
			this.performedActionCount = 0;
		}
	};
}

function resetTeams(template){
	let soldiersRed = template.soldiersRed.get();

	for(let i=0; i<soldiersRed.length; i++){
		let soldier = soldiersRed[i];
		soldier.resetActions();
	}

	template.soldiersRed.set(soldiersRed);

	let soldiersBlue = template.soldiersBlue.get();

	for(let i=0; i<soldiersBlue.length; i++){
		let soldier = soldiersBlue[i];
		soldier.resetActions();
	}

	template.soldiersBlue.set(soldiersBlue);
}

function editTerraformableSquares(me, moveable){
	let soldier = me.selectedSoldier.get();

	let tileReach = 3;

	let MAX_BOTTOM = 10;
	let MAX_TOP = -1;
	let MAX_RIGHT = 10;
	let MAX_LEFT = -1;

	let x = soldier.x;
	let y = soldier.y;

	let ctrInit = 1;

	// go down
	let ctr = ctrInit;
	while(ctr < tileReach && x+ctr < MAX_BOTTOM){
		if(me.board.get()[x+ctr][y].soldier != null){
			me.board.get()[x + ctr][y].isMoveable = false;
		}else{
			me.board.get()[x + ctr][y].isMoveable = moveable;
		}
		ctr++;
	}

	// go down right
	ctr = 0;
	while(ctr < tileReach && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		if(me.board.get()[x + ctr][y + ctr].soldier != null){
			me.board.get()[x + ctr][y + ctr].isMoveable = false;
		}else{
			me.board.get()[x + ctr][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go right
	ctr = 0;
	while(ctr < tileReach && y+ctr < MAX_RIGHT){
		if(me.board.get()[x][y + ctr].soldier != null){
			me.board.get()[x][y + ctr].isMoveable = false;
		}else{
			me.board.get()[x][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go down left
	ctr = 0;
	while(ctr < tileReach && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		if(me.board.get()[x + ctr][y - ctr].soldier != null){
			me.board.get()[x + ctr][y - ctr].isMoveable = false;
		}else{
			me.board.get()[x + ctr][y - ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go left
	ctr = 0;
	while(ctr < tileReach && y-ctr > MAX_LEFT){
		if(me.board.get()[x][y - ctr].soldier != null){
			me.board.get()[x][y - ctr].isMoveable = false;
		}else{
			me.board.get()[x][y - ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go up left
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		if(me.board.get()[x - ctr][y - ctr].soldier != null){
			me.board.get()[x - ctr][y - ctr].isMoveable = false;
		}else{
			me.board.get()[x-ctr][y-ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go up
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP){
		if(me.board.get()[x - ctr][y].soldier != null){
			me.board.get()[x - ctr][y].isMoveable = false;
		}else{
			me.board.get()[x - ctr][y].isMoveable = moveable;
		}
		ctr++;
	}

	//go up right
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		if(me.board.get()[x - ctr][y + ctr].soldier != null){
			me.board.get()[x - ctr][y + ctr].isMoveable = false;
		}else{
			me.board.get()[x - ctr][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// knight top right
	ctr = 0;
	while(ctr < 1 && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){

		if(x-2 > MAX_TOP && y+1 < MAX_RIGHT){
			if(me.board.get()[x - 2][y + 1].soldier != null){
				me.board.get()[x - 2][y + 1].isMoveable = false;
			}else{
				me.board.get()[x - 2][y + 1].isMoveable = moveable;
			}
		}

		if(x - 1 > MAX_TOP && y+2 < MAX_RIGHT){
			if(me.board.get()[x - 1][y + 2].soldier != null){
				me.board.get()[x - 1][y + 2].isMoveable = false;
			}else{
				me.board.get()[x - 1][y + 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight bottom right
	ctr = 0;
	while(ctr < 1 && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){

		if(x+2 < MAX_BOTTOM && y+1 < MAX_RIGHT){
			if(me.board.get()[x + 2][y + 1].soldier != null){
				me.board.get()[x + 2][y + 1].isMoveable = false;
			}else{
				me.board.get()[x + 2][y + 1].isMoveable = moveable;
			}
		}

		if(x+1 < MAX_BOTTOM && y + 2 < MAX_RIGHT){
			if(me.board.get()[x + 1][y + 2].soldier != null){
				me.board.get()[x + 1][y + 2].isMoveable = false;
			}else{
				me.board.get()[x + 1][y + 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight bottom left
	ctr = 0;
	while(ctr < 1 && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){

		if(x+2 < MAX_BOTTOM && y - 1 > MAX_LEFT){
			if(me.board.get()[x + 2][y - 1].soldier != null){
				me.board.get()[x + 2][y - 1].isMoveable = false;
			}else{
				me.board.get()[x + 2][y - 1].isMoveable = moveable;
			}
		}

		if(x+1 < MAX_BOTTOM && y - 2 > MAX_LEFT){
			if(me.board.get()[x + 1][y - 2].soldier != null){
				me.board.get()[x + 1][y - 2].isMoveable = false;
			}else{
				me.board.get()[x + 1][y - 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight top left
	ctr = 0;
	while(ctr < 1 && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){

		if(x - 2 > MAX_TOP && y - 1 > MAX_LEFT){
			if(me.board.get()[x - 2][y - 1].soldier != null){
				me.board.get()[x - 2][y - 1].isMoveable = false;
			}else{
				me.board.get()[x - 2][y - 1].isMoveable = moveable;
			}
		}

		if(x - 1 > MAX_TOP && y - 2 > MAX_LEFT){
			if(me.board.get()[x - 1][y - 2].soldier != null){
				me.board.get()[x - 1][y - 2].isMoveable = false;
			}else{
				me.board.get()[x - 1][y - 2].isMoveable = moveable;
			}
		}

		ctr++;
	}
}