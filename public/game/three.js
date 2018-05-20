var camera, scene, light_col, pressf = false, plats = [], player_collusion, freezed = false, enemies = [], players = {}, players_collisions = [], lights_sources = [], lights = [], mixers = [], action = {}, player_collision, pointl_col, pointLight, clock = new THREE.Clock(), detection_meshes = [], lights_sources = [], cc = 0, time = 0, test_mesh, coof = 0, cink = 11, renderer, spotlight, flashlight = new THREE.Object3D(), slideList = [], label, controls, rendererStats, raycaster, collidableMeshList = [], mixers = [], clock;

function initThreeJs(){
  scene = new THREE.Scene();

  let parent_block = document.getElementById('game-container');

  let sky_color = 'black';

  let m = new THREE.MeshLambertMaterial({ color: 'red' });

  pointLight = new THREE.PointLight('white', 0.5, 250);
  pointLight.position.set(872, 100, 1053);
  pointLight.userData = { status: true };
  lights_sources.push(pointLight);

  scene.add(pointLight);

  let gp = new THREE.BoxGeometry(420, 10, 420);
  pointl_col = new THREE.Mesh(gp, m);
  pointl_col.position.set(872, 5, 1053);
  pointl_col.userData = { source: 'static' };

  lights.push(pointl_col);

  //var light = new THREE.AmbientLight('white'); // soft white light
  //scene.add( light );

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.domElement.id = 'game';
  renderer.setPixelRatio(window.devicePixelRatio * 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.autoUpdate = false;

  //scene.fog = new THREE.Fog(sky_color, 1400, 1500);

  parent_block.appendChild(renderer.domElement);

  label = document.createElement('div');
  label.style = `position: absolute; color: white; background-color: rgba(0,0,0,0.4); padding: 10px; top: 10px; left: 10px;`
  parent_block.appendChild(label);

  renderer.setClearColor(sky_color, 1);

  /*controls = document.createElement('div');
  controls.innerHTML = `
    <div style = 'position: fixed; left: 70px; bottom: 0; width: 100%; height: 100px'>
      <div id = 'up' class = 'controls'>up</div>
      <div id = 'down' class = 'controls'>dw</div>
      <div id = 'left' class = 'controls'>lf</div>
      <div id = 'right' class = 'controls'>rg</div>

    </div>
  `;
  document.body.appendChild(controls);

  document.getElementById('up').addEventListener("touchstart", () => keyPressed[KEY.W] = true );
  document.getElementById('up').addEventListener("touchend", () => keyPressed[KEY.W] = false);
  document.getElementById('down').addEventListener("touchstart", () => keyPressed[KEY.S] = true );
  document.getElementById('down').addEventListener("touchend", () => keyPressed[KEY.S] = false);
  document.getElementById('left').addEventListener("touchstart", () => keyPressed[KEY.A] = true );
  document.getElementById('left').addEventListener("touchend", () => keyPressed[KEY.A] = false);
  document.getElementById('right').addEventListener("touchstart", () => keyPressed[KEY.D] = true );
  document.getElementById('right').addEventListener("touchend", () => keyPressed[KEY.D] = false);*/
  /*function hasLoaded(texture){
    console.log(texture)
    let material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.BackSide, wireframe: false });
    let sky = new THREE.Mesh(geometry, material)
    sky.position.set(1900, 0, 1900)
    scene.add(sky);
  }

  let geometry = new THREE.SphereGeometry((Math.sqrt(2 * Math.pow(40 / 2,2)) + 1) * 90, 15, 15, Math.PI, Math.PI * 2, 3.25*Math.PI/2);
  geometry.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 0.3, 1.0 ));
  let texture = new THREE.TextureLoader().load('./sky.jpg', (t) => hasLoaded(t), null, null );*/

  clock = new THREE.Clock();
}

function flashlightt(){
  if(player.team == 'reimu'){
    toggleFlashlight(1);
    let clicks = 0;
    const message = document.getElementById('action-message');
    const TIMEOUT = 32500;

    setTimeout(offFlashLight, TIMEOUT);

    document.addEventListener('keyup', e => {
      if (e.keyCode === 34 || e.keyCode === 39) {
        clicks--;
        if (clicks === 0) {
          toggleFlashlight(1);
          window.DOM_Helpers.hideHTML(message);
          setTimeout(offFlashLight, TIMEOUT)
        }
      }
    });

    function offFlashLight() {
      toggleFlashlight(0);
      window.DOM_Helpers.showHTML(message);
      clicks = 7;
    }
  }
}

function initCamera(data){

  player.team = data.team;

  if(data.team == 'kaban'){
    var light = new THREE.AmbientLight('rgb(9, 36, 5)'); // soft white light
    scene.add( light );
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    let m = new THREE.MeshLambertMaterial({ color: 'red' });
    let g = new THREE.BoxGeometry(40, 10, 40);

    player_collusion = new THREE.Mesh(g, m);
    player_collusion.position.set(0,-35,0);
    camera.add(player_collusion);
    scene.add(camera);
  }else if(data.team == 'reimu'){
    let m = new THREE.MeshLambertMaterial({ color: 'red' });

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    spotlight = new THREE.SpotLight(0xffffff, 1.75, 450, Math.PI / 8, 1, 1);

    let g = new THREE.BoxGeometry(100, 10, 370);
    light_col = new THREE.Mesh(g, m);
    light_col.visible = false;

    //scene.add(l)

    camera.add(light_col);
    camera.add(spotlight);
    light_col.position.set(0,-35,-250);
    spotlight.position.set(0,10,20);
    scene.add(camera);

    scene.add(flashlight);
    spotlight.target = flashlight;
  }

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  let position = data.position;
  controls.getObject().position.set(position[0], position[1] + 45, position[2]);
  controls.getObject().lookAt(new THREE.Vector3(1050, 45, 1055));

  setInterval(() => {

    let data = {
      position: controls.getObject().position,
      rotation: controls.getObject().rotation,
      id: player.id,
      light: light_col.userData.status || false
    };

    window.socket.emit('player:update', { gameId, data });
  }, 100);

  flashlightt();
}

function toggleFlashlight(intensity){
  spotlight.intensity = intensity;
  if(intensity){
    light_col.userData.status = true;
  }else{
    light_col.userData.status = false;
  }
}

function updatePlayers(data){

  const { id, position, rotation, light } = data;
  if(id != player.id){
    if(players[id]){
      if(players[id].userData.team == 'reimu'){
        if(position.x != players[id].position.x || position.z != players[id].position.z){
          if(players[id].userData.clip == 'stay'){
            players[id].userData.clip = 'walk';
            action[id].stay.stop();
            action[id].walk.play();
          }
        }else{
          if(players[id].userData.clip == 'walk'){
            players[id].userData.clip = 'stay';
            action[id].walk.stop();
            action[id].stay.play();
          }
        }
      }

      players[id].position.set(position.x, position.y - 45, position.z);
      players[id].rotation.set(rotation._x, rotation._y, rotation._z);

      if(players[id].userData.team == 'reimu'){
        if(light){
          players[id].children[2].userData.status = true;
          players[id].children[3].intensity = 1;
        }else{
          players[id].children[2].userData.status = false;
          players[id].children[3].intensity = 0;
        }
      }
    }else{
      console.log('no such player')
    }
  }
}

function updateLight(data){
  for(let i = 0; i < lights.length; i++){
    if(lights[i].userData.source == 'static'){
      lights_sources[i].intensity = data.intensivity;
      if(data.intensivity){
        lights[i].userData.status = true;
      }else{
        lights[i].userData.status = false;
      }
    }
  }
}

function askToDisablePlate(obj){
  let index = plats.indexOf(obj);

  socket.emit('plate:disable', { gameId, index })
}

function disablePlate(data){
  plats[data.index].material = new THREE.MeshStandardMaterial({ color: 'gray' });
  plats[data.index].userData.active = false;
  plats[data.index].position.y -= 5;
}



function animate(){

  let delta2 = clock.getDelta();
  time += delta2;

  for(let i = 0; i < mixers.length; i++){
    mixers[i].update(delta2);
  }

  requestAnimationFrame(() => animate());

  keyAssigment(delta2);
  updateCurrenPositionLabel();

  /*let isMoving = false;
  let keys = Object.keys(keyPressed);
  for(let i = 0; i < keys.length; i++){
    if(keyPressed[keys[i]]){ isMoving = true; break; }
  }
  if(isMoving){
    if(coof > 1.8 || coof < -1.8){ cink = -cink;}
    let p = cink * delta2
    coof += p;
    controls.getObject().position.y += p;
    controls.getObject().rotation.y += (cink / 48) * delta2;
  }*/

  tcamera = controls.getObject().clone();
  tcamera.translateZ(-10);
  flashlight.position.set(tcamera.position.x, tcamera.position.y + 8, tcamera.position.z - 2);
  //console.log(spotlight.position)

  renderer.render(scene, camera);
  //var delta = clock.getDelta();
  //for(let i = 0; i < mixers.length; i++){
  //  mixers[i].update(delta);
  //}
}
