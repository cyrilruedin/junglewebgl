/// SOURCE FOR THIS EXAMPLE : http://math.hws.edu/eck/cs424/notes2013/webgl/skybox-and-reflection/skybox.html

class Skybox{
	constructor(name, images){

		this.points = [];

		this.images = images;

		this.skyboxTextures = [];

		this.vertices = [];
		this.normals = [];
		this.texCoord = [];
		this.indices = [];


		this.vertexBuffer = null;
		this.normalBuffer = null;
		this.textureCoordBuffer = null;
		this.indexBuffer = null;


		this.mvMatrix = mat4.create();
		this.pMatrix = mat4.create();

		this.init();

	}

	init(){

		//Inits the buffers for the cube of the skybox
		this.initBuffers();

		//We load each texture with the class SkyboxTexture
		for(var i = 0;i<this.images.length;i++)
		{
			this.skyboxTextures[i] = new SkyboxTexture(i, this.images[i]);
		}

	}



	//Initialisation of a cube face
	createFace(xyz, nrm){
		var start = this.vertices.length/3;
		var i;
		for (i = 0; i < 12; i++) {
		this.vertices.push(xyz[i]);
		}
		for (i = 0; i < 4; i++) {
		 this.normals.push(nrm[0],nrm[1],nrm[2]);
		}
		this.texCoord.push(0,0,1,0,1,1,0,1);
		this.indices.push(start,start+1,start+2,start,start+2,start+3);
	}

	//Initialisation method to generate the base cube
	initBuffers() {
		var s = 1000.0;

		//We initialise each face
		this.createFace( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
		this.createFace( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
		this.createFace( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
		this.createFace( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
		this.createFace( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
		this.createFace( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );

		//And create the buffers (vertex, normals, texture coords and index)
		this.vertexBuffer = glContext.createBuffer();
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

		this.normalBuffer = glContext.createBuffer();
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalBuffer);
		glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.normals), glContext.STATIC_DRAW);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

		this.textureCoordBuffer = glContext.createBuffer();
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureCoordBuffer);
		glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.texCoord), glContext.STATIC_DRAW);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

		this.indexBuffer = glContext.createBuffer();
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), glContext.STATIC_DRAW);
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);


	}


	draw(mvMatrix){
		if(this.skyboxTextures[0].loaded && this.skyboxTextures[1].loaded){

			//Sets the local model view matrix
			mat4.identity(this.mvMatrix);
			mat4.multiply(this.mvMatrix, this.mvMatrix, mvMatrix);


			//We switch to the skybox program
			glContext.useProgram(progSkybox);
			//We give the shader the mvMatrix and the pMatrix
			glContext.uniformMatrix4fv(ptr.sbMVMatrixUniform, false, this.mvMatrix);
			glContext.uniformMatrix4fv(ptr.sbPMatrixUniform, false, pMatrix);

			//We enable the vertexAttrib for the cube coords
			glContext.enableVertexAttribArray(ptr.sbCoordsAttribute);

			//We bind the vertices and bind it to the pointer for the coords
			glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
			glContext.vertexAttribPointer(ptr.sbCoordsAttribute, 3, glContext.FLOAT, false, 0, 0);

			//We activate the TEXTURE0 slot
			glContext.activeTexture(glContext.TEXTURE0);
			//We indicate that it is a TEXTURE_CUBE_MAP and give it the first skybox
			glContext.bindTexture(glContext.TEXTURE_CUBE_MAP, this.skyboxTextures[0].texID);
			//We send the id of the texture slot
			glContext.uniform1i(ptr.cubeTextureUniform1, 0);

			//We activate the TEXTURE1 slot
			glContext.activeTexture(glContext.TEXTURE1);
			//We indicate that it is a TEXTURE_CUBE_MAP and give it the second skybox
			glContext.bindTexture(glContext.TEXTURE_CUBE_MAP, this.skyboxTextures[1].texID);
			//We send the is of the texture slot
			glContext.uniform1i(ptr.cubeTextureUniform1, 1);

			//We bind the index buffer
			glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

			//And ask for a draw
			glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
		}
		else
		{
			console.log("Textures still loading or and error occured");
		}
	}


}
