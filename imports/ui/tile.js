import './tile.html';

function getBoard(me){
	return me.board;
}

function getTileObj(me){
	return getBoard(me)[me.x][me.y];
}

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