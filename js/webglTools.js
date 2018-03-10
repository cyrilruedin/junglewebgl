function getTextContent( elementID ) {
		var element = document.getElementById(elementID);
		var fsource = "";
		var node = element.firstChild;
		var str = "";
		while (node) {
			if (node.nodeType == 3) // this is a text node
				str += node.textContent;
			node = node.nextSibling;
		}
		return str;
	}


function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
	   var vsh = gl.createShader( gl.VERTEX_SHADER );
	   gl.shaderSource(vsh,vertexShaderSource);
	   gl.compileShader(vsh);
	   if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
		  console.log("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
	   }
	   var fsh = gl.createShader( gl.FRAGMENT_SHADER );
	   gl.shaderSource(fsh, fragmentShaderSource);
	   gl.compileShader(fsh);
	   if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
		  console.log("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
	   }
	   var prog = gl.createProgram();
	   gl.attachShader(prog,vsh);
	   gl.attachShader(prog, fsh);
	   gl.linkProgram(prog);
	   if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
		  console.log("Link error in program:  " + gl.getProgramInfoLog(prog));
	   }
	return prog;
}


function getGLContext(canvasName) {
    var canvas = document.getElementById(canvasName);
    if (canvas == null) {
        alert("there is no canvas on this page");
        return;
    } else {
        c_width = canvas.width;
        c_height = canvas.height;
    }

    var gl = null;
    var names = ["webgl",
        "experimental-webgl",
        "webkit-3d",
        "moz-webgl"
    ];

    for (var i = 0; i < names.length; i++) {
        try {
			gl = canvas.getContext(names[i]); // no blending

			//*** for transparency (Blending) ***
            //gl = canvas.getContext(names[i], {premultipliedAlpha: false});
            //gl.enable(gl.BLEND);
            //gl.blendEquation(gl.FUNC_ADD);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } catch (e) {}

        if (gl) break;
    }

    if (gl == null) {
        alert("WebGL is not available");
    } else {
        //alert("We got a WebGL context: "+names[i]);
        return gl;
    }
}


/**
 * The following code snippet creates a vertex buffer and binds the vertices to it.
 */
function getVertexBufferWithVertices(vertices) {
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}

/**
 * The following code snippet creates a vertex buffer and binds the indices to it.
 */
function getIndexBufferWithIndices(indices) {
    var iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    return iBuffer;
}


function getArrayBufferWithArray(values) {
    //The following code snippet creates an array buffer and binds the array values to it
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(values), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}



function initTextureWithImage(sFilename, texturen) {
    var anz = texturen.length;
    texturen[anz] = glContext.createTexture();

    texturen[anz].image = new Image();
    texturen[anz].image.onload = function() {
        glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
        glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, texturen[anz].image);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);

        glContext.generateMipmap(glContext.TEXTURE_2D);

        glContext.bindTexture(glContext.TEXTURE_2D, null);
    }

    texturen[anz].image.src = sFilename;

    // let's use a canvas to make textures, with by default a random color (red, green, blue)
    function rnd() {
        return Math.floor(Math.random() * 256);
    }

    var c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    var ctx = c.getContext("2d");
    var red = rnd();
    var green = rnd();
    var blue = rnd();
    ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

    ctx.fillRect(0, 0, 64, 64);

    glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, c);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
}


function renderLoop() {
    drawScene();
    refreshTimer = requestAnimationFrame(renderLoop);
}

function degToRad(degrees) {
    return (degrees * Math.PI / 180.0);
}
