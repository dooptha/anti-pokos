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

  let mov_x, mov_z, temp_freezed = false;

  if(player.team == 'kaban'){
    //console.log(player);

    let boundriesBB = new THREE.Box3().setFromObject(player_collusion);

    for(let i = 0; i < lights.length; i++){
      let boundriesAA = new THREE.Box3().setFromObject(lights[i]);

      var collision = boundriesAA.intersectsBox(boundriesBB);
      if(collision){
        if(lights_sources[i].userData.status){
          if(lights[i].userData.source == 'flashlight'){
            temp_freezed = true;
            break;
          }else{
            let keys = Object.keys(players);
            for(let j = 0; j < keys.length; j++){
              if(players[keys[j]].userData.team == 'reimu'){
                let pos1 = controls.getObject().position;
                let pos2 = players[keys[j]].position;

                let distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2));

                let ray_dir = new THREE.Vector3().subVectors(pos1, pos2).normalize();
                let camera_ray = players[keys[j]].getWorldDirection().clone();

                let angle1 = (360 + Math.round(180 * Math.atan2(ray_dir.x, ray_dir.z) / Math.PI)) % 360;
                let angle2 = (180 + Math.round(180 * Math.atan2(camera_ray.x, camera_ray.z) / Math.PI)) % 360;

                if(Math.abs(angle1 - angle2) < 30){
                  let raycaster = new THREE.Raycaster(pos1, ray_dir, 0, distance);
                  var intersects = raycaster.intersectObjects(collidableMeshList, true);
                  if(intersects.length == 0){
                    temp_freezed = true;
                    break;
                  }
                }
              }
            }

            if(temp_freezed){ break; }
          }
        }
      }
    }
  }

  freezed = temp_freezed;

  if(!freezed){
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

        if(true){
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

        if(true){
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
