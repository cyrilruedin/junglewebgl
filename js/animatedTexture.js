class AnimatedTexture{

  constructor(texture, vertices, normals, textCoords, indices){

      this.texture = texture;

      this.vertices = vertices;
      this.normals = normals;
      this.textCoords = textCoords;
      this.indices = indices;

      this.currentTexID = 1;
			this.maxSample = 1;
			this.normalBuffer = null;
			this.vertexBuffer = null;
			this.indexBuffer = null;
			this.textCoordsBuffer = null;
			this.texColorTab = new Array();

      this.enableOffset = [];

			this.rotObject = 0;
			this.objectInRotation = 0;
			this.textureInTranslation = 0;
			this.textureOffsetX = 0.05;
			this.textureOffsetY = 0.0;
			this.deltaTranslateX = 0.002;
			this.deltaTranslateY = 0.002;

    this.init()
  }

  init(){

		this.normalBuffer     = getArrayBufferWithArray(this.normals);
		this.vertexBuffer     = getArrayBufferWithArray(this.vertices);
    this.textCoordsBuffer = getArrayBufferWithArray(this.textCoords);
		this.indexBuffer      = getIndexBufferWithIndices(this.indices);



    this.enableOffsetBuffer = getArrayBufferWithArray(this.enableOffset);

    initTextureWithImage( this.texture, this.texColorTab );
  }


  draw(mvMatrix)
    {
        glContext.useProgram(progOffset);
        glContext.uniformMatrix4fv(ptr.opMatrixUniform, false, pMatrix);
      //  glContext.uniformMatrix4fv(ptr.opMatrixUniform, false, pMatrix);

        if (this.textureOffsetX<1.0)
          this.textureOffsetX += this.deltaTranslateX;
        else this.textureOffsetX = 0.0;

        glContext.uniformMatrix4fv(ptr.omvMatrixUniform, false, mvMatrix);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(ptr.overtexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textCoordsBuffer);
        glContext.vertexAttribPointer(ptr.otextureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        glContext.activeTexture(glContext.TEXTURE0);
        glContext.bindTexture(glContext.TEXTURE_2D, this.texColorTab[0]);


        glContext.uniform1f(ptr.odeltaTexX, this.textureOffsetX);
				glContext.uniform1f(ptr.odeltaTexY, this.textureOffsetY);

        glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT,0);



  }


}
