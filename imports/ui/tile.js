import './tile.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint,
	editTerraformableSquares,
	buildSoldier,
	buildTile
} from '../../client/lib/helperFunctions.js';

Template.tile.onCreated(function(){
	console.log(this);
	let soldier = new ReactiveVar(this.data.soldier);
});

Template.tile.helpers({
	attributes: function(){
		return {
			class: styleclass(this),
			xpos: this.x,
			ypos: this.y,
		}
	},
	isOccupied: function(){
		return this.isOccupied;
	}
});

Template.tile.events({

	'click .tile.moveable': function(event, template){
		const target = event.target;

		if(getSelectedOverall(template) && !getIsTerraforming(template)){	// if there is a selected soldier and not terraforming

			if(!this.isOccupied){			// nobody on the tile already
				let s = getSelectedOverall(template);

				let bb = JSON.parse(JSON.stringify(s));

				template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.previousSelectedSoldier = bb;

				let prevX = s.x;
				let prevY = s.y;

				// figure out how far the soldier moved
				let range = calculateMovedRange(prevX, prevY, this.x, this.y);

				// increase his movment that far
				incrementMovement(getSelectedOverall(template), range);

				// if they didn't move their full distance they can still move once more
				if(range == getSelectedOverall(template).movement){

					incrementAction(getSelectedOverall(template), 2);

					incrementActionsTaken(template);	// increments player actions
					incrementActionsTaken(template);
				}else{
					incrementAction(getSelectedOverall(template), 1);

					incrementActionsTaken(template);
				}

				// remove occupied info from the tile
//				getTileObjSpecific(this,prevX, prevY).flee();

				// update coordinates for the moved soldier
				move(getSelectedOverall(template), this.x, this.y);

				// handles the color of this new tile
				occupy(this, getSelectedOverall(template));


				// update the overall selected item
				setSelectedOverall(template, null);

			}else{
				console.log('this.isOccupied is true!!!!');
			}
		}else{
			let type = getTerraformingType(template);
			let depth = type[type.length - 1];
			let landType = type.substring(0, type.length -1);

			terraform(this,landType, depth);

			getSelectedOverall(template).performedActions = getSelectedOverall(template).performedActions + 2;	// terraforming takes the soldiers actions

			// track actions taken
			incrementActionsTaken(template);
			incrementActionsTaken(template);	// terraforming takes 2 actions

			clearSelectableTiles(getBoard(template));
			setIsTerraforming(template, false);

			// update the overall selected item
			setSelectedOverall(template, null);
		}
	},
});

function styleclass(me){
	if(me.isMoveable)
		return terrastate(me) + ' tile moveable';
	else
		return terrastate(me) + ' tile';
}

function terrastate(me){
	return me.type + me.depth;
}

function terraform(me,type,depth){
	me.type = type;
	me.depth = depth;
}

function move(soldier, x, y){
      soldier.x = x;
      soldier.y = y;
}

function occupy(me, soldier){
	me.isOccupied = true;
	me.soldier = soldier;
}

function incrementMovement(soldier, spacesMoved){
      soldier.movementTaken = soldier.movementTaken + Math.ceil(spacesMoved);
}

function incrementAction(soldier, actionsTaken){
      soldier.performedActionCount = soldier.performedActionCount + actionsTaken;
};

/*
	get the selected type the player wants to terraform to from the board.js template
*/
function getTerraformingType(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.terraformingType.get();
}

function getBoard(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.data.board;
}

function setTile(template, newTile){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.data.board[newTile.x][newTile.y] = newTile;
}

/*
	set the board.js template's selected soldier
*/
function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
}

function setPreviousSelected(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.previousSelectedSoldier.set(soldier);
}

function getSelectedOverall(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.get();
}

/*
	get the state of terraforming from the board.js template
*/
function getIsTerraforming(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.isTerraformingState.get();
}

/*
	set the value of the terraforming state in the board.js template
*/
function setIsTerraforming(template, terraforming){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.isTerraformingState.set(terraforming);
}

/*
	get the value of actionsTaken from the board.js template
	and then increment it by one
*/
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

function calculateMovedRange(x1, y1, x2, y2){
	if(Math.abs(x1 - x2) >= 3 || Math.abs(y1 - y2) >= 3){
		return 3;
	}else if(Math.abs(x1 - x2) >= 2 || Math.abs(y1 - y2) >= 2){
		return 2;
	}else{
		return 1;
	}
}