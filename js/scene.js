//Déclaration des pointeurs permettant de transmettre au Shader la géométrie de la scène
var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var tree = [];
var pony = [];
var oisal = [];
var terrain;
var test;

var skybox;
var skyboxTexID;

var progOffset = null;
var progJungle = null;
var progSkybox = null;
var ptr = new Object();

//Tableau correspondant aux buffer
var indices = [];
var vertices = [];
var colors = [];

var vertexBuffersArray = [];
var indexBuffersArray = [];
var textureBuffersArray = [];
var normalBuffersArray = [];
var indicesArray = [];
var texColorTab = new Array();

var currentRy = 0;

//Déclaration des matrices de transformations
var mvMatrix = mat4.create(); //ModelViewMatrix
var pMatrix = mat4.create(); //Projection Matrix
var nMatrix = mat4.create(); //Normals Matrix

var globalRotation = mat4.create();

var hWater = 100;


var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

var krx = 0.0;
var kry = 0.0;
var krz = 0.0;

var wind = 0;
var windPower = 0;
var windOffset = 0;

window.onkeydown = checkKey;
window.onkeyup = checkKeyUp;

var movingStep = 5.0;
var rotateStep = 0.05;

var rRot = [];

function checkKey(ev){

	switch(ev.keyCode){
		case 87: tz=movingStep; break;
		case 83: tz=-movingStep; break;
		case 68: tx=-movingStep; break;

		case 65: tx=movingStep; break;
		case 70:
		case 16: ty=movingStep; break;
		case 82:
		case 32: ty=-movingStep; break;

		case 40:
		case 75: krx=-rotateStep; break;
		case 38:
		case 73: krx=+rotateStep; break;

		case 74: kry=-rotateStep; break;

		case 76: kry=+rotateStep; break;
		case 37:
		case 85: krz=-rotateStep; break;
		case 39:
		case 79: krz=+rotateStep; break;
		case 107: windPower += 0.1; break;
		case 109: windPower -= 0.1; break;
		case 80: activePonyMod(); break;

		default:
      console.log(tz);
			console.log(ev.keyCode);
		break;
	}
}

function checkKeyUp(ev){
	switch(ev.keyCode){
		case 87: tz=0; break;
		case 83: tz=0; break;
		case 68: tx=0; break;
		case 65: tx=0; break;
		case 32: ty=0; break;
		case 82: ty=0; break;
		case 70:
		case 16: ty=0; break;
		case 75:krx=0; break;
		case 38: krx=0; break;
		case 73:krx=0; break;
		case 40: krx=0; break;
		case 76:kry=0; break;
		case 39: krz=0; break;
		case 74:kry=0; break;
		case 37: krz=0; break;
		case 85: krz=0; break;
		case 79: krz=0; break;
		default:
			console.log(ev.keyCode);
		break;
	}


}

function activePonyMod(){
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/pony.obj", "model/pony2/pony.png", [1,0,0],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/eyelashes.obj", "model/pony2/eyelashes.png",[1,0,0],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/hairFront.obj", "model/pony2/hairFront.png",[1,0,0],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/leftEye.obj", "model/pony2/leftEye.png",[1,0,0],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-15), "../model/pony2/leftWing.obj", "model/pony2/leftWing.png",[0,1,0],0.05, -0.2));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/rightEye.obj", "model/pony2/rightEye.png",[1,0,0],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-15), "../model/pony2/rightWing.obj", "model/pony2/rightWing.png",[0,1,0],0.05, 0.2));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/tail.obj", "model/pony2/tail.png",[0,0,1],0));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/teeth.obj", "model/pony2/teeth.png",[0,0,1],0.02, 0.1));
	tree.push(new Pony(vec3.fromValues(0,-50,-25), "../model/pony2/tongue.obj", "model/pony2/tongue.png",[0,0,1],0.02, 0.1));
}



function initShaders(){

	/*******************************************
	* Inits the shader for the skybox rendering
	*******************************************/

	//Selection of the 2 shader texts for the skybox
	var vertexShaderSkybox = getTextContent("shader-vs-skybox");
	var fragmentShaderSkybox = getTextContent("shader-fs-skybox");
	//Create the program for the shader
	progSkybox = createProgram(glContext,vertexShaderSkybox,fragmentShaderSkybox);



	var vertexShaderCurrent = getTextContent("shader-vs");
	var fragmentShaderCurrent = getTextContent("shader-fs");
	progCurrent = createProgram(glContext,vertexShaderCurrent,fragmentShaderCurrent);

	var vertexShaderTest = getTextContent("shader-vs-offset");
	var fragmentShaderTest = getTextContent("shader-fs-offset");
	progOffset = createProgram(glContext,vertexShaderTest,fragmentShaderTest);

	initShaderParameters();

	glContext.useProgram(progCurrent);

	/*******************************************
	* Inits the shader for the scene rendering
	*******************************************/

}

function initShaderParameters(){

			//current
			//Géométrie et couleurs associées
			ptr.vertexPositionAttribute 	= glContext.getAttribLocation(progCurrent, "aVertexPosition");
				glContext.enableVertexAttribArray(ptr.vertexPositionAttribute);
				ptr.vertexNormalAttribute 		= glContext.getAttribLocation(progCurrent, "aVertexNormal");
				glContext.enableVertexAttribArray(ptr.vertexNormalAttribute);
				ptr.textureCoordsAttribute 		= glContext.getAttribLocation(progCurrent, "aTextureCoord");
				glContext.enableVertexAttribArray(ptr.textureCoordsAttribute);
			ptr.colorTextureUniform 		= glContext.getUniformLocation(progCurrent, "uColorTexture");
				ptr.pMatrixUniform             	= glContext.getUniformLocation(progCurrent, 'uPMatrix');
				ptr.mvMatrixUniform            	= glContext.getUniformLocation(progCurrent, 'uMVMatrix');
				ptr.nMatrixUniform             	= glContext.getUniformLocation(progCurrent, 'uNMatrix');
				ptr.lightPositionUniform       	= glContext.getUniformLocation(progCurrent, 'uLightPosition');

			//offset
			ptr.overtexPositionAttribute 	= glContext.getAttribLocation(progOffset, "aVertexPosition");
			glContext.enableVertexAttribArray(ptr.overtexPositionAttribute);
			ptr.otextureCoordsAttribute 		= glContext.getAttribLocation(progOffset, "aTextureCoord");
			glContext.enableVertexAttribArray(ptr.otextureCoordsAttribute);
			ptr.opMatrixUniform             	= glContext.getUniformLocation(progOffset, 'uPMatrix');
			ptr.omvMatrixUniform            	= glContext.getUniformLocation(progOffset, 'uMVMatrix');
			//ptr.offsetEnable 									= glContext.getAttribLocation(progOffset, 'aOffsetEnable');
			glContext.enableVertexAttribArray(ptr.offsetEnable);
			ptr.odeltaTexX 				= glContext.getUniformLocation(progOffset, "deltaTexX");
	    ptr.odeltaTexY				= glContext.getUniformLocation(progOffset, "deltaTexY");


			//skybox
			//Linking the attribute for the cube map coords
			ptr.sbCoordsAttribute = glContext.getAttribLocation(progSkybox, "aCoords");
			glContext.enableVertexAttribArray(ptr.sbCoordsAttribute);

			//Linking the uniform model view matrix for the skybox shader
			ptr.sbMVMatrixUniform = glContext.getUniformLocation(progSkybox, "uMVMatrix");
			//Linking the uniform projection matrix for the skybox shader
			ptr.sbPMatrixUniform = glContext.getUniformLocation(progSkybox, "uPMatrix");
			//Linking the uniform texture location for the first skybox
			ptr.cubeTextureUniform1 = glContext.getUniformLocation(progSkybox, "uSkybox1");
			//Linking the uniform texture location for the second skybox
			ptr.cubeTextureUniform2 = glContext.getUniformLocation(progSkybox, "uSkybox2");

}

//Initialisation of the static texture ressources for the skybox
function initSkyboxesReferences()
{
	var skyboxes = [];

		skyboxes[0] = [];
		skyboxes[0].push("texture/skyboxes/ely_hills/hills_lf.png");
		skyboxes[0].push("texture/skyboxes/ely_hills/hills_rt.png");
		skyboxes[0].push("texture/skyboxes/ely_hills/hills_up.png");
		skyboxes[0].push("texture/skyboxes/ely_hills/down2.png");
		skyboxes[0].push("texture/skyboxes/ely_hills/hills_bk.png");
		skyboxes[0].push("texture/skyboxes/ely_hills/hills_ft.png");

//http://www.custommapmakers.org/skyboxes.php

		skyboxes[1] = [];
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_dn.png");
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_bk.png");
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_ft.png");
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_lf.png");
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_rt.png");
		skyboxes[1].push("texture/skyboxes/ely_hills/hills_up.png");

	return skyboxes;
}

function placeFlore(){
	tree = [];

	rScale = randomScale(terrain.vertices.length*12, 1, 1.5)

		if(parseFloat(document.getElementById("sliderFern").value) > 0){
			var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderFern").value))
			tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_fern3/obj__fern3.obj", "model/new/loopix-project/WOODLAND_PACK/w_fern3/fern3.png", 300));
		}

	if(parseFloat(document.getElementById("sliderTree1").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree1").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree1/obj__tree1.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree1/tree1.png", 900));
	}

	if(parseFloat(document.getElementById("sliderTree2").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree2").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree2/obj__tree2.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree2/tree2.png", 900));
	}

	if(parseFloat(document.getElementById("sliderTree3").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree3").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree3/obj__tree3.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree3/tree3.png", 900));
	}

	if(parseFloat(document.getElementById("sliderTree4").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree4").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree4/obj__tree4.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree4/tree4.png", 900));
	}

	if(parseFloat(document.getElementById("sliderTree5").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree5").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree5/obj__tree5.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree5/tree5.png", 900));
	}

	if(parseFloat(document.getElementById("sliderTree6").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree6").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree6/obj__tree6.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_tree6/tree6.png", 900));
	}
	if(parseFloat(document.getElementById("sliderPine1").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree5").value))
		tree.push(new Tree(posArray, rRot,rScale,"../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_pinetree1/obj__pinet1.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_pinetree1/pinet1.png", 900));
	}

	if(parseFloat(document.getElementById("sliderPine2").value) > 0){
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderTree6").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_pinetree2/obj__pinet2.obj", "/model/new/loopix-project/WOODLAND_PACK/WOODLAND_TREES/f_pinetree2/pinet2.png", 900));
	}

	if(parseFloat(document.getElementById("sliderPalm1").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 0, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalm1").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree1/obj__palmt1.obj", "/model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree1/palmt1.png", 800));
	}

	if(parseFloat(document.getElementById("sliderPalm2").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 0, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalm2").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree2/obj__plamt2.obj", "/model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree2/palmt2.png", 600));
	}

	if(parseFloat(document.getElementById("sliderPalm3").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 0, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalm3").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree3/obj__plamt3.obj", "/model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree3/palmt3.png", 600));
	}

	if(parseFloat(document.getElementById("sliderPalm4").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 0, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalm4").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree4/obj__palmt4.obj", "/model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree4/palmt4.png", 600));
	}

	if(parseFloat(document.getElementById("sliderPalm5").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 0, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalm5").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree5/obj__palmt5.obj", "/model/new/loopix-project/tropical_pack_1/TROPICAL_TREES/t_palmtree5/palmt5.png", 600));
	}

	if(parseFloat(document.getElementById("sliderPalmShrub1").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalmShrub1").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/t_palm_shrub1/obj__palms1.obj", "/model/new/loopix-project/tropical_pack_1/t_palm_shrub1/palms1.png", 900));
	}


	if(parseFloat(document.getElementById("sliderPalmShrub2").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPalmShrub2").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/tropical_pack_1/t_palm_shrub2/obj__palms2.obj", "/model/new/loopix-project/tropical_pack_1/t_palm_shrub2/palms2.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub1").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub1").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub2/obj__shr2.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub2/shr2.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub2").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub2").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub3/obj__shr3.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub3/shr3.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub3").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub3").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub4/obj__shr4.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub4/shr4.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub4").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub4").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub9/obj__shr9.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub9/shr9.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub5").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub5").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub15/obj__shr15.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub15/shr15.png", 800));
	}

	if(parseFloat(document.getElementById("sliderShrub6").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderShrub6").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_shrub16/obj__shr16.obj", "/model/new/loopix-project/WOODLAND_PACK/w_shrub16/shr16.png", 800));
	}

	//

	if(parseFloat(document.getElementById("sliderWeed1").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed1").value))
		tree.push(new Tree(posArray, rRot,rScale,"../model/new/loopix-project/WOODLAND_PACK/w_weed1/obj__weed1.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed1/weed1.png", 600));
	}

	if(parseFloat(document.getElementById("sliderWeed2").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed2").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_weed3/obj__weed3.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed3/weed3.png", 600));
	}


	if(parseFloat(document.getElementById("sliderWeed3").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed3").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_weed4/obj__weed4.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed4/weed4.png", 600));
	}

	if(parseFloat(document.getElementById("sliderWeed4").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed4").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_weed5/obj__weed5.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed5/weed5.png", 600));
	}

	if(parseFloat(document.getElementById("sliderWeed5").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed5").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_weed6/obj__weed6.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed6/weed6.png", 600));
	}

	if(parseFloat(document.getElementById("sliderWeed6").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 3)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderWeed6").value))
		tree.push(new Tree(posArray, rRot,rScale, "../model/new/loopix-project/WOODLAND_PACK/w_weed4a/obj__weed4a.obj", "/model/new/loopix-project/WOODLAND_PACK/w_weed4a/weed4a.png", 600));
	}

	if(parseFloat(document.getElementById("sliderPoney").value) > 0){
		rScale = randomScale(terrain.vertices.length*12, 1, 1)
		var posArray = getPositionArray(terrain.vertices, parseFloat(document.getElementById("sliderPoney").value))
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/pony.obj", "model/pony2/pony.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/eyelashes.obj", "model/pony2/eyelashes.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/hairBack.obj", "model/pony2/hairBack.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/hairFront.obj", "model/pony2/hairFront.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/leftEye.obj", "model/pony2/leftEye.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/leftWing.obj", "model/pony2/leftWing.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/rightEye.obj", "model/pony2/rightEye.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/rightWing.obj", "model/pony2/rightWing.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/tail.obj", "model/pony2/tail.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/teeth.obj", "model/pony2/teeth.png", 600));
		tree.push(new Tree(posArray, rRot, rScale, "../model/pony2/tongue.obj", "model/pony2/tongue.png", 600));
	}
}


function initScene(){
	min = -50;
	max = 50;
	size = 20;




glContext.useProgram(progCurrent);
	terrain = new Terrain(20000,20000, "texture/sol.png");



	rRot = randomRot(terrain.vertices.length*12);

	var vertices = [];
	var normals = []
	var textCoords = [];
	var indices = [];

	var wSize = 1000;
	var k = 0;
	for(i = 0; i < 8; i++){
		for(j = 0; j < 8; j++){

			vertices.push(i*wSize, hWater, j*wSize);
			vertices.push((i+1)*wSize, hWater, j*wSize);
			vertices.push(i*wSize, hWater, (j+1)*wSize);
			vertices.push((i+1)*wSize, hWater, (j+1)*wSize);

			textCoords.push(0.0, 0.0);
			textCoords.push(1.0, 0.0);
			textCoords.push(0.0, 1.0);
			textCoords.push(1.0, 1.0);

			normals.push(1,1,1);
			normals.push(1,1,1);
			normals.push(1,1,1);
			normals.push(1,1,1);

			indices.push(0+((k)*4), 1+((k)*4), 2+((k)*4), 3+((k)*4) ,2+((k)*4), 1+((k)*4))
			k++;
		}

	}

	test = new AnimatedTexture("texture/water.jpg", vertices, normals, textCoords, indices);

	var vertices = [];
	var normals = []
	var textCoords = [];
	var indices = [];

	var wSize = 1000;
	var k = 0;
	for(i = -8; i < 16; i++){
		for(j = -8; j < 16; j++){

			vertices.push(i*wSize, 600, j*wSize);
			vertices.push((i+1)*wSize, 600, j*wSize);
			vertices.push(i*wSize, 600, (j+1)*wSize);
			vertices.push((i+1)*wSize, 600, (j+1)*wSize);

			textCoords.push(0.0, 0.0);
			textCoords.push(1.0, 0.0);
			textCoords.push(0.0, 1.0);
			textCoords.push(1.0, 1.0);

			normals.push(1,1,1);
			normals.push(1,1,1);
			normals.push(1,1,1);
			normals.push(1,1,1);

			indices.push(0+((k)*4), 1+((k)*4), 2+((k)*4), 3+((k)*4) ,2+((k)*4), 1+((k)*4))
			k++;
		}

	}

	oisal.push(new AnimatedTexture("texture/birds.png", vertices, normals, textCoords, indices));


	//skybox
	var skyboxes = initSkyboxesReferences();
	skybox = new Skybox("Skybox", skyboxes);


	translationMat = mat4.create();
	//mat4.identity(translationMat);


	mat4.translate(translationMat, translationMat, [-3000, -300, -2000]);
	mvMatrix = mat4.multiply(mat4.create(), translationMat, mvMatrix);




placeFlore();
	//Appel à la fonction rendu de la scène
	renderLoop();
}

function getPositionArray(vertex, sub){
  positionArray = [];
	var min = -60;
	var max = 60;
	var s = 0;
  for(i = 0; i < vertex.length; i+=3){
		s = sub;
		while(s >= 1){
			if(vertex[i+1] > hWater){
				positionArray.push(vec3.fromValues(vertex[i]+(Math.random() * (max - min) + min), vertex[i+1], vertex[i+2]+(Math.random() * (max - min) + min)));
			}
			s--
		}
		if(Math.random() <= s){
			if(vertex[i+1] > hWater){
				positionArray.push(vec3.fromValues(vertex[i]+(Math.random() * (max - min) + min), vertex[i+1], vertex[i+2]+(Math.random() * (max - min) + min)));
			}
		}
	}
  return positionArray;
}

function randomScale(size, min, max){
	rScale = [];
	for(i = 0; i < size; i++){
		rScale.push(vec3.fromValues((Math.random() * (max - min) + min), (Math.random() * (max - min) + min) ,(Math.random() * (max - min) + min)));
	}

	return rScale;
}

function randomRot(size){
	rRot = [];

	for(i = 0; i < size; i++){
		rRot.push(Math.random()*3.14*2);
	}
	return rRot;
}


function drawScene(){


		windOffset+=windPower/10;
		wind = windPower + Math.sin(windOffset)/10*windPower;

	glContext.useProgram(progCurrent);
		//Arrière plan
		glContext.clearColor(0.9, 0.9, 0.9, 1.0);
		//Préparation de la scène
		glContext.enable(glContext.DEPTH_TEST);
		glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
		glContext.viewport(0, 0, c_width, c_height);


		mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 10000.0);
		glContext.uniformMatrix4fv(ptr.pMatrixUniform, false, pMatrix);



		rotXQuat = quat.create();
		quat.setAxisAngle(rotXQuat, [1, 0, 0], krx);

		rotYQuat = quat.create();
		quat.setAxisAngle(rotYQuat, [0, 1, 0], kry);

		var rotZQuat = quat.create();
		quat.setAxisAngle(rotZQuat, [0, 0, 1], krz);

		myQuaternion = quat.create();
		quat.multiply(myQuaternion, rotYQuat, rotXQuat);
		quat.multiply(myQuaternion, rotZQuat, myQuaternion);

		rotationMatrix = mat4.create();
	  mat4.fromRotationTranslationScaleOrigin(rotationMatrix, myQuaternion, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0));
	  mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);
		mat4.multiply(globalRotation, rotationMatrix, globalRotation)

		translationMat = mat4.create();
		mat4.translate(translationMat, translationMat, [tx, ty, tz]);
		mat4.multiply(mvMatrix, translationMat, mvMatrix);

    terrain.draw(mvMatrix, vec3.fromValues(0,0,0));
		tree.forEach(function(element, index){
				element.drawObject(mvMatrix);
		});

		oisal.forEach(function(element, index){
			element.draw(mvMatrix);
		});

		test.draw(mvMatrix);

		//skybox
		skybox.draw(globalRotation);

		glContext.useProgram(progCurrent);

}


function initWebGL(){
	glContext = getGLContext('webgl-canvas');


	initShaders();
	initScene();

}
