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

		console.log(getIsTerraforming(template));

		if(this.selected && !getIsTerraforming(template)){	// if there is a selected soldier and not terraforming

			if(getTileObj(this).isOccupied != true){			// nobody on the tile already
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
		}else{
			let type = getTerraformingType(template);
			let depth = type[type.length - 1];
			let landType = type.substring(0, type.length -1);

			getTileObj(this).terraform(landType, depth);

			this.selected.incrementAction(2);	// terraforming takes the soldiers actions

			// track actions taken
			incrementActionsTaken(template);
			incrementActionsTaken(template);	// terraforming takes 2 actions

			editTerraformableSquares(this, false);
			setIsTerraforming(template, false);

			// update the overall selected item
			setSelectedOverall(template, null);
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

	let immovableTypes = ['water'];

	let x = soldier.x;
	let y = soldier.y;

	// go down
	let ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x + ctr,y).type) != -1){
			getTileObjSpecific(me,x + ctr,y).isMoveable = false;
		}else{
			getTileObjSpecific(me,x + ctr,y).isMoveable = moveable;
		}
		ctr++;
	}

	// go down right
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x+ctr,y+ctr).type) != -1){
			getTileObjSpecific(me,x+ctr,y+ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x+ctr,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go right
	ctr = 0;
	while(ctr < soldier.movement && y+ctr < MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x,y+ctr).type) != -1){
			getTileObjSpecific(me,x,y+ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go down left
	ctr = 0;
	while(ctr < soldier.movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x+ctr,y-ctr).type) != -1){
			getTileObjSpecific(me,x+ctr,y-ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x+ctr,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go left
	ctr = 0;
	while(ctr < soldier.movement && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x,y-ctr).type) != -1){
			getTileObjSpecific(me,x,y-ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go up left
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x-ctr,y-ctr).type) != -1 ){
			getTileObjSpecific(me,x-ctr,y-ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x-ctr,y-ctr).isMoveable = moveable;
		}
		ctr++;
	}

	// go up
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x-ctr,y).type) != -1 ){
			getTileObjSpecific(me,x-ctr,y).isMoveable = false;
		}else{
			getTileObjSpecific(me,x-ctr,y).isMoveable = moveable;
		}
		ctr++;
	}

	//go up right
	ctr = 0;
	while(ctr < soldier.movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		if(immovableTypes.indexOf(getTileObjSpecific(me,x-ctr,y+ctr).type) != -1 ){
			getTileObjSpecific(me,x-ctr,y+ctr).isMoveable = false;
		}else{
			getTileObjSpecific(me,x-ctr,y+ctr).isMoveable = moveable;
		}
		ctr++;
	}
}

function getTerraformingType(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.terraformingType.get();
}

function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
}

function getIsTerraforming(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.isTerraformingState.get();
}

function setIsTerraforming(template, terraforming){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.isTerraformingState.set(terraforming);
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

function editTerraformableSquares(me, moveable){
	let soldier = me.selected;

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
		if(me.board[x+ctr][y].soldier != null){
			me.board[x + ctr][y].isMoveable = false;
		}else{
			me.board[x + ctr][y].isMoveable = moveable;
		}
		ctr++;
	}

	// go down right
	ctr = 0;
	while(ctr < tileReach && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
		if(me.board[x + ctr][y + ctr].soldier != null){
			me.board[x + ctr][y + ctr].isMoveable = false;
		}else{
			me.board[x + ctr][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go right
	ctr = 0;
	while(ctr < tileReach && y+ctr < MAX_RIGHT){
		if(me.board[x][y + ctr].soldier != null){
			me.board[x][y + ctr].isMoveable = false;
		}else{
			me.board[x][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go down left
	ctr = 0;
	while(ctr < tileReach && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
		if(me.board[x + ctr][y - ctr].soldier != null){
			me.board[x + ctr][y - ctr].isMoveable = false;
		}else{
			me.board[x + ctr][y - ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go left
	ctr = 0;
	while(ctr < tileReach && y-ctr > MAX_LEFT){
		if(me.board[x][y - ctr].soldier != null){
			me.board[x][y - ctr].isMoveable = false;
		}else{
			me.board[x][y - ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go up left
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
		if(me.board[x - ctr][y - ctr].soldier != null){
			me.board[x - ctr][y - ctr].isMoveable = false;
		}else{
			me.board[x-ctr][y-ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// go up
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP){
		if(me.board[x - ctr][y].soldier != null){
			me.board[x - ctr][y].isMoveable = false;
		}else{
			me.board[x - ctr][y].isMoveable = moveable;
		}
		ctr++;
	}

	//go up right
	ctr = 0;
	while(ctr < tileReach && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
		if(me.board[x - ctr][y + ctr].soldier != null){
			me.board[x - ctr][y + ctr].isMoveable = false;
		}else{
			me.board[x - ctr][y + ctr].isMoveable = moveable;
		}
		ctr++;
	}

	// knight top right
	ctr = 0;
	while(ctr < 1 && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){

		if(x-2 > MAX_TOP && y+1 < MAX_RIGHT){
			if(me.board[x - 2][y + 1].soldier != null){
				me.board[x - 2][y + 1].isMoveable = false;
			}else{
				me.board[x - 2][y + 1].isMoveable = moveable;
			}
		}

		if(x - 1 > MAX_TOP && y+2 < MAX_RIGHT){
			if(me.board[x - 1][y + 2].soldier != null){
				me.board[x - 1][y + 2].isMoveable = false;
			}else{
				me.board[x - 1][y + 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight bottom right
	ctr = 0;
	while(ctr < 1 && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){

		if(x+2 < MAX_BOTTOM && y+1 < MAX_RIGHT){
			if(me.board[x + 2][y + 1].soldier != null){
				me.board[x + 2][y + 1].isMoveable = false;
			}else{
				me.board[x + 2][y + 1].isMoveable = moveable;
			}
		}

		if(x+1 < MAX_BOTTOM && y + 2 < MAX_RIGHT){
			if(me.board[x + 1][y + 2].soldier != null){
				me.board[x + 1][y + 2].isMoveable = false;
			}else{
				me.board[x + 1][y + 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight bottom left
	ctr = 0;
	while(ctr < 1 && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){

		if(x+2 < MAX_BOTTOM && y - 1 > MAX_LEFT){
			if(me.board[x + 2][y - 1].soldier != null){
				me.board[x + 2][y - 1].isMoveable = false;
			}else{
				me.board[x + 2][y - 1].isMoveable = moveable;
			}
		}

		if(x+1 < MAX_BOTTOM && y - 2 > MAX_LEFT){
			if(me.board[x + 1][y - 2].soldier != null){
				me.board[x + 1][y - 2].isMoveable = false;
			}else{
				me.board[x + 1][y - 2].isMoveable = moveable;
			}
		}

		ctr++;
	}

	// knight top left
	ctr = 0;
	while(ctr < 1 && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){

		if(x - 2 > MAX_TOP && y - 1 > MAX_LEFT){
			if(me.board[x - 2][y - 1].soldier != null){
				me.board[x - 2][y - 1].isMoveable = false;
			}else{
				me.board[x - 2][y - 1].isMoveable = moveable;
			}
		}

		if(x - 1 > MAX_TOP && y - 2 > MAX_LEFT){
			if(me.board[x - 1][y - 2].soldier != null){
				me.board[x - 1][y - 2].isMoveable = false;
			}else{
				me.board[x - 1][y - 2].isMoveable = moveable;
			}
		}

		ctr++;
	}
}