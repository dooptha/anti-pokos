var camera, scene, light_col, mixers = [], action = {}, player_collision, pointl_col, player, pointLight, clock = new THREE.Clock(), detection_meshes = [], lights_sources = [], cc = 0, time = 0, test_mesh, coof = 0, cink = 11, renderer, spotlight, flashlight = new THREE.Object3D(), slideList = [], label, controls, rendererStats, raycaster, collidableMeshList = [], mixers = [], clock, action = { move: []};

function initThreeJs(){
  scene = new THREE.Scene();

  let parent_block = document.getElementById('game-container');

  let sky_color = 'black';

  let m = new THREE.MeshLambertMaterial({ color: 'red' });

  // NIGHT VISION
  //var light = new THREE.AmbientLight('rgb(30, 73, 12)'); // soft white light
  //scene.add( light );

  pointLight = new THREE.PointLight('white', 0.5, 250);
  pointLight.position.set(872, 100, 1053);
  scene.add(pointLight);

  let gp = new THREE.BoxGeometry(420, 10, 420);
  pointl_col = new THREE.Mesh(gp, m);
  pointl_col.position.set(872, 5, 1053);

  //var light = new THREE.AmbientLight('white'); // soft white light
  //scene.add( light );

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.domElement.id = 'game';
  renderer.setPixelRatio(window.devicePixelRatio * 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.autoUpdate = false;

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

  spotlight = new THREE.SpotLight(0xffffff, 1.25, 450, Math.PI / 8, 0.5, 1);

  let g = new THREE.BoxGeometry(100, 10, 370);
  light_col = new THREE.Mesh(g, m);
  light_col.visible = false;

  let l = new THREE.PointLight('white', 1, 1000);
  l.position.set(1000,100,1000)

  //scene.add(l)

  camera.add(light_col);
  camera.add(spotlight);
  light_col.position.set(0,-35,-250);
  spotlight.position.set(0,10,20)
  scene.add(camera);

  scene.add(flashlight);
  spotlight.target = flashlight;

  //scene.fog = new THREE.Fog(sky_color, 1400, 1500);

  rendererStats	= new THREEx.RendererStats()

  rendererStats.domElement.style.position	= 'absolute'
  rendererStats.domElement.style.left	= '0px'
  rendererStats.domElement.style.bottom	= '0px'
  parent_block.appendChild( rendererStats.domElement )

  controls = new THREE.PointerLockControls(camera);
  scene.add( controls.getObject() );

  controls.getObject().position.set(902, 45, 1055);
  controls.getObject().lookAt(new THREE.Vector3(1050, 45, 1055));
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

function animate(){

  let delta2 = clock.getDelta();
  time += delta2;

  for(let i = 0; i < mixers.length; i++){
    mixers[i].update(delta2);
  }


  if(time > 1.9){
    pointLight.intensity = 1;
  }else if(time > 1.3){
    pointLight.intensity = 0;
  }else if(time > 0.89){
    pointLight.intensity = 1;
  }else if(time > 0.8){
    pointLight.intensity = 0;
  }else if(time > 0.75){
    pointLight.intensity = 1;
  }else if(time > 0.5){
    pointLight.intensity = 0;
  }else if(time > 0.3){
    pointLight.intensity = 1;
  }else if(time > 0.15){
    pointLight.intensity = 0;
  }

  if(time > 2.5){
    time = 0;
  }

  requestAnimationFrame(() => animate());

  keyAssigment(delta2);
  updateCurrenPositionLabel();

  let isMoving = false;
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
  }

  tcamera = controls.getObject().clone();
  tcamera.translateZ(-10);
  flashlight.position.set(tcamera.position.x, tcamera.position.y + 8, tcamera.position.z - 2);
  //console.log(spotlight.position)

  renderer.render(scene, camera);
  rendererStats.update(renderer);

  //var delta = clock.getDelta();
  //for(let i = 0; i < mixers.length; i++){
  //  mixers[i].update(delta);
  //}
}
