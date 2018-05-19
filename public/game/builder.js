let models_count = 7, models_loaded = 0,
  pikalka, st, mt, kokoro, kokoro_roof, roof, gift, proof;

function startGame(){
  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {
  var element = document.body;

  var pointerlockchange = function ( event ) {

    if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element){
      controlsEnabled = true;
      controls.enabled = true;
      blocker.style.display = 'none';
    }else{
      controls.enabled = false;
      blocker.style.display = 'block';
      instructions.style.display = '';
    }
  };

  var pointerlockerror = function ( event ) {
    instructions.style.display = '';
  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {
    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  }, false );
  }else{
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }

  var controlsEnabled = false;

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;

  var prevTime = performance.now();
  var velocity = new THREE.Vector3();
  var direction = new THREE.Vector3();
  var vertex = new THREE.Vector3();
  var color = new THREE.Color();

  initThreeJs();
  prepareScene();
  start();
}

function updateCurrenPositionLabel(){

  label.innerHTML = `
    current position:
    x: ${controls.getObject().position.x.toFixed(2)}
    z: ${controls.getObject().position.z.toFixed(2)}
    y: ${controls.getObject().position.y.toFixed(2)}
    ${window.innerWidth}
    ${window.innerHeight}
  `;

  if(player){
    label.innerHTML += `<br />
    mesh position:
    x: ${player.position.x.toFixed(2)}
    z: ${player.position.y.toFixed(2)}
    y: ${player.position.z.toFixed(2)}
    s: ${player.scale.x}`;
  }
}

function start(){
  let st = new MallBuilder();
}
