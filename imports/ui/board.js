import './board.html';

function buildTile(x, y, type, depth){
	return {
		x: x,
		y: y,
		type: type,
		depth: depth,
		styleclass: type + depth,
	}
}

Template.board.helpers({
	board: [
			[    // ROW 1
				buildTile(0,0,'land',0),
				buildTile(0,1,'land',0),
				buildTile(0,2,'land',0),
				buildTile(0,3,'land',0),
				buildTile(0,4,'land',0),
				buildTile(0,5,'land',0),
			],
			[    // ROW 2
				buildTile(1,0,'water',0),
				buildTile(1,1,'water',0),
				buildTile(1,2,'land',0),
				buildTile(1,3,'land',0),
				buildTile(1,4,'land',0),
				buildTile(1,5,'land',0),
			],
			[    // ROW 3
				buildTile(2,0,'water',0),
				buildTile(2,1,'water',0),
				buildTile(2,2,'land',0),
				buildTile(2,3,'land',1),
				buildTile(2,4,'land',1),
				buildTile(2,5,'land',0),
			],
			[    // ROW 4
				buildTile(3,0,'water',0),
				buildTile(3,1,'water',0),
				buildTile(3,2,'land',1),
				buildTile(3,3,'land',1),
				buildTile(3,4,'water',0),
				buildTile(3,5,'water',0),
			],
			[    // ROW 5
				buildTile(4,0,'land',0),
				buildTile(4,1,'land',0),
				buildTile(4,2,'land',0),
				buildTile(4,3,'land',0),
				buildTile(4,4,'land',0),
				buildTile(4,5,'water',0),
			],
			[    // ROW 6
				buildTile(4,0,'water',0),
				buildTile(4,1,'water',0),
				buildTile(4,2,'land',2),
				buildTile(4,3,'land',2),
				buildTile(4,4,'land',1),
				buildTile(4,5,'water',0),
			],
	]
});

Template.board.events({
	'click .tile': function(event){
		const target = event.target;
		alert('clicked: ' + target);
	}
});