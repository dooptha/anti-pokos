class MallBuilder{
  constructor(data){
    console.log(data)
    this.data = data;
    this.meshes = new MeshesManager();
    this.models_manager = new ModelsManager(this.meshes, (state) => this.loaded(state));
    this.textures_manager = new TexturesManager((state) => this.loaded(state));
    this.models_manager.uploadModels();
    this.textures_manager.uploadTextures();

    this.ready = {textures: false, models: false};

    this.length = 190;
    this.height = 100;
  }

  loaded(state){

    this.ready[state] = true;

    if(this.ready.textures && this.ready.models){
      this.build();
    }
  }

  randomShop(){
    let stores_count = 2;

    let rand = Math.floor(Math.random() * stores_count) + 0;

    switch(rand){
      case 0: return this.stores_builder.juiceStore(); break;
      case 1: return this.stores_builder.icecreamStore(); break;
    }
  }

  randomStore(){
    let stores_count = 7;

    let rand = 5;

    switch(rand){
      case 0: return this.stores_builder.shoesStore(); break;
      case 1: return this.stores_builder.ladiesStore(); break;
      case 2: return this.stores_builder.mensStore(); break;
      case 3: return this.stores_builder.cosmeticStore(); break;
      case 4: return this.stores_builder.jewelleryStore(); break;
      case 5: return this.stores_builder.bagsStore(); break;
      case 6: return this.stores_builder.lingerieStore(); break;
    }
  }

  // let colors = ['rgb(236, 217, 183)', 'rgb(249, 244, 224)', 'rgb(216, 190, 131)']; shoes
  // let colors = ['rgb(206, 230, 246)', 'rgb(255, 248, 191)', 'rgb(47, 46, 45)']; ladies
  // let colors = ['rgb(173, 205, 195)', 'rgb(226, 238, 236)', 'rgb(207, 212, 156)']; jewellery

  debugBuild(){
    this.stores_builder = new StoresManager(this.meshes, this.textures_manager);

    animate();
  }

  mergeWithWorld(child){
    if(child.userData.type == 'simple'){
      scene.add(child);
    }
    else if(child.userData.type == 'collision'){
      child.children.forEach((mesh) => {
        collidableMeshList.push(mesh);
      })
      child.updateMatrixWorld(true);
    }
    else if(child.userData.type == 'border'){
      child.updateMatrixWorld();
      child.children.forEach((mesh) => {
        collidableMeshList.push(mesh);
      })
    }
    else if(child.userData.type == 'slide'){
      child.updateMatrixWorld();
      child.children.forEach((mesh) => {
        slideList.push(mesh);
      });
    }
  }

  build(){

    for(let i = 0; i < this.data.players.length; i++){
      if(player.id != this.data.players[i].id){
        if(this.data.players[i].team == 'reimu'){
          let mat = [
            new THREE.MeshLambertMaterial({ color: 'white' }),
            new THREE.MeshLambertMaterial({ color: '#E7C6B8' }),
            new THREE.MeshLambertMaterial({ color: '#E74039' }),
            new THREE.MeshLambertMaterial({ color: '#472A0F' }),
            new THREE.MeshLambertMaterial({ color: '#6A2401' }),
            new THREE.MeshLambertMaterial({ color: '#000000' })
          ];

          let reimu = new THREE.Object3D;

          reimu.add(this.meshes.getPlayer('player', mat));
          reimu.add(this.meshes.getPlayer('player_collision', mat));
          reimu.children[1].visible = false;

          // light

          let flashlight = new THREE.SpotLight(0xffffff, 1.25, 450, Math.PI / 8, 0.5, 1);
          flashlight.position.set(0,45,0);
          flashlight.target.position.set(0,40,-200);
          flashlight.userData = { status: true };
          lights_sources.push(flashlight);

          let m = new THREE.MeshLambertMaterial({ color: 'red' });
          let g = new THREE.BoxGeometry(80, 10, 350);
          light_col = new THREE.Mesh(g, m);
          light_col.visible = false;
          light_col.position.set(0,10,-240);
          light_col.userData = { source: 'flashlight', status: true };

          reimu.add(light_col);
          reimu.add(flashlight);
          reimu.add(flashlight.target);
          reimu.userData = { team: 'reimu' };

          reimu.position.set(this.data.players[i].position[0], this.data.players[i].position[1] - 45, this.data.players[i].position[2]);

          lights.push(light_col);
          players[this.data.players[i].id] = reimu;
          scene.add(reimu);
        }else{
          let mat = [
            new THREE.MeshLambertMaterial({ color: '#3C54E7' }),
            new THREE.MeshLambertMaterial({ color: '#7F4400' }),
            new THREE.MeshLambertMaterial({ color: '#E7DC00' }),
            new THREE.MeshLambertMaterial({ color: 'white' }),
            new THREE.MeshLambertMaterial({ color: 'white' }),
            new THREE.MeshLambertMaterial({ color: '#E70900' }),
            new THREE.MeshLambertMaterial({ color: '#482F02' })
          ];

          let enemy = new THREE.Object3D;

          enemy.add(this.meshes.getEnemy('police', mat));
          enemy.add(this.meshes.getPlayer('player_collision', mat));
          enemy.children[1].visible = false;
          enemy.userData = { team: 'kaban' };

          enemy.position.set(this.data.players[i].position[0], this.data.players[i].position[1] - 45, this.data.players[i].position[2]);

          players[this.data.players[i].id] = enemy;
          scene.add(enemy);
        }
      }else{
        initCamera(this.data.players[i], this.meshes.getPlayer('player_collision', [new THREE.MeshLambertMaterial({ color: 'red' })]));
      }
    }



    //detection_meshes.push(player_collision);

    this.stores_builder = new StoresManager(this.meshes, this.textures_manager);

    // GENERATE MALL FLOOR

    let mall_floor = this.meshes.mallFloor();
    mall_floor.position.set(this.length * 10, 0, this.length * 10);
    scene.add(mall_floor);

    // READ MAP ARRAY AND RUN BUILD LOOP

    let map = map1;

    for(let ver = 0; ver < map.length; ver++){
      for(let hor = 0; hor < map[0].length; hor++){
        // STORE
        if(map[ver][hor] == '□'){
          // FIND FREE ADJACENT CELL TO ROTATE STORE IN RIGHT WAY

          let adj_cell = findFirstEmptyAdajcentCell(map, ['.', '▰'], ver, hor);
          let dir = 0, store_carcas;

          switch(adj_cell){
            case 0: dir = 0; break;   // z+
            case 1: dir = 270; break; // x-
            case 2: dir = 180; break; // z-
            case 3: dir = 90; break;  // x+
          }

          // FIRSTLY WE PLACE STORE CARCASS(WALLS, WINDWOS), THAN WE PLACE STORE
          // SET(FURNITURE, GIFTS)

          /*if((ver + hor) % 5 == 0) color = 'orange';
          else if((ver + hor) % 3 == 0) color = 'green';
          else if((ver + hor) % 2 == 0) color = 'pink';*/

          let store = this.randomStore();

          for(let i = 0; i < store.length; i++){
            store[i].position.set(ver * this.length, 0, hor * this.length);
            store[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store[i]);
          }

          store_carcas = this.stores_builder.store();

          let dir2 = dir - 180;
          if(dir2 < 0){
            dir2 = dir2 + 360;
          }

          let emp_cell = findFirstEmptyAdajcentCell(map, ['▱'], ver, hor), sec_dir;

          if(emp_cell !== false){

            switch(emp_cell){
              case 0: sec_dir = 0; break;   // z+
              case 1: sec_dir = 270; break; // x-
              case 2: sec_dir = 180; break; // z-
              case 3: sec_dir = 90; break;  // x+
            }

            let store_carcas_sec = this.stores_builder.storeSecond();

            for(let i = 0; i < store_carcas_sec.length; i++){
              store_carcas_sec[i].position.set(ver * this.length, 0, hor * this.length);
              store_carcas_sec[i].rotateY(sec_dir * Math.PI / 180);
              this.mergeWithWorld(store_carcas_sec[i]);
            }

            let store2 = this.randomStore();

            for(let i = 0; i < store2.length; i++){
              store2[i].position.set(ver * this.length, this.height, hor * this.length);
              store2[i].rotateY(sec_dir * Math.PI / 180);
              this.mergeWithWorld(store2[i]);
            }
          }

          for(let i = 0; i < store_carcas.length; i++){
            store_carcas[i].position.set(ver * this.length, 0, hor * this.length);
            store_carcas[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store_carcas[i]);
          }
        }
        // CORNER STORE
        else if(map[ver][hor] == '◽'){

          // FIND FREE ADJACENT CELLS TO ROTATE CORNER STORE IN RIGHT WAY

          let adj_cells = findEmptyAdajcentCells(map, ['.', '△', '▰'], ver, hor);
          let dir = 0;

          if(adj_cells[0] && adj_cells[1]) dir = 0;      //x-
          else if(adj_cells[1] && adj_cells[2]) dir = 270; //z-
          else if(adj_cells[2] && adj_cells[3]) dir = 180;  //x+
          else if(adj_cells[3] && adj_cells[0]) dir = 90;   //z+

          // FIRSTLY WE PLACE STORE CARCASS(WALLS, WINDWOS), THAN WE PLACE STORE
          // SET(FURNITURE, GIFTS)

          let store = this.randomShop();
          for(let i = 0; i < store.length; i++){
            store[i].position.set(ver * this.length, 0, hor * this.length);
            store[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store[i]);
          }

          let store_carcas = this.stores_builder.storeCorner();
          for(let i = 0; i < store_carcas.length; i++){
            store_carcas[i].position.set(ver * this.length, 0, hor * this.length);
            store_carcas[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store_carcas[i]);
          }
        }
        // ESCALATOR
        else if(map[ver][hor] == '△'){
          // FIND FREE ADJACENT CELL TO ROTATE ESCALATOR IN RIGHT WAY

          let adj_cell = findFirstEmptyAdajcentCell(map, ['.'], ver, hor);
          let dir = 0;

          switch(adj_cell){
            case 0: dir = 180; break;   // z+
            case 1: dir = 270; break; // x-
            case 2: dir = 0; break; // z-
            case 3: dir = 90; break;  // x+
          }

          let escalator_cell = this.stores_builder.escalator();

          for(let i = 0; i < escalator_cell.length; i++){
            escalator_cell[i].position.set(ver * this.length, 0, hor * this.length);
            escalator_cell[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(escalator_cell[i]);
          }
        }
        // BRIDGE
        else if(map[ver][hor] == '▰'){
          // FIND FREE ADJACENT CELL TO ROTATE STORE IN RIGHT WAY

          let adj_cells = findEmptyAdajcentCells(map, ['▰', '▥', '▯', '▱', '▣'], ver, hor);
          let dir = 0, bridge, count = 0;

          for(let i = 0; i < 4; i++){
            if(adj_cells[i]) count++;
          }

          if(count == 2){
            let tonnel = false;

            if(adj_cells[0] && adj_cells[1]) dir = 180;      //z+
            else if(adj_cells[1] && adj_cells[2]) dir = 90; //x-
            else if(adj_cells[2] && adj_cells[3]) dir = 0;  //z-
            else if(adj_cells[3] && adj_cells[0]) dir = 270; //x+

            else if(adj_cells[0] && adj_cells[2]){ dir = 0;  tonnel = true }     //x-
            else if(adj_cells[1] && adj_cells[3]){ dir = 90; tonnel = true } //z-

            if(tonnel){ bridge = this.stores_builder.storeBridge() }
            else{ bridge = this.stores_builder.storeBridgeTurn() }

          }else if(count == 3){
            if(adj_cells[0] && adj_cells[1]) dir = 180;      //z-
            else if(adj_cells[1] && adj_cells[2]) dir = 0; //z+
            else if(adj_cells[2] && adj_cells[3]) dir = 90;      //z-
            else if(adj_cells[3] && adj_cells[0]) dir = 180; //z-

            bridge = this.stores_builder.storeBridgeTriple();
          }

          if(count > 1){
            for(let i = 0; i < bridge.length; i++){
              bridge[i].position.set(ver * this.length, this.height, hor * this.length);
              bridge[i].rotateY(dir * Math.PI / 180);
              this.mergeWithWorld(bridge[i]);
            }
          }
        }

        if(map[ver][hor] == '▥' || map[ver][hor] == '▯'){

          let adj_cell = findFirstEmptyAdajcentCell(map, ['▱', '▰', '▯'], ver, hor);
          let dir = 0;

          switch(adj_cell){
            case 0: dir = 0; break;   // z+
            case 1: dir = 270; break; // x-
            case 2: dir = 180; break; // z-
            case 3: dir = 90; break;  // x+
          }

          let tonnel = this.stores_builder.tonnelStore();
          for(let i = 0; i < tonnel.length; i++){
            tonnel[i].position.set(ver * this.length, this.height, hor * this.length);
            tonnel[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(tonnel[i]);
          }
        }

        if(map[ver][hor] == '▥' || map[ver][hor] == '▣'){

          let adj_cell = findFirstEmptyAdajcentCell(map, ['.', '▰'], ver, hor);
          let dir = 0;

          switch(adj_cell){
            case 0: dir = 0; break;   // z+
            case 1: dir = 270; break; // x-
            case 2: dir = 180; break; // z-
            case 3: dir = 90; break;  // x+
          }

          let store = this.randomStore();

          for(let i = 0; i < store.length; i++){
            store[i].position.set(ver * this.length, 0, hor * this.length);
            store[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store[i]);
          }

          let store_carcas = this.stores_builder.halfStore();
          for(let i = 0; i < store_carcas.length; i++){
            store_carcas[i].position.set(ver * this.length, 0, hor * this.length);
            store_carcas[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store_carcas[i]);
          }

          dir = dir - 180;
          if(dir < 0){ dir = dir + 360; }

          let store_carcas2 = this.stores_builder.storeHalfSolid();
          for(let i = 0; i < store_carcas2.length; i++){
            store_carcas2[i].position.set(ver * this.length, 0, hor * this.length);
            store_carcas2[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store_carcas2[i]);
          }
        }

        // ADD FLOOR ON SECOND STAGE
        if(map[ver][hor] == '▱'){

          let floor = this.stores_builder.secondFloor();
          for(let i = 0; i < floor.length; i++){
            floor[i].position.set(ver * this.length, this.height, hor * this.length);
            this.mergeWithWorld(floor[i]);
          }
        }
        //
        if(map[ver][hor] == '◾'){
          let adj_cells = findEmptyAdajcentCells(map, ['.', '△'], ver, hor);
          let dir = 0;

          for(let i = 0; i < 4; i++){

            if(adj_cells[i]){
              switch(i){
                case 0: dir = 0; break;   // z+
                case 1: dir = 180; break; // x-
                case 2: dir = 270; break; // z-
                case 3: dir = 90; break;  // x+
              }

              let store_carcas = this.stores_builder.storeSolid();
              for(let i = 0; i < store_carcas.length; i++){
                store_carcas[i].position.set(ver * this.length, 0, hor * this.length);
                store_carcas[i].rotateY(dir * Math.PI / 180);
                this.mergeWithWorld(store_carcas[i]);
              }
            }
          }
        }

        //
        if(map[ver][hor] == '▣'){
          let adj_cells = findEmptyAdajcentCells(map, ['▱', '△', '▯'], ver, hor);
          let dir = 0;

          if(adj_cells[0] && adj_cells[1]) dir = 0;      //x-
          else if(adj_cells[1] && adj_cells[2]) dir = 270; //z-
          else if(adj_cells[2] && adj_cells[3]) dir = 180;  //x+
          else if(adj_cells[3] && adj_cells[0]) dir = 90;   //z+

          let store_carcas = this.stores_builder.storeEscalator();
          for(let i = 0; i < store_carcas.length; i++){
            store_carcas[i].position.set(ver * this.length, this.height, hor * this.length);
            store_carcas[i].rotateY(dir * Math.PI / 180);
            this.mergeWithWorld(store_carcas[i]);
          }


        }

        // MALL ROOF
        if(map[ver][hor] != '□' && map[ver][hor] != ' '){
          // ROOF IS PLACED IN CHESSBOARD FORM, CHANGING CIRCLE ROOF WITH PLANE

          if((ver + hor) % 2 == 0){
            let roof = this.meshes.circleRoof();
            roof.position.set(ver * this.length, this.height * 2 + 30, hor * this.length);
            scene.add(roof);
          }else{
            let roof = this.meshes.mallRoof();
            roof.position.set(ver * this.length, this.height * 2 + 30, hor * this.length);
            scene.add(roof);
          }
        }
      }
    }

    //let sss = new THREE.BufferGeometry().fromGeometry(this.stores_builder.store_carcas);
    //scene.add(new THREE.Mesh( sss, this.meshes.generateMaterial({ color: 'white' })));

    animate();
  }
}
