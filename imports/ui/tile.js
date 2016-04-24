import './tile.html';

Template.tile.onCreated(function(){

});

Template.tile.helpers({
	attributes: function(){
		return {
			class: getTileObj(this).styleclass(),
			xpos: this.x,
			ypos: this.y,
		}
	},
	isOccupied: function(){
		return getTileObj(this).isOccupied;
	}
});

Template.tile.events({

	'click .tile.moveable': function(event, template){
		const target = event.target;

		if(this.selected){

			if(getTileObj(this).isOccupied != true){				// nobody on the new space already
				let soldier = this.selected;

				let prevX = soldier.x;
				let prevY = soldier.y;

				// remove the highlighted squares
				editMoveableSquares(this, soldier, false);

				// remove occupied info from the tile
				getTileObjSpecific(this,prevX, prevY).flee();

				// update coordinates for the moved soldier
				this.selected.move(this.x, this.y);

				// track actions taken
				incrementActionsTaken(template);

				// handles the color of this new tile
				getTileObj(this).occupy(this.selected);

				// update the overall selected item
				setSelectedOverall(template, null);
			}
		}
	},
});

function getBoard(me){
	return me.board;
}

function getTileObj(me){
	return getBoard(me)[me.x][me.y];
}

function getTileObjSpecific(me, x, y){
	return getBoard(me)[x][y];
}

function editMoveableSquares(me, soldier, moveable){
	let MAX_BOTTOM = 10;
	let MAX_TOP = -1;
	let MAX_RIGHT = 10;
	let MAX_LEFT = -1;

	let x = soldier.x;
	let y = soldier.y;

	// go down
	let ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM){
		getTileObjSpecific(me,x + ctr,y).isMoveable = moveable;
		ctr++;
	}

	// go down right
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		getTileObjSpecific(me,x+ctr,y+ctr).isMoveable = moveable;
		ctr++;
	}

	// go right
	ctr = 0;
	while(ctr < soldier.movement && y+ctr < MAX_RIGHT){
		getTileObjSpecific(me,x,y+ctr).isMoveable = moveable;
		ctr++;
	}

	// go down left
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		getTileObjSpecific(me,x+ctr,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go left
	ctr = 0;
	while(ctr < soldier.movement && y-ctr > MAX_LEFT){
		getTileObjSpecific(me,x,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go up left
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		getTileObjSpecific(me,x-ctr,y-ctr).isMoveable = moveable;
		ctr++;
	}

	// go up
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP){
		getTileObjSpecific(me,x-ctr,y).isMoveable = moveable;
		ctr++;
	}

	//go up right
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		getTileObjSpecific(me,x-ctr,y+ctr).isMoveable = moveable;
		ctr++;
	}
}

function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
}

function incrementActionsTaken(template){
	let actionsTaken = template.view.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			._templateInstance.actionsTaken.get();

	template.view.parentView
		.parentView
		.parentView
		.parentView
		.parentView
		.parentView
		._templateInstance.actionsTaken.set(actionsTaken + 1);
}