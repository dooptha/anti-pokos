let shoes = this.stores_builder.shoesStore(colors);
for(let i = 0; i < shoes.length; i++){
  shoes[i].position.set(0 * this.length, 0, 0 * this.length);
  shoes[i].rotateY(0 * Math.PI / 180);
  this.mergeWithWorld(shoes[i]);
}

let points = [
  {x: 78, y: 29, z: -54},
  {x: 78, y: 29, z: -17},
  {x: 78, y: 29, z: 45},
  {x: 78, y: 49, z: -29},
  {x: 78, y: 49, z: 33},
  {x: 45, y: 49, z: 80},
  {x: 11, y: 49, z: 80},
  {x: -55, y: 49, z: 80},
  {x: -36, y: 29, z: 80},
  {x: -10, y: 29, z: 80},
  {x: 41, y: 29, z: 80},
  {x: -14, y: 26, z: 15},
  {x: -1, y: 26, z: -1},
  {x: -62, y: 19, z: -35}
];

for(let i = 0; i < points.length; i++){
  let m = new THREE.SpriteMaterial({ map: this.textures_manager.stores.shoes.simple[i] });
  test_mesh = new THREE.Sprite(m);
  test_mesh.scale.set(15, 15);
  test_mesh.position.set(points[i].x, points[i].y, points[i].z);
  scene.add(test_mesh);
}
