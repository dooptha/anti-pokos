// In this class we define all our meshes and store uploaded blender models

// Ther are two types of geometries: raw and normal, normal - is imported geometry
// from three.js exported, not optimized, normal - optimized

class MeshesManager{
  constructor(){

    this.store_color = '#efe9c9';

    this.count = 0;

    this.default_material = {
      wireframe: false,
      side: THREE.FrontSide,
      vertexColors: THREE.VertexColors,
      transparent: false
    }

    this.materials = {
      circle_roof_main: this.generateMaterial({color: this.store_color, side: THREE.DoubleSide}),
      circle_roof_sec: this.generateMaterial({color: 'rgb(150,150,150)', side: THREE.DoubleSide}),
      mall_wall_prm: this.generateMaterial({color: this.store_color }),
      mall_wall_sec: this.generateMaterial({color: 'rgb(225,225,225)'}),
      glass: this.generateMaterial({color: '#3d8e9c', depthWrite: false, side: THREE.DoubleSide, transparent: true, opacity: 0.3}),
      dark_glass: this.generateMaterial({color: '#32727d', side: THREE.DoubleSide, transparent: true, opacity: 0.55})
    };

    this.length = 190;

    this.models = {};
    this.meshes = {};
  }

  generateMaterialNoShadow(params){
    let mat_params = Object.assign({}, this.default_material, params)
    return new THREE.MeshBasicMaterial(mat_params);
  }

  generateMaterial(params){
    let mat_params = Object.assign({}, this.default_material, params)
    return new THREE.MeshPhongMaterial(mat_params);
  }

  createThreeJsGeometries(){
    this.meshes.top_front_store_g = this.topFrontPartG();
    this.meshes.back_wall_g = this.backWall();
    this.vertical_pilaster_g = this.verticalPilasterG();
    this.horizontal_pilaster_g = this.horizontalPilasterG();
  }

  createFromJson(geometry, material, name){
    // SET RAW MESHES TO ARRAY
    this.models[name] = {geometry, material}
  }

  mallFloor(){
    let g = new THREE.PlaneGeometry(this.length * 30, this.length * 30);
    let mesh = new THREE.Mesh(g, this.materials.mall_wall_prm);
    mesh.rotateX(270 * Math.PI / 180);
    return mesh;}

  mallRoof(){
    let g = new THREE.PlaneGeometry(this.length, this.length);
    let mesh = new THREE.Mesh(g, this.materials.mall_wall_prm);
    mesh.rotateX(90 * Math.PI / 180);
    return mesh;}

  circleRoof(){
    let m = [
      this.materials.circle_roof_main,
      this.materials.circle_roof_sec
    ];

    let mesh = new THREE.Mesh(this.models.roof_circle.geometry, m);

    let scale = this.length / new THREE.Box3().setFromObject(mesh).getSize().x;
    mesh.scale.set(scale, scale, scale);

    return mesh;}

  getEnemy(name, materials){
    let mesh = new THREE.SkinnedMesh(this.models[name].geometry, materials);

    mesh.scale.set(3.5, 3.5, 3.5);
    mesh.rotateY(180  * Math.PI / 180);

    return mesh;
  }

  getPlayer(name, materials){
    let mesh;

    if(name == 'player' || name == 'escalator'){

      materials.forEach(function (material) {
        material.skinning = true;
      });

      mesh = new THREE.SkinnedMesh(this.models[name].geometry, materials);

      mesh.scale.set(10, 10, 10);
      mesh.rotateY(180  * Math.PI / 180);

      console.log('ok')
      console.log(this.models.player.geometry)

      mixers.push(new THREE.AnimationMixer(mesh));
      action.stay = mixers[0].clipAction(this.models[name].geometry.animations[1]);
      action.stay.setLoop(THREE.LoopRepeat);
    }else{

      mesh = new THREE.SkinnedMesh(this.models[name].geometry, materials);

      mesh.scale.set(10, 10, 10);
      mesh.rotateY(180  * Math.PI / 180);
    }

    return mesh;}

  store(materials){
    let mesh = this.parseGeometry(this.models.store.geometry, materials);

    mesh.scale.set(23.7, 23.2, 23.7);
    mesh.rotateY(180  * Math.PI / 180);

    return mesh;}

  parseGeometry(raw_geometry, materials){
    // WRAPPER FOR GEOMETRIES
    let main_geometry = new THREE.Object3D();

    for(let material = 0; material < materials.length; material++){
      let geometry = new THREE.Geometry(), uvs = false;

      // FOR TEXTURES

      if(raw_geometry.faceVertexUvs.length > 0 && raw_geometry.faceVertexUvs[0].length > 0){
        geometry.faceVertexUvs = [];
        geometry.faceVertexUvs.push([]);
        uvs = true;
      }

      for(let vertice = 0; vertice < raw_geometry.vertices.length; vertice++){
        geometry.vertices.push(raw_geometry.vertices[vertice]);
      }

      // ADD ONLY THOSE FACES THAT USE ONLY CURRENT MATERIAL

      for(let face = 0; face < raw_geometry.faces.length; face++){
        if(raw_geometry.faces[face].materialIndex == material){
          geometry.faces.push(raw_geometry.faces[face]);
          if(uvs){
            geometry.faceVertexUvs[0].push(raw_geometry.faceVertexUvs[0][face]);
          }
        }
      }

      main_geometry.add(new THREE.Mesh(geometry, materials[material]));
    }

    return main_geometry;
  }

  parseBufferGeometry(raw_geometry, materials){
    // WRAPPER FOR GEOMETRIES
    let main_geometry = new THREE.Object3D();

    let geometry = new THREE.Geometry(), uvs = false;

    // FOR TEXTURES

    if(raw_geometry.faceVertexUvs.length > 0 && raw_geometry.faceVertexUvs[0].length > 0){
      geometry.faceVertexUvs = [];
      geometry.faceVertexUvs.push([]);
      uvs = true;
    }

    for(let vertice = 0; vertice < raw_geometry.vertices.length; vertice++){
      geometry.vertices.push(raw_geometry.vertices[vertice]);
    }

    // ADD ONLY THOSE FACES THAT USE ONLY CURRENT MATERIAL

    for(let face = 0; face < raw_geometry.faces.length; face++){
      if(raw_geometry.faces[face].materialIndex == 1){
        geometry.faces.push(raw_geometry.faces[face]);
        if(uvs){
          geometry.faceVertexUvs[0].push(raw_geometry.faceVertexUvs[0][face]);
        }
      }
    }

    return geometry;
  }

  getGeometry(name){
    let geometry = this.parseBufferGeometry(this.models[name].geometry, 2);
    geometry.scale(23.7, 23.2, 23.7);
    geometry.rotateY(180  * Math.PI / 180);

    return geometry;
  }

  getStore(name, materials){
    // Generate store(furniture, walls, not items)

    // this method generate simple meshe

    //let mesh = new THREE.Mesh(this.models.shoes_store.geometry, materials)

    // PERFORMANCE: this method parse geometries and generates separate geometry for each material

    let mesh = this.parseGeometry(this.models[name].geometry, materials);

    // Set scale, in blender stores have size: 8 x 8 x 4.3 grid squares, in game 190 x 190 x 110

    mesh.scale.set(23.7, 23.2, 23.7);
    mesh.rotateY(180  * Math.PI / 180);

    return mesh;}

  // SPRITES

  item(texture){

    let m = new THREE.SpriteMaterial({ map: texture });
    let mesh = new THREE.Sprite(m);
    mesh.scale.set(10, 10);
    return mesh;}


  escalator(clip, g = this.models.escalator.geometry){
    let m = [
      this.generateMaterial({ color: 'rgb(240, 240, 240)' }),
      this.generateMaterial({ color: 'rgb(230, 230, 230)' }),
      this.generateMaterial({ color: 'white' }),
      this.generateMaterial({ color: 'rgb(60, 60, 60)' }),
    ];

    // m.forEach((me) => {
    //   me.skinning = true;
    // })

    let mesh = this.parseGeometry(this.models.escalator.geometry, m);
    //let mesh = new THREE.SkinnedMesh(g, m);
    mesh.scale.set(2.5,2.8,3);
    //mixers.push(new THREE.AnimationMixer(mesh));
    //action.move.push(mixers[clip].clipAction(g.animations[clip]));
    //action.move[clip].setLoop(THREE.LoopRepeat);

    return mesh;
  }
}
