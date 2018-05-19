// This class contains all stores setups, here we define stores, store carcass,
// place furniture for different stores and choose colors for them.

//Every method has three groups:
// collision - all meshes with which player can collide
// simple - all meshes with which we dont calculate collisions
// meshes - common group for both previous groups, add only groups here(not meshes)

class StoresManager{
  constructor(meshes, textures){
    this.meshes = meshes;
    this.textures = textures;
    this.length = 190;
    this.width = 5;
    this.padding = 5;
    this.height = 100;
    this.top_front_part_height = 25;

    // INITIALIZE GROUPS

    this.store_color = '#efe9c9';

    // Meshes to render, that has not any collision
    this.simple_meshes = new THREE.Object3D();
    this.simple_meshes.userData = {type: 'simple'};

    // Meshes to render, that has collides with player
    this.collision_meshes = new THREE.Object3D();
    this.collision_meshes.userData = {type: 'collision'};

    // Meshes that dont render, use it to add borders on the map
    this.border_meshes = new THREE.Object3D();
    this.border_meshes.userData = {type: 'border'};

    //Meshes that dont render, use it to make slide surfaces
    this.slide_meshes = new THREE.Object3D();
    this.slide_meshes.userData = {type: 'slide'};
  }

  // MALL PARTS

  escalator(){
    let simple_meshes = this.simple_meshes.clone(),
        border_meshes = this.border_meshes.clone(),
        slide_meshes = this.slide_meshes.clone();

    // ESCALATORS

    let escalator_up = this.meshes.escalator(0);
    escalator_up.position.set(35, 0, 0);

    let escalator_down = this.meshes.escalator(1);
    escalator_down.position.set(-35, 0, 0);

    //action.move[0].play();
    //action.move[1].play();

    // SETUP BORDERS

    let m = this.meshes.generateMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.5});
    let m_up = this.meshes.generateMaterial({ color: 'red', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    let m_down = this.meshes.generateMaterial({ color: 'green', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

    let g = new THREE.PlaneGeometry(30, this.height * 2);
    let front_border = new THREE.Mesh(g, m);
    let front_border_2 = front_border.clone();
    let front_border_3 = front_border.clone();
    let front_border_4 = front_border.clone();
    let front_border_5 = front_border.clone();
    let front_border_6 = front_border.clone();

    front_border.position.set(0, this.height, this.length / 2 - 50);
    front_border_2.position.set(-65, this.height, this.length / 2 - 50);
    front_border_3.position.set(65, this.height, this.length / 2 - 50);
    front_border_4.position.set(0, this.height, - 110);
    front_border_5.position.set(-65, this.height, - 110);
    front_border_6.position.set(65, this.height, - 110);

    let g2 = new THREE.PlaneGeometry(this.length, this.height * 2);
    let side_border = new THREE.Mesh(g2, m);
    side_border.rotateY(90 * Math.PI / 180);
    let side_border_2 = side_border.clone();
    let side_border_3 = side_border.clone();
    let side_border_4 = side_border.clone();

    let pad = -50;

    side_border.position.set(15, this.height, pad);
    side_border_2.position.set(55, this.height, pad);
    side_border_3.position.set(-15, this.height, pad);
    side_border_4.position.set(-55, this.height, pad);


    let gup = new THREE.PlaneGeometry(50, this.length - 10);
    let up = new THREE.Mesh(gup, m_up);
    up.rotateX(-44 * Math.PI / 180);
    up.position.set(35, this.height / 2, -25);
    up.userData = { esc: 1 };

    let gdown = new THREE.PlaneGeometry(50, this.length - 10);
    let down = new THREE.Mesh(gdown, m_down);
    down.rotateX(-44 * Math.PI / 180);
    down.position.set(-35, this.height / 2, -25);
    down.userData = { esc: -1 };

    //

    simple_meshes.add(up);
    simple_meshes.add(down);

    let upp = up.clone();
    let downn = down.clone();

    slide_meshes.add(upp);
    slide_meshes.add(downn);

    // ADD TO BORDERS GROUP

    border_meshes.add(front_border);
    border_meshes.add(front_border_2);
    border_meshes.add(front_border_3);
    border_meshes.add(front_border_4);
    border_meshes.add(front_border_5);
    border_meshes.add(front_border_6);

    border_meshes.add(side_border);
    border_meshes.add(side_border_2);
    border_meshes.add(side_border_3);
    border_meshes.add(side_border_4);

    // ADD TO NON COLABLE GROUP

    simple_meshes.add(escalator_up);
    simple_meshes.add(escalator_down);

    return [border_meshes, slide_meshes, simple_meshes];
  }

  // ELEMENTS

  secondFloor(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let geometry = new THREE.PlaneGeometry(this.length, this.length);

    let material = this.meshes.generateMaterial({ color: this.store_color });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(270 * Math.PI / 180);
    mesh.position.set(0,0,0);
    simple_meshes.add(mesh);

    return [simple_meshes];
  }

  // STORE CARCAS

  storeEscalator(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_escalator', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeBridge(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_bridge', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeHalfSolid(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_half_solid', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeSolid(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_solid', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeBridgeTurn(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_bridge_turn', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeBridgeTriple(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('store_bridge_triple', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  halfStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color })
    ];

    let store = this.meshes.getStore('store_half', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  tonnelStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color })
    ];

    let store = this.meshes.getStore('store_tonnel', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  store(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.materials.dark_glass,
      this.meshes.generateMaterial({ color: this.store_color })
    ];

    let store = this.meshes.store(materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeSecond(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color })
    ];

    let store = this.meshes.getStore('store_second', materials);
    store.position.set(0,0,0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  storeCorner(colors){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: this.store_color }),
      this.meshes.materials.dark_glass
    ];

    let store = this.meshes.getStore('store_corner', materials);
    store.position.set(0, 0, 0);

    simple_meshes.add(store);

    return [simple_meshes];
  }

  // STORES

  juiceStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: '#daf8d6' }), // walls
      this.meshes.generateMaterial({ color: '#799380' }), // roof
      this.meshes.generateMaterial({ color: '#f2c095' }), // forward
      this.meshes.generateMaterial({ color: '#fdf1e8' }), // dark
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('juice_store', materials);
    store.position.set(0, 0, 0);

    simple_meshes.add(store);

    let collision = this.meshes.getStore('corner_collision', [materials[0]]);
    store.position.set(0, 0, 0);
    collision_meshes.add(collision);

    return [simple_meshes, collision_meshes];
  }

  icecreamStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: '#daf8d6' }), // walls
      this.meshes.generateMaterial({ color: '#799380' }), // roof
      this.meshes.generateMaterial({ color: '#f2c095' }), // forward
      this.meshes.generateMaterial({ color: '#fdf1e8' }), // dark
      this.meshes.materials.glass,
      this.meshes.generateMaterial({ map: this.textures.icecream_texture }) // dark
    ];

    let store = this.meshes.getStore('icecream_store', materials);
    store.position.set(0, 0, 0);

    simple_meshes.add(store);

    let collision = this.meshes.getStore('corner_collision', [materials[0]]);
    store.position.set(0, 0, 0);
    collision_meshes.add(collision);

    return [simple_meshes, collision_meshes];
  }

  //

  lingerieStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(231, 214, 234)' }), // walls
      this.meshes.generateMaterial({ color: 'rgb(223, 185, 199)' }), // left right side
      this.meshes.generateMaterial({ color: 'rgb(169, 93, 111)' }), // forward
      this.meshes.generateMaterial({ color: 'rgb(71, 22, 61)' }), // dark
      this.meshes.generateMaterial({ color: 'rgb(255, 255, 255)' }), // floor
      this.meshes.generateMaterial({ color: 'rgb(234, 217, 218)' }) // roof
    ];

    let store = this.meshes.getStore('lingerie_store', materials);
    store.position.set(0, 0, 0);

    //pos_mesh = this.meshes.item(this.textures.stores.lingerie.items.h[0]);
    //pos_mesh.position.set(0, 40, 0);
    //pos_mesh.scale.set(15, 30);
    //scene.add(pos_mesh)

    simple_meshes.add(store);

    return [simple_meshes];
  }

  ladiesStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(237, 241, 243)' }), // wall, table
      this.meshes.generateMaterial({ color: 'rgb(255, 248, 191)' }), // floor, roof
      this.meshes.generateMaterial({ color: 'rgb(47, 46, 45)' }) // decor
    ];

    let store = this.meshes.getStore('ladies_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  shoesStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(207, 191, 161)' }),
      this.meshes.generateMaterial({ color: 'rgb(245, 229, 214)' }),
      this.meshes.generateMaterial({ color: 'rgb(255, 250, 219)' }),
      this.meshes.generateMaterial({ map: this.textures.shoes_store_texture })
    ];

    let store = this.meshes.getStore('shoes_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  jewelleryStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(166, 205, 199)' }), // walls
      this.meshes.generateMaterial({ color: 'rgb(199, 201, 167)' }), // floor
      this.meshes.generateMaterial({ color: 'rgb(208, 197, 162)' }), // shelfs
      this.meshes.materials.glass
    ];

    let store = this.meshes.getStore('jewellery_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  mensStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(62, 62, 62)' }), // decor
      this.meshes.generateMaterial({ color: 'rgb(249, 237, 218)' }), // top
      this.meshes.generateMaterial({ color: 'rgb(217, 208, 194)' }), // walls
      this.meshes.generateMaterial({ color: 'rgb(160, 142, 114)' }) // floor
    ];

    let store = this.meshes.getStore('mens_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  cosmeticStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(255, 248, 197)' }), // furniture
      this.meshes.generateMaterial({ color: 'rgb(185, 226, 226)' }), // side furniture
      this.meshes.materials.glass,
      this.meshes.generateMaterial({ color: 'rgb(255, 231, 248)' }), // walls
      this.meshes.generateMaterial({ color: 'rgb(237, 221, 202)' }), // floor
      this.meshes.generateMaterial({ color: 'rgb(255, 251, 254)' }) // roof
    ];

    let store = this.meshes.getStore('cosmetic_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    return [simple_meshes];
  }

  bagsStore(){
    let simple_meshes = this.simple_meshes.clone(),
        collision_meshes = this.collision_meshes.clone();

    let materials = [
      this.meshes.generateMaterial({ color: 'rgb(120, 60, 15)' }), // plintus
      this.meshes.generateMaterial({ color: 'rgb(255, 239, 172)' }), // wall
      this.meshes.generateMaterial({ color: 'rgb(255, 252, 210)' }), // light parts
      this.meshes.generateMaterial({ color: 'rgb(222, 140, 49)' }), // floor
    ];

    let store = this.meshes.getStore('bags_store', materials);
    store.position.set(0, 0, 0);
    simple_meshes.add(store);

    let collision = this.meshes.getStore('bags_collision', [materials[0]]);
    collision.position.set(0,0,0);
    collision_meshes.add(collision);

    return [simple_meshes, collision_meshes];
  }
}
