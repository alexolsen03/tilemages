import './soldier.html';

function getBoard(me){
	return me.board;
}

function getTileObj(me){
	return getBoard(me)[me.x][me.y];
}

function getTileObj(me, x, y){
	return getBoard(me)[x][y];
}

function editMoveableSquares(me, soldier, moveable){
	let MAX_BOTTOM = 10;
	let MAX_TOP = -1;
	let MAX_RIGHT = 10;
	let MAX_LEFT = -1;

	let x = soldier.x;
	let y = soldier.y;

	let ctrInit = 1;

	// go down
	let ctr = ctrInit;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM){
		getTileObj(me,x + ctr,y).isMoveable = moveable;
		ctr++;
	}

	// go down right
	ctr = ctrInit;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		getTileObj(me,x+ctr,y+ctr).isMoveable = moveable;
		ctr++;
	}

	// go right
	ctr = ctrInit;
	while(ctr < soldier.movement && y+ctr < MAX_RIGHT){
		getTileObj(me,x,y+ctr).isMoveable = moveable;
		ctr++;
	}

	// go down left
	ctr = ctrInit;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		getTileObj(me,x+ctr,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go left
	ctr = ctrInit;
	while(ctr < soldier.movement && y-ctr > MAX_LEFT){
		getTileObj(me,x,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go up left
	ctr = ctrInit;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		getTileObj(me,x-ctr,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go up
	ctr = ctrInit;
	while(ctr < soldier.movement && x-ctr > MAX_TOP){
		getTileObj(me,x-ctr,y).isMoveable = moveable;
		ctr++;
	}

	//go up right
	ctr = ctrInit;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		getTileObj(me,x-ctr,y+ctr).isMoveable = moveable;
		ctr++;
	}
}

Template.soldier.onCreated(function(){
	this.soldier = new ReactiveVar({
		movement: 2,
	});
});

Template.soldier.events({
	'click .soldier': function(event, template){
		let prevSelectedSoldier = Session.get('selectedSoldier');

		if(prevSelectedSoldier)		// a soldier is active, need to inactivate it
			editMoveableSquares(this, prevSelectedSoldier, false);



		let selectedSoldier = {		// soldier to be selected
			x: this.x,
			y: this.y,
			movement: 2
		}

		editMoveableSquares(this, selectedSoldier, true);

		Session.set('selectedSoldier', selectedSoldier);
	}
});