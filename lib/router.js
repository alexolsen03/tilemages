Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('home',{ path: '/' });
	this.route('board', {
		path: '/game/:_id',
		data: function(){
			let game = Games.findOne(this.params._id);

			console.log('router id');
			console.log(this.params._id);
			console.log(game);

			game.player = game.players[Meteor.userId()];
			game.yourTurn = game.currentTurn[0] === Meteor.userId();

			let otherId = game.currentTurn[game.yourTurn ? 1 : 0];
			game.otherPlayer = {
				username: Meteor.users.findOne(otherId).username,
			}

			return game;
		}
	});
});