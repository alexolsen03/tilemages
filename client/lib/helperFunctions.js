
function calculateMoveableSquares(startY, startX,pathsFound,stepsTaken, MAX_STEPS){

  let start = board[startY][startX];

  if(haveVisitedTile(start, stepsTaken, pathsFound))
  	return false;

  let localPathsFound = pathsFound.slice(); // copy of array
  localPathsFound.push(start);

  if(stepsTaken > MAX_STEPS)
  	return false;

  start.moveable = true;

  let north = startY - 1;
  let east = startX + 1;
  let south = startY + 1;
  let west = startX - 1;

  if(north > -1 && north < 5)
 	goDirection(north, startX, localPathsFound, stepsTaken);	// NORTH

  if(north > -1 && north < 5 && east < 5 && east > -1)
  	goDirection(north, east, localPathsFound, stepsTaken);	// NORTH EAST

  if(east < 5 && east > -1)
  	goDirection(startY, east, localPathsFound, stepsTaken);	// EAST

  if(south < 5 && south > -1 && east < 5 && east > -1)
  	goDirection(south, east, localPathsFound, stepsTaken);	// SOUTH EAST

  if(south < 5 && south > -1)
  	goDirection(south, startX, localPathsFound, stepsTaken);	// SOUTH

  if(south < 5 && south > -1 && west > -1 && west < 5)
  	goDirection(south, west, localPathsFound, stepsTaken);	// SOUTH WEST

  if(west > -1 && west < 5)
  	goDirection(startY, west, localPathsFound, stepsTaken);	// WEST

  if(north > -1 && north < 5 && west > -1 && west < 5)
  	goDirection(north, west, localPathsFound, stepsTaken);	// NORTH WEST

  return false;
}

function goDirection(y,x, localPathsFound, stepsTaken){
  stepsTaken++;

  if(board[y][x].type != 'water')
  	calculateMoveableSquares(y, x, localPathsFound, stepsTaken, MAX_STEPS);
  else
  	return false;
}

function haveVisitedTile(tile, stepsTaken, pathsFound){
	let y = tile.y;
  let x = tile.x;

  let id = y+1 * 10 + x; // should be unique id

	for(let i=0; i<stepsTaken; i++){
  	if(pathsFound[i] == id)
    	return true;
  }

  return false;
}

function clearSelectableTiles(board){
  board.forEach(function(row){
    row.forEach(function(tile){
      tile.isMoveable = false;
    })
  })
}

function getTilesAdjacentToPoint(board, x, y, spaces){
  let MAX_BOTTOM = 10;
  let MAX_TOP = -1;
  let MAX_RIGHT = 10;
  let MAX_LEFT = -1;

  let adjacentTiles = [];

  let xtarget = x + spaces;
  let ytarget = y + spaces;

  let xtracker = x - spaces;  // top left
  let ytracker = y - spaces;  // top left

  while(xtracker != xtarget || ytracker != ytarget){

    if(xtracker > MAX_TOP &&
       xtracker < MAX_BOTTOM &&
       ytracker < MAX_RIGHT &&
       ytracker > MAX_LEFT){
      adjacentTiles.push(board[xtracker][ytracker]);
    }

    if(xtracker < xtarget){
      xtracker = xtracker + 1;
    }else{
      ytracker = ytracker + 1;
      }

  }

  xtarget = x - spaces;
  ytarget = y - spaces;

  xtracker = x + spaces;  // top left
  ytracker = y + spaces;  // top left

  while(xtracker != xtarget || ytracker != ytarget){

    if(xtracker > MAX_TOP &&
       xtracker < MAX_BOTTOM &&
       ytracker < MAX_RIGHT &&
       ytracker > MAX_LEFT){
      adjacentTiles.push(board[xtracker][ytracker]);
    }

    if(xtracker > xtarget){
      xtracker = xtracker - 1;
    }else{
      ytracker = ytracker - 1;
      }

  }

  return adjacentTiles;
}

function resetTeams(template){
  let soldiersRed = template.soldiersRed.get();

  for(let i=0; i<soldiersRed.length; i++){
    let soldier = soldiersRed[i];
    soldier.resetActions();
  }

  template.soldiersRed.set(soldiersRed);

  let soldiersBlue = template.soldiersBlue.get();

  for(let i=0; i<soldiersBlue.length; i++){
    let soldier = soldiersBlue[i];
    soldier.resetActions();
  }

  template.soldiersBlue.set(soldiersBlue);
}

function editTerraformableSquares(board, startX, startY, terraformable){
  let adjacentTiles1 = getTilesAdjacentToPoint(board, startX, startY, 1);
  adjacentTiles1.forEach(function(tile){
    if(tile.soldier == null)
      tile.isMoveable = terraformable;
    else
      tile.isMoveable = false;
  });

  let adjacentTiles2 = getTilesAdjacentToPoint(board, startX, startY, 2);
  adjacentTiles2.forEach(function(tile){
    if(tile.soldier == null)
      tile.isMoveable = terraformable;
    else
      tile.isMoveable = false;
  });
}

export {
  clearSelectableTiles,
  getTilesAdjacentToPoint,
  resetTeams,
  editTerraformableSquares
}