let adjacent_cells = [[0,-1] ,[1,0] ,[0,1] ,[-1,0]];

function findFirstEmptyAdajcentCell(arr, markers, x, y){

  for(let i = 0; i < adjacent_cells.length; i++){
    if(x + adjacent_cells[i][0] >= 0 && x + adjacent_cells[i][0] < arr.length &&
       y + adjacent_cells[i][1] >= 0 && y + adjacent_cells[i][1] < arr.length){

      for(let marker = 0; marker < markers.length; marker++){
        if(arr[x + adjacent_cells[i][0]][y + adjacent_cells[i][1]] == markers[marker]){
          return i;
        }
      }
    }
  }

  return false;
}

function findEmptyAdajcentCells(arr, markers, x, y){
  let cells = [false, false, false, false];
  for(let i = 0; i < adjacent_cells.length; i++){
    if(x + adjacent_cells[i][0] >= 0 && x + adjacent_cells[i][0] < arr.length &&
       y + adjacent_cells[i][1] >= 0 && y + adjacent_cells[i][1] < arr.length){

      for(let marker = 0; marker < markers.length; marker++){
       if(arr[x + adjacent_cells[i][0]][y + adjacent_cells[i][1]] == markers[marker]){
         cells[i] = true;
         break;
       }
      }
    }
  }

  return cells;
}
