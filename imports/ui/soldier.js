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

Template.soldier.onCreated(function(){
	this.soldier = new ReactiveVar({
		movement: 2
	});

	this.movingState = new ReactiveVar(false);
});

Template.soldier.events({
	'click .soldier': function(event, template){
		let MAX_BOTTOM = 10;
		let MAX_TOP = -1;
		let MAX_RIGHT = 10;
		let MAX_LEFT = -1;

		let x = this.x;
		let y = this.y;

		if(!template.movingState.get()){
			template.movingState.set(true);

			// go down
			let ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM){
				getTileObj(this,x + ctr,y).isMoveable = true;
				ctr++;
			}

			// go down right
			ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
				getTileObj(this,x+ctr,y+ctr).isMoveable = true;
				ctr++;
			}

			// go right
			ctr = 0;
			while(ctr < template.soldier.get().movement && y+ctr < MAX_RIGHT){
				getTileObj(this,x,y+ctr).isMoveable = true;
				ctr++;
			}

			// go down left
			ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
				getTileObj(this,x+ctr,y-ctr).isMoveable = true;
				ctr++;
			}

			// go left
			ctr = 0;
			while(ctr < template.soldier.get().movement && y-ctr > MAX_LEFT){
				getTileObj(this,x,y-ctr).isMoveable = true;
				ctr++;
			}

			// go up left
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
				getTileObj(this,x-ctr,y-ctr).isMoveable = true;
				ctr++;
			}

			// go up
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP){
				getTileObj(this,x-ctr,y).isMoveable = true;
				ctr++;
			}

			//go up right
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
				getTileObj(this,x-ctr,y+ctr).isMoveable = true;
				ctr++;
			}

		}else{
			template.movingState.set(false);

						// go down
			let ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM){
				getTileObj(this,x + ctr,y).isMoveable = false;
				ctr++;
			}

			// go down right
			ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM && y+ctr <MAX_RIGHT){
				getTileObj(this,x+ctr,y+ctr).isMoveable = false;
				ctr++;
			}

			// go right
			ctr = 0;
			while(ctr < template.soldier.get().movement && y+ctr < MAX_RIGHT){
				getTileObj(this,x,y+ctr).isMoveable = false;
				ctr++;
			}

			// go down left
			ctr = 0;
			while(ctr < template.soldier.get().movement && x+ctr < MAX_BOTTOM && y-ctr > MAX_LEFT){
				getTileObj(this,x+ctr,y-ctr).isMoveable = false;
				ctr++;
			}

			// go left
			ctr = 0;
			while(ctr < template.soldier.get().movement && y-ctr > MAX_LEFT){
				getTileObj(this,x,y-ctr).isMoveable = false;
				ctr++;
			}

			// go up left
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP && y-ctr > MAX_LEFT){
				getTileObj(this,x-ctr,y-ctr).isMoveable = false;
				ctr++;
			}

			// go up
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP){
				getTileObj(this,x-ctr,y).isMoveable = false;
				ctr++;
			}

			//go up right
			ctr = 0;
			while(ctr < template.soldier.get().movement && x-ctr > MAX_TOP && y+ctr < MAX_RIGHT){
				getTileObj(this,x-ctr,y+ctr).isMoveable = false;
				ctr++;
			}
		}

	}
});