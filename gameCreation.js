GameFactory = {};

GameFactory.createGame = function(playerIds){
	let players = createPlayers(playerIds);

	console.log(playerIds);

	playerIds[0].teamA = false;	// first player is white
	playerIds[1].teamA = true;	// second player is red

	let board = createBoard();
	let teamASoldiers = createSoldiers(1,0, true);
	let teamBSoldiers = createSoldiers(11,9, false);

	addSoldiersToBoard(teamASoldiers, board);
	addSoldiersToBoard(teamBSoldiers, board);

	return {
		players: players,
		currentTurn: playerIds,
		inProgress: true,
		started: new Date(),
		board: board,
		teamASoldiers: teamASoldiers,
		teamBSoldiers: teamBSoldiers,
		teamATakenSoldiers: [],
		teamBTakenSoldiers: [],
		isAActive: false
	}
}

function createPlayers(ids){
	var o = {};

	ids.forEach(function(id){
		o[id] = {

		}
	});

	return o;
}

function createBoard(){
	return [
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
	];
}

function createSoldiers(startingId, startRow, isTeamA){
	return [
		buildSoldier(startingId,isTeamA,startRow,0,2,'soldier', 2),
		buildSoldier(startingId + 1,isTeamA,startRow,1,3,'knight', 2),
		buildSoldier(startingId + 2,isTeamA,startRow,2,2,'mage', 2),
		buildSoldier(startingId + 3,isTeamA,startRow,3,2,'archer', 2),
		buildSoldier(startingId + 4,isTeamA,startRow,4,2,'soldier', 2),
		buildSoldier(startingId + 5,isTeamA,startRow,5,2,'soldier', 2),
		buildSoldier(startingId + 6,isTeamA,startRow,6,2,'archer', 2),
		buildSoldier(startingId + 7,isTeamA,startRow,7,2,'mage', 2),
		buildSoldier(startingId + 8,isTeamA,startRow,8,3,'knight', 2),
		buildSoldier(startingId + 9,isTeamA,startRow,9,2,'soldier', 2)
	]
}

function addSoldiersToBoard(team, board){
	for(let i=0;i<team.length;i++){
		let soldier = team[i];
		board[soldier.x][soldier.y].occupy(soldier);
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
