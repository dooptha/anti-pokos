var keyPressed = {}, pressedKeysCount = 0, pos_mesh, size = 10;

document.addEventListener('keydown', (e) => addPressedKey(e), false);
document.addEventListener('keyup', (e) => removePressedKey(e), false);

function addPressedKey(e){

  keyPressed[e.keyCode] = true;
  pressedKeysCount++;
}

function removePressedKey(e){

  keyPressed[e.keyCode] = false;
  pressedKeysCount--;
}

function keyAssigment(delta){

  let mov_x, mov_z;

  //pos_mesh.scale.set(size, size);

  if(keyPressed[KEY.F]){
    action.move.play();
  }

  if(keyPressed[KEY.LEFT]){
    //player_collision.position.x+= config.movement_speed * delta;
    //player.position.x+= config.movement_speed * delta;
  }
  if(keyPressed[KEY.RIGHT]){
    //player_collision.position.x-= config.movement_speed * delta;
    //player.position.x-= config.movement_speed * delta;
  }
  if(keyPressed[KEY.UP]){
    //player_collision.position.z+= config.movement_speed * delta;
    //player.position.z+= config.movement_speed * delta;
  }
  if(keyPressed[KEY.DOWN]){
    //player_collision.position.z-= config.movement_speed * delta;
    //player.position.z-= config.movement_speed * delta;
  }

  if(keyPressed[KEY.W]) mov_z = -config.movement_speed;
  if(keyPressed[KEY.S]) mov_z = config.movement_speed;

  if(keyPressed[KEY.A]) mov_x = -config.movement_speed;
  if(keyPressed[KEY.D]) mov_x = config.movement_speed;

  if(mov_x || mov_z){

    let temp_camera = controls.getObject().clone();
    let ray_dir = temp_camera.getWorldDirection().clone();
    let temp_z = controls.getObject().position.z;

    if(mov_z){
      let can_move = true;

      if(mov_z < 0){ // s
        ray_dir.z = -ray_dir.z;
        ray_dir.x = -ray_dir.x;
      }else{ // w
        ray_dir.z = ray_dir.z;
      }

      temp_camera.translateZ(mov_z * delta);

      let raycaster = new THREE.Raycaster(temp_camera.position, ray_dir);
      var intersects = raycaster.intersectObjects(collidableMeshList, true);
      for(let i = 0; i < intersects.length; i++){

        if(intersects[i].distance < 22){
          can_move = false;
          break;
        }
      }

      if(can_move){
        controls.getObject().translateZ(mov_z * delta);
      }
    }

    if(mov_x){
      let can_move = true;

      temp_camera.translateX(mov_x * delta);

      ray_dir = new THREE.Vector3().subVectors(temp_camera.position, controls.getObject().position).normalize();

      let raycaster = new THREE.Raycaster(temp_camera.position, ray_dir);
      var intersects = raycaster.intersectObjects(collidableMeshList, true);

      for(let i = 0; i < intersects.length; i++){
        if(intersects[i].distance < 22){
          console.log('COLLIDE')
          can_move = false;
          break;
        }
      }

      if(can_move){
        controls.getObject().translateX(mov_x * delta);
      }
    }

    // ESCALATOR

    let escalator = false;
    temp_camera.position.y -= 35;
    let esc_raycaster = new THREE.Raycaster(temp_camera.position, {x: 0, y: -1, z: 0});
    let esc_intersects = esc_raycaster.intersectObjects(slideList);

    for (var i = 0; i < esc_intersects.length; i++) {
      if(esc_intersects[i].distance < 500) {

        escalator = true;

        let z_distance = temp_z - controls.getObject().position.z;
        controls.getObject().position.y += z_distance;
      }
    }

    if(controls.getObject().position.y < 45) controls.getObject().position.y = 45;
    else if(controls.getObject().position.y > 145) controls.getObject().position.y = 145;
  }

  // LIGHT

  /*let firstBB = new THREE.Box3().setFromObject(light_col);
  let secondBB = new THREE.Box3().setFromObject(player_collision);

  let firstCC = new THREE.Box3().setFromObject(pointl_col);
  let secondCC = new THREE.Box3().setFromObject(player_collision);

  var collision2 = firstCC.intersectsBox(secondCC);
  if(collision2){
  }

  var collision = firstBB.intersectsBox(secondBB);
  if(collision){
  }*/
}
