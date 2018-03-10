class Terrain{

  constructor(width, height, texture){
    this.vertexBuffer = null
    this.indexBuffer = null
    this.colorBuffer = null

    this.width = width
    this.height = height
    this.texture = texture

    this.posX = -60;
    this.posY = 0;

    this.NB_POINTS_X = 100
    this.NB_POINTS_Y = 100

    this.MAX_ITERATION = 2
    this.SMOOTHNESS = 2000
    this.WATER_LEVEL_RATIO = 0.4
    this.DISTANCE_BETWEEN_POINTS = 5

    this.DEPTH = 1

    this.verticesIndice = 0

    this.texColorTab = new Array();

    this.vertexBuffersArray = [];
    this.indexBuffersArray = [];
    this.textureBuffersArray = [];
    this.normalBuffersArray = [];
    this.indicesArray = [];

    this.enableOffset= [];

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.nMatrix = mat4.create();

    this.heightMap = [];


    this.init()
  }

  init(){
    this.indices = []
    this.vertices = []
    this.normals = []
		this.textCoords = []

    this.enableOffset = []




    //this.simpleTriangle();
    this.generate()

    //console.log(this.vertices)
    /*
    console.log(Math.max(...this.indices))
    console.log(this.normals)
    console.log(this.textCoords)*/

    this.vertexBuffer = getVertexBufferWithVertices(this.vertices)
    this.indexBuffer  = getIndexBufferWithIndices(this.indices)
		this.textCoordsBuffer = getArrayBufferWithArray(this.textCoords);
    this.normalBuffer     = getArrayBufferWithArray(this.normals);

    this.enableOffsetBuffer = getArrayBufferWithArray(this.enableOffset);

    initTextureWithImage( this.texture, this.texColorTab );

  }

  generate()
  {
      //heightMap =  generateIsland(this.NB_POINTS_X, this.NB_POINTS_Y)
      this.heightMap =  generateTerrain(this.NB_POINTS_X, this.NB_POINTS_Y)

      let elevationMax = 0;
      let elevationMin = 1;

      var coordX = 0.0;
      var coordY = 0.0;

      this.heightMap.forEach((y, iy) => {
        if(coordY == 0.0){
          coordY = 1.0;
        }else{
          coordY = 0.0;
        }
          y.forEach((x, ix) => {

              let elevation = x / 255
              let newX = this.width / this.NB_POINTS_X * ix / this.DISTANCE_BETWEEN_POINTS
              let newY = this.height / this.NB_POINTS_Y * iy / this.DISTANCE_BETWEEN_POINTS

              if (elevation > elevationMax)
              (
                  elevationMax = elevation
              )

              if (elevation < elevationMin)
              (
                  elevationMin = elevation
              )

              //this.vertices.push(newX+this.posX, elevation , newY+this.posY);
              this.vertices.push(newX+this.posX, elevation * this.DEPTH , newY+this.posY);
              this.normals.push( 0.0, 0.0, 0.0)
              this.textCoords.push(coordX, coordY);

              if(coordX == 0.0){
                coordX = 1.0;
              }else{
                coordX = 0.0;
              }

          })
      })

      for (var x = 0; x < this.NB_POINTS_X - 1 ; x++)
      {
          for (var y = 0; y < this.NB_POINTS_Y - 1 ; y++)
          {

              this.indices.push(x + y * this.NB_POINTS_X , x + 1 + y * this.NB_POINTS_X, x + 1 + (y+1) * this.NB_POINTS_X)
              this.indices.push(x + y * this.NB_POINTS_X , x + (y+1) * this.NB_POINTS_X, x + 1 + (y+1) * this.NB_POINTS_X)

              this.enableOffset.push(0.0)
              this.enableOffset.push(0.0)

          }
      }

      let offset = this.NB_POINTS_X * this.NB_POINTS_Y

  }


  draw(mvMatrix, pos)
    {

      translationMat = mat4.create();
      mat4.identity(translationMat);
      mat4.translate(translationMat, translationMat, pos);
      mvMatrix = mat4.multiply(mat4.create(), translationMat, mvMatrix);

      glContext.uniformMatrix4fv(ptr.mvMatrixUniform, false, mvMatrix);


      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.enableOffsetBuffer);
      glContext.vertexAttribPointer(ptr.offsetEnable, 1, glContext.FLOAT, false, 0, 0);

      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
      glContext.vertexAttribPointer(ptr.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalBuffer);
      glContext.vertexAttribPointer(ptr.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textCoordsBuffer);
      glContext.vertexAttribPointer(ptr.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      glContext.activeTexture(glContext.TEXTURE0);
      glContext.bindTexture(glContext.TEXTURE_2D, this.texColorTab[0]);
      glContext.uniform1i(ptr.ocolorTextureUniform, 0);
      glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT,0);
      }
}
