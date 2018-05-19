let models_count = 7, models_loaded = 0,
  pikalka, st, mt, kokoro, kokoro_roof, roof, gift, proof;

function updateCurrenPositionLabel(){

  label.innerHTML = `
    current position:
    x: ${camera.position.x.toFixed(2)}
    z: ${camera.position.z.toFixed(2)}
    y: ${camera.position.y.toFixed(2)}`;
}

function start(){

  let topbar_height = 25;

  // MATERIALS

  let wall_material = new THREE.MeshLambertMaterial({ color: 'rgb(150,150,150)', side: THREE.DoubleSide, wireframe: false });
  let add_wall_material = new THREE.MeshLambertMaterial({ color: 'rgb(180,180,180)', side: THREE.DoubleSide, wireframe: false });
  let roof_material = new THREE.MeshLambertMaterial({ color: 'rgb(250,250,250)', side: THREE.DoubleSide, wireframe: false });


  let ff = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshBasicMaterial({ color: 'rgb(217,217,217)', side: THREE.DoubleSide }))
  ff.rotateX(90 * Math.PI / 180);
  ff.position.set(1900,0,1900)
  scene.add(ff)


  let wall_lgeometry = new THREE.PlaneGeometry(config.cell_length, config.cell_height * 2);
  let wall_wgeometry = new THREE.PlaneGeometry(config.cell_width, config.cell_height * 2);

  let wall_l = new THREE.Mesh(wall_lgeometry, wall_material);
  let wall_w = new THREE.Mesh(wall_wgeometry, wall_material);

  let palet_geometry_h = new THREE.BoxGeometry(config.cell_length, 8, 8);
  let palet_geometry_v = new THREE.BoxGeometry(8, config.cell_height * 2, 8);

  let big_glass_g = new THREE.PlaneGeometry(config.cell_length, config.cell_height);

  let glass_material = new THREE.MeshLambertMaterial({ color: '#3d8e9c', side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
  let glass_lgeometry = new THREE.PlaneGeometry(config.cell_length / 3, config.cell_height - topbar_height);
  let glass_wgeometry = new THREE.PlaneGeometry(config.cell_width, config.cell_height - topbar_height);
  let glass_l = new THREE.Mesh(glass_lgeometry, glass_material);
  let glass_w = new THREE.Mesh(glass_wgeometry, glass_material);
  let big_glass_m = new THREE.Mesh(big_glass_g, glass_material);

  let palet_h_m = new THREE.Mesh(palet_geometry_h, wall_material);
  let palet_v_m = new THREE.Mesh(palet_geometry_v, wall_material);

  let floor_geometry = new THREE.PlaneGeometry(config.cell_width, config.cell_length);
  let floor = new THREE.Mesh(floor_geometry, wall_material);

  let topbar_geometry = new THREE.BoxGeometry(config.cell_length, topbar_height, 5);
  let topbar = new THREE.Mesh(topbar_geometry, wall_material);

  // BSP

  let rf_g = new THREE.PlaneGeometry(config.cell_length, config.cell_length);
  let rf_m = new THREE.Mesh(rf_g, roof_material)

  // Pre load

  function loadManager(){
    models_loaded++;
    if(models_count == models_loaded){
      build();
    }
  }

  // MODELS

  function addPikalka(geometry, materials){
    pikalka = new THREE.Mesh(geometry, add_wall_material);
    pikalka.scale.set(5,5,5);
    pikalka.rotateY(90 * Math.PI / 180);

    loadManager();
  }

  function addSTymb(geometry, materials){
    st = new THREE.Mesh(geometry, add_wall_material);
    st.scale.set(12,12,12)

    loadManager();
  }

  function addMTymb(geometry, materials){
    mt = new THREE.Mesh(geometry, add_wall_material);
    mt.scale.set(12,12,12)

    loadManager();
  }

  function addKokoro(geometry, materials){
    kokoro = new THREE.Mesh(geometry, add_wall_material);
    kokoro.scale.set(10,10,10)

    loadManager();
  }

  function addKokoroRoof(geometry, materials){
    kokoro_roof = new THREE.Mesh(geometry, add_wall_material);
    kokoro_roof.scale.set(12,12,12)

    loadManager();
  }

  function addRoof(geometry, materials){
    materials[0] = roof_material
    materials[1] = new THREE.MeshLambertMaterial({ color: 'rgb(120,120,120)', side: THREE.DoubleSide, wireframe: false });

    roof = new THREE.Mesh(geometry, materials);
    var box = new THREE.Box3().setFromObject(roof);
    let scale = config.cell_length / box.getSize().x;

    roof.scale.set(scale, scale, scale);
    roof.position.set(config.cell_length / 2, 180, -config.cell_width / 2);

    loadManager();
  }

  function addBoots(texture){
    texture.minFilter = THREE.LinearFilter;
    let gift_m = new THREE.SpriteMaterial({ map: texture });
    gift = new THREE.Sprite(gift_m);
    gift.scale.set(12,20)

    loadManager();
  }

  // END

  var loader = new THREE.JSONLoader();

  loader.load("./models/pikalka.json", (g, m) => addPikalka(g, m))
  loader.load("./models/small_tymb.json", (g, m) => addSTymb(g, m))
  loader.load("./models/medium_tymb.json", (g, m) => addMTymb(g, m))
  loader.load("./models/kokoro.json", (g, m) => addKokoro(g, m))
  loader.load("./models/kokoro_roof.json", (g, m) => addKokoroRoof(g, m))
  loader.load("./models/roof.json", (g, m) => addRoof(g, m));

  let tloader = new THREE.TextureLoader();

  tloader.load('./boots.png', t => addBoots(t));

  function build(){

    // BUILD ROOM

    let store1 = new THREE.Object3D();

    let store = new THREE.Object3D();

    let colable_group = new THREE.Object3D();
    let group = new THREE.Object3D();

    let pp1 = pikalka.clone();
    let pp2 = pikalka.clone();
    pp1.position.set(125, 0, 25);
    pp2.position.set(65, 0, 25);

    group.add(pp1)
    group.add(pp2)

    let glass_1 = glass_l.clone();
    let glass_2 = glass_l.clone();
    let wall_2 = wall_l.clone();

    let palet_v = palet_v_m.clone();

    let wall_3 = wall_w.clone();
    let wall_4 = wall_w.clone();
    let topbar_1 = topbar.clone();

    let floor_1 = floor.clone();

    let big_glass = big_glass_m.clone();

    glass_1.position.set(config.cell_length / 6, config.cell_height / 2 - topbar_height / 2, 2.5);
    glass_2.position.set(config.cell_length / 6 * 5, config.cell_height / 2 - topbar_height / 2, 2.5);

    big_glass.position.set(config.cell_length / 2, config.cell_height + config.cell_height / 2, 2.5)

    wall_2.position.set(config.cell_length / 2, config.cell_height, config.cell_width);

    wall_3.position.set(0, config.cell_height, config.cell_width / 2);
    wall_4.position.set(config.cell_length, config.cell_height, config.cell_width / 2);


    palet_v.position.set(config.cell_length, config.cell_height, 0)

    floor_1.rotateX(90 * Math.PI / 180);
    floor_1.rotateZ(90 * Math.PI / 180);
    floor_1.position.set(config.cell_length / 2, config.cell_height, config.cell_width / 2);


    wall_3.rotateY(90 * Math.PI / 180);
    wall_4.rotateY(90 * Math.PI / 180);

    topbar_1.position.set(config.cell_length / 2, config.cell_height - topbar_height / 2, 2.5);

    //  GIFT

    let gift1 = gift.clone();
    gift1.position.set(config.cell_length - 30, 26.5, config.cell_length - 13);
    store1.add(gift1)

    let gift2 = gift.clone();
    gift2.position.set(config.cell_length - 100, 26.5, config.cell_length - 13);
    store1.add(gift2)

    // KOKORO

    let kokoro1 = kokoro.clone();
    kokoro1.rotateY(90 * Math.PI / 180);
    kokoro1.position.set(20,0,100);
    store1.add(kokoro1)

    let gift4 = gift.clone();
    gift4.position.set(20, 18, 95);
    store1.add(gift4)

    let kokoror1 = kokoro_roof.clone();
    kokoror1.position.set(100,config.cell_height - 5,100);
    store1.add(kokoror1)

    // POLKA

    let polka_g = new THREE.BoxGeometry(config.cell_length - 40, 1.5, 20);
    let polka_g2 = new THREE.BoxGeometry(config.cell_length - 40, 1.5, 12);
    let polka = new THREE.Mesh(polka_g, add_wall_material)
    polka.position.set(config.cell_length / 2 + 20 - 1, 20, config.cell_length - 10)
    store1.add(polka)

    let polka2 = polka.clone();
    polka2.rotateY(90 * Math.PI / 180)
    polka2.position.set(config.cell_length - 10 - 1, 20, config.cell_length / 2)
    store1.add(polka2)

    let polka3 = new THREE.Mesh(polka_g2, add_wall_material)
    polka3.position.set(config.cell_length / 2 + 20 - 1, 40, config.cell_length - 6)
    store1.add(polka3)

    let polka4 = polka3.clone();
    polka4.rotateY(90 * Math.PI / 180)
    polka4.position.set(config.cell_length - 6 - 1, 40, config.cell_length / 2 + 10)
    store1.add(polka4)

    // TYMBO4KA

    st1 = st.clone();
    mt1 = mt.clone();

    st1.position.set(95,-1,80)
    mt1.position.set(80,-1,95)

    let gift3 = gift.clone();
    gift3.position.set(80, 25, 95);
    store1.add(gift3)

    let palet_h2 = palet_h_m.clone();
    palet_h2.position.set(config.cell_length / 2, config.cell_height * 2, 0)
    store.add(palet_h2)

    let palet_h1 = palet_h_m.clone();
    palet_h1.position.set(config.cell_length / 2, config.cell_height, 0)
    store.add(palet_h1)

    let rf = rf_m.clone()
    rf.rotateX(90 * Math.PI / 180);
    rf.position.set(config.cell_length / 2, config.cell_height * 2, config.cell_length / 2)


    group.add(palet_h2)
    group.add(palet_h1)
    group.add(rf)

    colable_group.add(glass_1);
    colable_group.add(glass_2);
    colable_group.add(wall_2);
    colable_group.add(wall_3);
    colable_group.add(wall_4);

    colable_group.add(st1);
    colable_group.add(mt1);

    group.add(palet_v);

    group.add(big_glass);

    group.add(topbar_1);

    group.add(floor_1);

    group.position.set(-config.cell_length / 2, 0, -config.cell_length / 2)
    colable_group.position.set(-config.cell_length / 2, 0, -config.cell_length / 2)

    colable_group.userData = { colable: true }

    store.add(colable_group)
    store.add(group)

    // END

    // ESCOLATOR

    let plane_g = new THREE.PlaneGeometry(190, Math.sqrt(config.cell_length * config.cell_length + config.cell_height * config.cell_height));

    // END

    // CORNER

    let corner = new THREE.Object3D();

    let s_top = new THREE.Shape();
    s_top.moveTo(0,config.cell_length + 2);
    s_top.lineTo(config.cell_length * 2 / 4, config.cell_length + 2);
    s_top.lineTo(config.cell_length + 2, config.cell_length * 2 / 4);
    s_top.lineTo(config.cell_length + 2, 0);

    var extrudeSettings = { amount: 7, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };

    var geo3 = new THREE.ExtrudeGeometry( s_top, extrudeSettings );
    var s_top_m = new THREE.Mesh(geo3, wall_material);

    s_top_m.position.set(-config.cell_length + 1, config.cell_height * 2 + 2, config.cell_length * 1 / 4 - 1)

    s_top_m.rotateZ(270 * Math.PI / 180);
    s_top_m.rotateY(90 * Math.PI / 180);



    let s_glass = new THREE.Shape();
    s_glass.moveTo(0,config.cell_length);
    s_glass.lineTo(config.cell_length * 2 / 4, config.cell_length);
    s_glass.lineTo(config.cell_length, config.cell_length * 2 / 4);
    s_glass.lineTo(config.cell_length, 0);

    var extrudeSettings = { amount: config.cell_height, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };

    var geo2 = new THREE.ExtrudeGeometry( s_glass, extrudeSettings );
    var s_glass_m = new THREE.Mesh(geo2, glass_material);

    s_glass_m.position.set(-config.cell_length - 4, config.cell_height * 2, config.cell_length * 1 / 4 + 4)


    s_glass_m.rotateZ(270 * Math.PI / 180);
    s_glass_m.rotateY(90 * Math.PI / 180);

    let s_roof = new THREE.Shape();
    s_roof.moveTo(0,0);
    s_roof.lineTo(0,config.cell_length + 2);
    s_roof.lineTo(config.cell_length * 2 / 4, config.cell_length + 2);
    s_roof.lineTo(config.cell_length + 2, config.cell_length * 2 / 4);
    s_roof.lineTo(config.cell_length + 2, 0);
    s_roof.lineTo(0,0);


    var extrudeSettings2 = { amount: 7, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };

    var geo = new THREE.ExtrudeGeometry( s_roof, extrudeSettings2 );
    var s_roof_m = new THREE.Mesh(geo, wall_material);
    s_roof_m.rotateZ(270 * Math.PI / 180);
    s_roof_m.rotateY(90 * Math.PI / 180);

    s_roof_m.position.set(-config.cell_length + 1, config.cell_height + 4, config.cell_length * 1 / 4 - 1)


    let short_wall_group =  new THREE.Object3D();
    let col_group =  new THREE.Object3D();

    let short_wall = new THREE.PlaneGeometry(config.cell_length / 2, config.cell_height);
    let sw = new THREE.Mesh(short_wall, wall_material)
    let sw2 = sw.clone();
    sw.rotateY(90 * Math.PI / 180);
    sw.position.set(0,config.cell_height / 2,0)
    col_group.add(sw)
    short_wall_group.position.set(2 * config.cell_length, 0, config.cell_length / 2 + config.cell_length / 4);

    sw2.position.set(-config.cell_length * 3 / 4,config.cell_height / 2,-config.cell_length * 3 / 4)
    col_group.add(sw2)

    short_wall_group.add(s_roof_m)
    short_wall_group.add(s_glass_m)
    short_wall_group.add(s_top_m)

    let palet_v1 = palet_v_m.clone();
    palet_v1.position.set(0, config.cell_height, -1 / 4 * config.cell_length)

    let palet_v2 = palet_v_m.clone();
    palet_v2.position.set(- 2 / 4 * config.cell_length, config.cell_height, - 3 / 4 * config.cell_length)

    short_wall_group.add(palet_v1)
    short_wall_group.add(palet_v2)

    let rff = rf_m.clone()
    rff.rotateX(90 * Math.PI / 180);
    rff.position.set(-config.cell_length / 2, config.cell_height * 2, -config.cell_length / 4)

    short_wall_group.add(rff)

    short_wall_group.position.set(config.cell_width / 2,0,config.cell_width / 4)
    col_group.position.set(config.cell_width / 2,0,config.cell_width / 4)
    col_group.userData = { colable: true }


    corner.add(col_group)
    corner.add(short_wall_group);


    // ROOF


    // PLATE


    proof = new THREE.Mesh(new THREE.PlaneGeometry(config.cell_length, config.cell_length), roof_material)
    proof.position.set(-0.5 * config.cell_length, 180, -config.cell_width / 2)
    proof.rotateX(90 * Math.PI / 180);

    function addToCol(group){
      if(group.userData.colable){
        for(let k = 0; k < group.children.length; k++){
          collidableMeshList.push(group.children[k]);
        }
      }else{
        for(let k = 0; k < group.children.length; k++){
          if(group.children[k].children && group.children[k].children.length > 0){
            addToCol(group.children[k]);
          }
        }
      }
    }


    let map = [
      [' ','□','□','□','□','□','□','□','□','□','□',' '],
      ['□','.','.','.','.','.','.','.','.','.','.','□'],
      ['□','.','■','□','■','.','.','■','□','■','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','□','.','□','.','.','□','.','□','.','□'],
      ['□','.','■','□','■','.','.','■','.','■','.','□'],
      ['□','.','.','.','.','.','.','△','□','.','.','□'],
      [' ','□','□','□','□','□','□','□','□','□','□',' '],
    ];

    let map2 = [
       [' ','□','□','□','□','□','□','□','□','□','□',' '],
       ['□',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','□'],
       ['□',' ','■','□','■',' ',' ','■','□','■',' ','□'],
       ['□',' ','□','▥','▥','▩','▩','▥','▥','□',' ','□'],
       ['□',' ','□','▥','□',' ',' ','□','▥','□',' ','□'],
       ['□',' ','□','▥','□',' ',' ','□','▥','□',' ','□'],
       ['□',' ','□','▥','□',' ',' ','□','▥','□',' ','□'],
       ['□',' ','□','▥','□',' ',' ','□','▥','□',' ','□'],
       ['□',' ','□','▥','▥','▧','▧','▥','▥','□',' ','□'],
       ['□',' ','■','□','■',' ',' ','■','▥','■',' ','□'],
       ['□',' ',' ',' ',' ',' ',' ','▲','▥',' ',' ','□'],
       [' ','□','□','□','□','□','□','□','□','□','□',' ']
    ];

    for(let i = 0; i < map.length; i++){
      for(let j = 0; j < map[i].length; j++){

        if(map[i][j] == '▲'){
        }

        if(map[i][j] == '□'){
          temp_store = store.clone();
          let dir = 0;

          let dop = [[0,-1],[1,0],[0,1],[-1,0]];

          for(let k1 = 0; k1 < dop.length; k1++){
            if(i + dop[k1][0] >= 0 && i + dop[k1][0] < map.length && j + dop[k1][1] >= 0 && j + dop[k1][1] < map.length){
              if(map[i + dop[k1][0]][j + dop[k1][1]] == '.'){
                if(k1 == 0) dir = 0;
                if(k1 == 1) dir = 270;
                if(k1 == 2) dir = 180;
                if(k1 == 3) dir = 90;
              }
            }
          }
          temp_store.rotateY(dir * Math.PI / 180);
          temp_store.position.set(i * config.cell_width, 0, j * config.cell_width);
          scene.add(temp_store)

          addToCol(temp_store);
        }

        if(map[i][j] == '■'){
          temp_store = corner.clone();
          let dir = 0;

          let dop = [[0,-1],[1,0],[0,1],[-1,0]];
          let ns = [];

          for(let k1 = 0; k1 < dop.length; k1++){
            if(i + dop[k1][0] >= 0 && i + dop[k1][0] < map.length && j + dop[k1][1] >= 0 && j + dop[k1][1] < map.length){
              if(map[i + dop[k1][0]][j + dop[k1][1]] == 0){
                ns.push(k1);
              }
            }
          }

          if(ns[0] == 0 && ns[1] == 1) dir = 0;
          if(ns[0] == 0 && ns[1] == 3) dir = 90;
          if(ns[0] == 1 && ns[1] == 2) dir = 270;
          if(ns[0] == 2 && ns[1] == 3) dir = 180;

          temp_store.rotateY(dir * Math.PI / 180);
          temp_store.position.set(i * config.cell_width, 0, j * config.cell_width);
          scene.add(temp_store)
          addToCol(temp_store);
        }

        if(map[i][j] == '.'){
          if((i + j) % 2 == 0){
            temp_store = roof.clone();
            temp_store.position.set(i * config.cell_width, config.cell_height * 2, j * config.cell_width);
            scene.add(temp_store)
          }else{
            temp_store = proof.clone();
            temp_store.position.set(i * config.cell_width, config.cell_height * 2, j * config.cell_width);
            scene.add(temp_store)
          }
        }

      }
    }
  }
}
