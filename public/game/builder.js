let models_count = 7, models_loaded = 0,
  pikalka, st, mt, kokoro, kokoro_roof, roof, gift, proof;

function startGame(data){

  initThreeJs();
  prepareScene();
  start(data);
}

function updateCurrenPositionLabel(){

  /*label.innerHTML = `
    current position:
    x: ${controls.getObject().position.x.toFixed(2)}
    z: ${controls.getObject().position.z.toFixed(2)}
    y: ${controls.getObject().position.y.toFixed(2)}
    ${window.innerWidth}
    ${window.innerHeight}
  `;

  if(false){
    label.innerHTML += `<br />
    mesh position:
    x: ${player.position.x.toFixed(2)}
    z: ${player.position.y.toFixed(2)}
    y: ${player.position.z.toFixed(2)}
    s: ${player.scale.x}`;
  }*/
}

function start(data){
  let st = new MallBuilder(data);
}
