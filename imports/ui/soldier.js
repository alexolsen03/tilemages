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

	let immovableTypes = ['water'];

	let x = soldier.x;
	let y = soldier.y;

	let ctrInit = 1;

	// go down
	let ctr = ctrInit;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM){
		if(immovableTypes.indexOf(getTileObj(me,x + ctr,y).type) != -1){
			getTileObj(me,x + ctr,y).isMoveable = false;
		}else{
			getTileObj(me,x + ctr,y).isMoveable = moveable;
		}
		ctr++;
	}

	// go down right
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObj(me,x+ctr,y+ctr).type) != -1){
			getTileObj(me,x+ctr,y+ctr).isMoveable = false;
		}else{
			getTileObj(me,x+ctr,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go right
	ctr = 0;
	while(ctr < soldier.movement && y+ctr < MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObj(me,x,y+ctr).type) != -1){
			getTileObj(me,x,y+ctr).isMoveable = false;
		}else{
			getTileObj(me,x,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go down left
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObj(me,x+ctr,y-ctr).type) != -1){
			getTileObj(me,x+ctr,y-ctr).isMoveable = false;
		}else{
			getTileObj(me,x+ctr,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go left
	ctr = 0;
	while(ctr < soldier.movement && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObj(me,x,y-ctr).type) != -1){
			getTileObj(me,x,y-ctr).isMoveable = false;
		}else{
			getTileObj(me,x,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go up left
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObj(me,x-ctr,y-ctr).type) != -1 ){
			getTileObj(me,x-ctr,y-ctr).isMoveable = false;
		}else{
			getTileObj(me,x-ctr,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go up
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP){
		if(immovableTypes.indexOf(getTileObj(me,x-ctr,y).type) != -1 ){
			getTileObj(me,x-ctr,y).isMoveable = false;
		}else{
			getTileObj(me,x-ctr,y).isMoveable = moveable;
		}
		ctr++;
	}

	//go up right
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObj(me,x-ctr,y+ctr).type) != -1 ){
			getTileObj(me,x-ctr,y+ctr).isMoveable = false;
		}else{
			getTileObj(me,x-ctr,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}
}

Template.soldier.helpers({
	teamClass: function(){
		if(this.soldier == null)
			return '';
		else
			return this.soldier.teamA == true ? 'teamA' : 'teamB';
	}
})

Template.soldier.events({
	'click .soldier': function(event, template){

		let selectedSoldier = this.soldier;	// instance soldier

		if(selectedSoldier.teamA === getActiveTeam(template)){	// is the clicked soldier the right team

			if(selectedSoldier.performedActionCount < selectedSoldier.maxActions){

				if(this.selected)		// a soldier is active, need to inactivate it
					editMoveableSquares(this, this.selected, false);

				// show moveable
				editMoveableSquares(this, selectedSoldier, true);

				// set selected state
				setSelectedOverall(template, selectedSoldier);
			}
		}
	}
});

function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
}

function getActiveTeam(template){
	return template.view.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			.parentView
			._templateInstance.isAActive.get();
}