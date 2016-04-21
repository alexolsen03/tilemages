import './board.html';

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
		}
	}
}

Template.board.onCreated(function(){
	this.board = new ReactiveVar([
			[    // ROW 1
				buildTile(0,0,'land',0),
				buildTile(0,1,'land',0),
				buildTile(0,2,'land',0),
				buildTile(0,3,'land',0),
				buildTile(0,4,'land',0),
				buildTile(0,5,'land',0),
				buildTile(0,6,'land',1),
				buildTile(0,7,'land',0),
				buildTile(0,8,'land',1),
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
				buildTile(1,8,'land',1),
				buildTile(1,9,'water',0),
			],
			[    // ROW 3
				buildTile(2,0,'water',0),
				buildTile(2,1,'water',0),
				buildTile(2,2,'land',0),
				buildTile(2,3,'land',1),
				buildTile(2,4,'land',1),
				buildTile(2,5,'land',0),
				buildTile(2,6,'land',1),
				buildTile(2,7,'land',1),
				buildTile(2,8,'land',0),
				buildTile(2,9,'water',0),
			],
			[    // ROW 4
				buildTile(3,0,'water',0),
				buildTile(3,1,'water',0),
				buildTile(3,2,'land',1),
				buildTile(3,3,'land',1),
				buildTile(3,4,'water',0),
				buildTile(3,5,'water',0),
				buildTile(3,6,'land',1),
				buildTile(3,7,'land',1),
				buildTile(3,8,'land',1),
				buildTile(3,9,'land',0),
			],
			[    // ROW 5
				buildTile(4,0,'land',0),
				buildTile(4,1,'land',0),
				buildTile(4,2,'land',0),
				buildTile(4,3,'land',0),
				buildTile(4,4,'land',0),
				buildTile(4,5,'water',0),
				buildTile(4,6,'land',1),
				buildTile(4,7,'land',2),
				buildTile(4,8,'land',2),
				buildTile(4,9,'water',0),
			],
			[    // ROW 6
				buildTile(5,0,'water',0),
				buildTile(5,1,'water',0),
				buildTile(5,2,'land',0),
				buildTile(5,3,'land',0),
				buildTile(5,4,'land',1),
				buildTile(5,5,'water',0),
				buildTile(5,6,'land',1),
				buildTile(5,7,'land',1),
				buildTile(5,8,'water',0),
				buildTile(5,9,'land',0),
			],
			[    // ROW 7
				buildTile(6,0,'water',0),
				buildTile(6,1,'land',0),
				buildTile(6,2,'land',0),
				buildTile(6,3,'land',1),
				buildTile(6,4,'land',1),
				buildTile(6,5,'water',0),
				buildTile(6,6,'water',0),
				buildTile(6,7,'land',1),
				buildTile(6,8,'land',1),
				buildTile(6,9,'land',0),
			],
			[    // ROW 8
				buildTile(7,0,'land',0),
				buildTile(7,1,'water',0),
				buildTile(7,2,'land',2),
				buildTile(7,3,'land',2),
				buildTile(7,4,'water',0),
				buildTile(7,5,'land',0),
				buildTile(7,6,'land',1),
				buildTile(7,7,'land',0),
				buildTile(7,8,'land',2),
				buildTile(7,9,'water',0),
			],
			[    // ROW 9
				buildTile(8,0,'land',2),
				buildTile(8,1,'land',2),
				buildTile(8,2,'land',1),
				buildTile(8,3,'land',0),
				buildTile(8,4,'land',1),
				buildTile(8,5,'land',0),
				buildTile(8,6,'land',1),
				buildTile(8,7,'water',0),
				buildTile(8,8,'land',1),
				buildTile(8,9,'water',0),
			],
			[    // ROW 10
				buildTile(9,0,'land',0),
				buildTile(9,1,'land',0),
				buildTile(9,2,'land',0),
				buildTile(9,3,'land',0),
				buildTile(9,4,'land',1),
				buildTile(9,5,'water',0),
				buildTile(9,6,'land',1),
				buildTile(9,7,'land',1),
				buildTile(9,8,'land',1),
				buildTile(9,9,'water',0),
			]
	]);
	console.log(this.board);
});

Template.board.helpers({
	board: function(){
		return Template.instance().board.get();
	}
});

Template.board.events({
	'click .tile': function(event, template){
		const target = event.target;

		let xpos = target.getAttribute("xpos");
		let ypos = target.getAttribute("ypos");

//		template.board.get()[xpos][ypos].aquaify();

		// reset board
		template.board.set(template.board.get());
	},
	'click .inserter': function(event, template){
		let rx = Math.floor(Math.random() * 10);
		let ry = Math.floor(Math.random() * 10);

		template.board.get()[rx][ry].occupy({ name: 'soldier'});

		template.board.set(template.board.get());
	},
});