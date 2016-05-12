import './soldier.html';
import { clearSelectableTiles,
	getTilesAdjacentToPoint,
	calculateMoveableSquares,
	buildSoldier,
	buildTile
} from '../../client/lib/helperFunctions.js';

Template.soldier.onCreated(function(){

});

Template.soldier.helpers({
	teamClass: function(){
		if(this == null)
			return '';
		else
			return this.teamA == true ? 'teamA' : 'teamB';
	},
	typeClass: function(){
		return styleclass(this);
	}
})

Template.soldier.events({
	'click .soldier': function(event, template){
		console.log('clicked soldier bro');

		console.log(this);
		console.log(template.view.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance);
		if(isMyTurn(template)){

			if(this.teamA === getActiveTeam(template)){	// is the clicked soldier the right team
				console.log('yep');

				if(this.performedActionCount < this.maxActions){
					console.log('yeep');

	/*				if(this.selected)		// a soldier is active, need to inactivate it
						clearSelectableTiles(this.board);*/

					// set selected state
					setSelectedOverall(template, this);

	//				let movementAvailable = this.movement - this.movementTaken - getActionsTaken(template);

					// show moveable
	//				editMoveableTiles(this, this, movementAvailable);

				}else{
					console.log('noope');
					console.log(this);
					// set selected state
					setSelectedOverall(template, null);
				}
			}else{

				console.log('wrong team');
				// set selected state
				setSelectedOverall(template, null);
			}
		}
	}
});

function styleclass(me){
	if(me.category === 'soldier')
	    return 'soldier';
	  else if(me.category === 'mage')
	    return 'soldier mage';
	  else if(me.category === 'archer')
	    return 'soldier archer';
	  else if(me.category === 'knight')
	    return 'soldier knight';
	  else
	    return '';
}

function editMoveableTiles(me, selectedSoldier, stepsAvailable){
	calculateMoveableSquares(me.board, selectedSoldier.x, selectedSoldier.y, [], 0, stepsAvailable);
}

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
			._templateInstance.data.isAActive;
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

function isMyTurn(template){
	let turn = template.view.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView.parentView._templateInstance.data.currentTurn[0];

	if(turn === Meteor.userId())
		return true;
	else
		return false;
}

/* REMOVE AFTER PATHFINDING IMPLEMENTATION */
/*function editMoveableTiles(me, moveable, soldier, spaces){

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
}*/