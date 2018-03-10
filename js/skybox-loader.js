class SkyboxTexture{

	constructor(id, images){

		//We retrive the images source of the box
		this.images = images;
		//We define an array to store the loaded textures
		this.imagesLoaded = [];


		//We init each target for the CUBE_MAP, each enum defines a side of the cube
		this.targets = [
					   glContext.TEXTURE_CUBE_MAP_POSITIVE_X, glContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
					   glContext.TEXTURE_CUBE_MAP_POSITIVE_Y, glContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
					   glContext.TEXTURE_CUBE_MAP_POSITIVE_Z, glContext.TEXTURE_CUBE_MAP_NEGATIVE_Z
					];
		//texID is used to keep the reference to the loaded TEXTURE_CUBE_MAP
		this.texID;

		//util variable to wait until each texture is loaded
		this.cntLoad = 0;

		this.loaded = false;

		this.initTextureCube();


	}

	//Texture cube creation after the loading of each side
	textureLoading(){
		this.cntLoad++;
		//When all the sides are loaded
		if(this.cntLoad == 6){
			//We create the texture
			this.texID = glContext.createTexture();
			//We bind it as a TEXTURE_CUBE_MAP
			glContext.bindTexture(glContext.TEXTURE_CUBE_MAP, this.texID);
			for(var i = 0;i<6;i++)
			{

				//We set the texture for each target
				glContext.texImage2D(this.targets[i], 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, this.imagesLoaded[i]);
				//And define how it should be stretched
				glContext.texParameteri(glContext.TEXTURE_CUBE_MAP, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
				glContext.texParameteri(glContext.TEXTURE_CUBE_MAP, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
			}
			glContext.generateMipmap(glContext.TEXTURE_CUBE_MAP);
			this.loaded = true;
		}


	}

	//loading of each texture from file (cpu side depending on browser)
	initTextureCube()
	{
		var id = 0;
		this.cntLoad = 0;
		for(var j = 0;j<6;j++)
		{
			this.imagesLoaded[j] = new Image();
			this.imagesLoaded[j].onload = this.textureLoading.bind(this);

			this.imagesLoaded[j].src = this.images[j];
		}
	}



}
