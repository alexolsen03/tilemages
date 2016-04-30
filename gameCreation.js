GameFactory = {};

GameFactory.createGame = function(playerIds){
	let players = createPlayers(playerIds);

	return {
		players: players,
		currentTurn: playerIds,
		inProgress: true,
		started: new Date()
	}
}

function createPlayers(ids){
	var o = {};

	ids.forEach(function(id){
		o[id] = {

		}
	});

	return o;
}