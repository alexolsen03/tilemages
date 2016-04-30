import './tile.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint,
	editTerraformableSquares
} from '../../client/lib/helperFunctions.js';

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

		if(this.selected && !getIsTerraforming(template)){	// if there is a selected soldier and not terraforming

			if(getTileObj(this).isOccupied != true){			// nobody on the tile already
				let soldier = this.selected;

				let prevX = soldier.x;
				let prevY = soldier.y;

				// remove the highlighted squares
				clearSelectableTiles(this.board);

				// figure out how far the soldier moved
				let range = calculateMovedRange(prevX, prevY, this.x, this.y);

				// increase his movment that far
				soldier.incrementMovement(range);

				// if they didn't move their full distance they can still move once more
				if(range == soldier.movement){

					this.selected.incrementAction(2);	// increments soldier actions

					incrementActionsTaken(template);	// increments player actions
					incrementActionsTaken(template);
				}else{
					this.selected.incrementAction(1);	// increments soldier actions

					incrementActionsTaken(template);
				}

				// remove occupied info from the tile
				getTileObjSpecific(this,prevX, prevY).flee();

				// update coordinates for the moved soldier
				this.selected.move(this.x, this.y);

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

			clearSelectableTiles(this.board);
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

/*
	get the selected type the player wants to terraform to from the board.js template
*/
function getTerraformingType(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.terraformingType.get();
}

/*
	set the board.js template's selected soldier
*/
function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
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