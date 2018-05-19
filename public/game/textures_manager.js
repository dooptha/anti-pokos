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

  uploadSellers(files){
    for(let i = 0; i < files.length; i++){
      this.loadTexture('sellers/' + files[i] + '.png').then(texture => {
        this.sellers[files[i]] = texture;
        if(this.loaded_textures == this.textures) this.finishLoading('textures');
      })
    }
  }

  uploadGroup(name, files){

    this.stores[name] = {};
    this.stores[name].sets = [];
    this.stores[name].items = {};
    this.stores[name].gifts = [];

    for(let i = 0; i < files.length; i++){
      // PARSE FILE NAME FOR PARAMS

      let params = (files[i][1] == ':' || files[i][3] == ':') ? files[i].split(':') : files[i].split('_');
      params[params.length - 1] = params[params.length - 1].split('.')[0];

      // INIT STORE SET

      if(params[0] == 'gif'){

        let sub = params[1];

        if(!this.stores[name].gifts[sub]){
          this.stores[name].gifts[sub] = [];
        }

        this.loadTexture('game/items/' + name + '/' + files[i]).then(texture => {

          this.stores[name].gifts[sub].push(texture);
          if(this.loaded_textures == this.textures) this.finishLoading('textures');
        })
      }else if(params[0] == 'set'){
        let set = params[1] - 1, sub = params[2], type = params[3];

        if(!this.stores[name].sets[set]) this.stores[name].sets[set] = {item: null, gifts: []};

        if(type == 'i'){
          this.loadTexture('game/items/' + name + '/' + files[i]).then(texture => {
            this.stores[name].sets[set].item = texture;
            this.stores[name].sets[set].item.userData = { type: sub };
            if(this.loaded_textures == this.textures) this.finishLoading('textures');
          })
        }else{
          this.loadTexture('game/items/' + name + '/' + files[i]).then(texture => {
            this.stores[name].sets[set].gifts.push(texture);
            this.stores[name].sets[set].gifts[this.stores[name].sets[set].gifts.length - 1].userData = { type: sub };
            if(this.loaded_textures == this.textures) this.finishLoading('textures');
          })
        }
      }else{
        let sub = params[0], num = params[1];

        if(!this.stores[name].items[sub]){
          this.stores[name].items[sub] = [];
        }

        this.loadTexture('/game/items/' + name + '/' + files[i]).then(texture => {

          this.stores[name].items[sub].push(texture);
          if(this.loaded_textures == this.textures) this.finishLoading('textures');
        })
      }
    }
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
