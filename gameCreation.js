GameFactory = {};

GameFactory.createGame = function(playerIds){
	let players = createPlayers(playerIds);

	playerIds[0].teamA = true;	// first player is red
	playerIds[1].teamA = false;	// second player is white

	const DEFAULT_POSITION = 'M8m/1AK4ka1/1S6s1/10/10/10/10/1s6S1/1ak4KA1/m8M r 0';//'SKMASSAMKS/10/10/10/10/10/10/10/10/skmassamks r 0';
	const DEFAULT_TERRA_STATE = '10/10/10/10/10/10/10/10/10/10';

	let date = new Date();
	let messages = [];
	let message = {
		name: 'system',
		message: 'Runnak game began ' + date.toString()
	}
	messages.push(message);

	return {
		players: players,
		currentTurn: playerIds,
		inProgress: true,
		started: date,
		fen: DEFAULT_POSITION,
		boardFen: DEFAULT_TERRA_STATE,
		isAActive: false,
		messages: messages
	}
}

function createPlayers(ids){
	var o = {};

	ids.forEach(function(id){
		o[id] = {
			name: Meteor.users.findOne(id).username
		};

		if(ids[0] === id){
			o[id].teamA = true;
			o[id].team = 'a';
			o[id].color = 'r';
		}else{
			o[id].teamA = false;
			o[id].team = 'b';
			o[id].color = 'w';
		}
	});

	return o;
}
