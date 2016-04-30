import './soldier.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint
} from '../../client/lib/helperFunctions.js';

Template.soldier.helpers({
	teamClass: function(){
		if(this.soldier == null)
			return '';
		else
			return this.soldier.teamA == true ? 'teamA' : 'teamB';
	},
	typeClass: function(){
		return this.soldier.styleclass();
	}
})

Template.soldier.events({
	'click .soldier': function(event, template){

		let selectedSoldier = this.soldier;	// instance soldier

		if(selectedSoldier.teamA === getActiveTeam(template)){	// is the clicked soldier the right team

			if(selectedSoldier.performedActionCount < selectedSoldier.maxActions){

				if(this.selected)		// a soldier is active, need to inactivate it
					clearSelectableTiles(this.board);

				let movementAvailable = selectedSoldier.movement - selectedSoldier.movementTaken - getActionsTaken(template);

				// show moveable
				editMoveableTiles(this, true, selectedSoldier, movementAvailable);

				// set selected state
				setSelectedOverall(template, selectedSoldier);
			}
		}
	}
});

function setSelectedOverall(template, soldier){
	template.view.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.selectedSoldier.set(soldier);
}

function getActionsTaken(template){
	return template.view.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.actionsTaken.get();
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

function getBoard(me){
	return me.board;
}

function getTileObj(me){
	return getBoard(me)[me.x][me.y];
}

function getTileObj(me, x, y){
	return getBoard(me)[x][y];
}

/* */
function editMoveableTiles(me, moveable, soldier, spaces){

	let moveableTiles = [];
	for(let n=0; n < spaces; n++){
		let nthSpaceTiles = getTilesAdjacentToPoint(me.board, soldier.x, soldier.y, n + 1);
		moveableTiles = moveableTiles.concat(nthSpaceTiles);
	}

	for(let i=0; i<moveableTiles.length; i++){
		let moveableTile = moveableTiles[i];

		if(moveableTile.type == 'water' ||
		    moveableTile.soldier != null){
			getTileObj(me, moveableTile.x, moveableTile.y).isMoveable = false;
		}else{
			getTileObj(me, moveableTile.x, moveableTile.y).isMoveable = moveable;
		}
	}
}