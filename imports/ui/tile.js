import './tile.html';

Template.tile.helpers({
	attributes: function(){
		return {
			class: this.type + this.depth + ' tile',
			xpos: this.x,
			ypos: this.y
		}
	}
});