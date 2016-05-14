GameFactory = {};

GameFactory.createGame = function(playerIds){
	let players = createPlayers(playerIds);

	playerIds[0].teamA = false;	// first player is white
	playerIds[1].teamA = true;	// second player is red

	const DEFAULT_POSITION = 'SKMASSAMKS/10/10/10/10/10/10/10/10/skmassamks r';
	const DEFAULT_TERRA_STATE = '10/10/10/10/10/10/10/10/10/10';

	return {
		players: players,
		currentTurn: playerIds,
		inProgress: true,
		started: new Date(),
		fen: DEFAULT_POSITION,
		boardFen: DEFAULT_TERRA_STATE,
		isAActive: false
	}
}

function createPlayers(ids){
	var o = {};

	ids.forEach(function(id){
		o[id] = {
			name: Meteor.users.findOne(id).username
		};

		if(ids[0] === id){
			o[id].teamA = false;
			o[id].team = 'b';
		}else{
			o[id].teamA = true;
			o[id].team = 'a';
		}
	});

	return o;
}
