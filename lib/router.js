Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('home',{
		path: '/' ,
		waitOn: function(){
			return Meteor.subscribe('users');
		}
	});
	this.route('board', {
		path: '/game/:_id',
		waitOn: function(){
			return Meteor.subscribe('games');
		},
		data: function(){
			let game = Games.findOne(this.params._id);

			if(game){
				game.player = game.players[Meteor.userId()];
				game.yourTurn = game.currentTurn[0] === Meteor.userId();

				let otherId = game.currentTurn[game.yourTurn ? 1 : 0];
				let otherUser = Meteor.users.findOne(otherId);
				if(otherUser){
					game.otherPlayer = {
						username: otherUser.username,
					}
				}
			}

			return game;
		}
	});
});