class Tree{

  constructor(pos, rot, scale, model, texture, distShow){

    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.colorBuffer = null;
    this.textureBuffer = null;
    this.normalsBuffer = null;

    this.pos = pos;
    this.model = model;
    this.texture = "static/"+texture;
    this.scale = scale;
    this.distShow = distShow;
    this.rot = rot;

    this.mvMatrix2 = mat4.create();


    this.vertexBuffersArray = [];
    this.indexBuffersArray = [];
    this.textureBuffersArray = [];
    this.normalBuffersArray = [];
    this.indicesArray = [];

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.nMatrix = mat4.create();

    this.texColorTab = new Array();

    this.DEPTH = 0.01;

    this.verticesIndice = 0;

    this.init();

  }

  handleOBJModel(filename, data)
  {
  	console.info(filename + ' has been retrieved from the server');
  	var objData = new OBJ.Mesh(data);
  	this.vertexBuffer = getVertexBufferWithVertices(objData.vertices);
  	this.normalsBuffer = getVertexBufferWithVertices(objData.vertexNormals);
  	this.textureBuffer = getVertexBufferWithVertices(objData.textures);
  	this.indexBuffer = getIndexBufferWithIndices(objData.indices);

  	this.vertexBuffersArray.push(this.vertexBuffer);
  	this.normalBuffersArray.push(this.normalsBuffer);
  	this.textureBuffersArray.push(this.textureBuffer);
  	this.indexBuffersArray.push(this.indexBuffer);
  	this.indicesArray.push(objData.indices);
  }

  loadModel(filename)
  {
  	var request = new XMLHttpRequest();
  	console.info('Requesting ' + filename);
  	request.open("GET",filename);
    var actual;
    actual = this;
  	request.onreadystatechange = function() {
  	  if (request.readyState == 4) {
  		if(request.status == 404) {
  			console.info(filename + ' does not exist');
  		 }
  		else {
        actual.handleOBJModel(filename, request.responseText);

  		}
  	  }
  	}
  	request.send();
  }

  init(){
    this.indices = [];
    this.vertices = [];
    this.colors = [];

    this.loadModel(this.model);
    initTextureWithImage(this.texture, this.texColorTab );

    this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
    this.colorBuffer  = getVertexBufferWithVertices(this.colors);
    this.indexBuffer  = getIndexBufferWithIndices(this.indices);


  }

  drawObject(mvMatrix){
    var index = 0;

    //flyweight pattern foreach position
    for (let p of this.pos) {
      let rot;
        if(this.indicesArray.length > 0){




          mat4.translate(this.mvMatrix2, mvMatrix, p);

          index++;

          //Level Of Detail
          if(vec3.length(mat4.getTranslation(vec3.create(), this.mvMatrix2)) < this.distShow){

            mat4.multiply(this.mvMatrix2, this.mvMatrix2,mat4.fromZRotation(mat4.create(), wind));

            mat4.multiply(this.mvMatrix2, this.mvMatrix2,mat4.fromYRotation(mat4.create(), this.rot[index]));
            mat4.scale(this.mvMatrix2, this.mvMatrix2, this.scale[index]);


            glContext.uniformMatrix4fv(ptr.mvMatrixUniform, false, this.mvMatrix2);
            mat4.copy(this.nMatrix, this.mvMatrix2);
            mat4.invert(this.nMatrix, this.nMatrix);
            mat4.transpose(this.nMatrix, this.nMatrix);
            glContext.uniformMatrix4fv(ptr.nMatrixUniform, false, this.nMatrix);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
            glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalsBuffer);
            glContext.vertexAttribPointer(ptr.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureBuffer);
            glContext.vertexAttribPointer(ptr.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            glContext.activeTexture(glContext.TEXTURE0);
            glContext.bindTexture(glContext.TEXTURE_2D, this.texColorTab[0]);
            glContext.uniform1i(ptr.colorTextureUniform, 0);
            glContext.drawElements(glContext.TRIANGLES, this.indicesArray[0].length, glContext.UNSIGNED_SHORT,0);
          }

        }
    }
  }


}
