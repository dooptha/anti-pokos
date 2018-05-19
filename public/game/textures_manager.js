class TexturesManager{

  constructor(ready){
    this.ready = ready;
    this.loaded_textures = 0;
    this.textures = 2;
    this.loader = new THREE.TextureLoader();

    this.stores = {};
    this.sellers = {};
  }

  finishLoading(){
    console.log('Textures: ' + this.loaded_textures);
    this.ready('textures');
  }

  uploadTextures(){
    //this.uploadGroup('shoes', 14, 5, 2);

    this.loadTexture('game/items/texture.png').then((t) => {
      this.shoes_store_texture = t;
      if(this.loaded_textures == this.textures) this.finishLoading('textures');
    })

    this.loadTexture('game/items/icecream.png').then((t) => {
      this.icecream_texture = t;
      if(this.loaded_textures == this.textures) this.finishLoading('textures');
    })
  }

  loadTexture(path){
    return new Promise ((resolve, reject) => {
      this.loader.load('/' + path,
        (texture) => {
          texture.needsUpdate = false;
          texture.minFilter = THREE.NearestFilter;
          this.loaded_textures++;
          console.log(this.loaded_textures, this.textures)
          resolve(texture);
        },
        (xhr) => this.onProgress(xhr, name),
        (ex) => this.onError(ex)
      );
    })
  }

  onError(ex, name){
    console.error('Error while loading ', name);
    console.log(ex);
  }

  onProgress(xhr){
    console.log(xhr)
  }
}
