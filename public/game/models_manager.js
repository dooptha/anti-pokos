class ModelsManager{

  constructor(meshes, ready){
    this.ready = ready;
    this.meshes = meshes;
    this.loaded_models = 0;
    this.loader = new THREE.JSONLoader();
    this.models = [
      // GENERAL

      'roof_circle',
      'sign',
      'escalator',

      // playersl;

      'player',
      'police',
      'player_collision',

      // DECOR

      'store',
      'store_corner',
      'store_second',
      'store_half',
      'store_bridge',
      'store_bridge_turn',
      'store_bridge_triple',
      'store_solid',
      'store_escalator',
      'store_tonnel',
      'store_half_solid',

      // STORES

      'juice_store',
      'icecream_store',

      // COLLISION

      'bags_collision',
      'corner_collision',

      // STORES

      'shoes_store',
      'cosmetic_store',
      'ladies_store',
      'lingerie_store',
      'bags_store',
      'jewellery_store',
      'mens_store',
    ];
  }

  uploadModels(){
    this.models.map(name => {
      this.loader.load('/game/models/' + name + '.json',
        (g, m) => this.onLoad(g, m, name),
        (xhr) => this.onProgress(xhr, name),
        (ex) => this.onError(ex)
      );
    });
  }

  onLoad(g, m, name){
    this.meshes.createFromJson(g, m, name);
    this.loaded_models++;
    if(this.loaded_models == this.models.length) this.ready('models');
  }

  onError(ex, name){
    console.error('Error while loading ', name);
    console.log(ex);
  }

  onProgress(xhr){
    //none
  }
}
