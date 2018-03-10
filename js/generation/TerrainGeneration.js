var gen = new SimplexNoise()

var noise1frequencyMultiplicator = 5
var noise2frequencyMultiplicator = 2
var noise3frequencyMultiplicator = 4

var wightNoise1 = 5
var wightNoise2 = 6
var wightNoise3 = 4

var restitution = 1

// island settings
var a = 0.10
var b = 0.30
var c = 0.00

function noise(nx, ny)
{
    // Rescale from -1.0:+1.0 to 0.0:1.0
    return gen.noise2D(nx, ny) / 2 + 0.5

}

function mapElevation(nx, ny)
{
    e = wightNoise1 * noise(noise1frequencyMultiplicator * nx, noise1frequencyMultiplicator * ny)
    + wightNoise2 * noise(noise2frequencyMultiplicator * nx, noise2frequencyMultiplicator * ny)
    + wightNoise3 * noise(noise3frequencyMultiplicator * nx, noise3frequencyMultiplicator * ny)

    return Math.pow(e,restitution)
}

function euclideanDistance(nx, ny)
{
    return 2*Math.sqrt(nx*nx + ny*ny)
}

function mapElevationWithIslandislandConstraints(nx, ny)
{
    return mapElevation(nx, ny) + a + b * Math.pow(euclideanDistance(nx, ny), c)
}

/*function drawToCanvas(canvasName, width, height, data)
{
    let canvas = document.getElementById(canvasName)
    let ctx = canvas.getContext('2d')
    data.forEach((y, iy) => {
        y.forEach((x, ix) => {
            ctx.fillStyle = "rgba("+x+","+x+","+x+", 1)"
            ctx.fillRect(ix,iy,1,1)
        })
    })
}*/

function generateTerrain(width, height)
{
    heightMap = []
    for (var y = 0; y < height; y++) {
        heightMap[y] = []
        for (var x = 0; x < width; x++) {
            var nx = x/width - 0.5, ny = y/height - 0.5;
            let temp = parseInt((mapElevation(nx, ny)/2) * 255)*50
            heightMap[y].push(temp);
        }
    }
    //drawToCanvas("dataCanvas", width, height, heightMap)
    return heightMap
}

function generateIsland(width, height)
{
    heightMap = []
    for (var y = 0; y < height; y++) {
        heightMap[y] = []
        for (var x = 0; x < width; x++) {
            var nx = x/width - 0.5, ny = y/height - 0.5;
            let temp = parseInt((mapElevationWithIslandislandConstraints(nx, ny)/2) * 255)*50
            heightMap[y].push(temp);
        }
    }
    //drawToCanvas("dataCanvas", width, height, heightMap)
    return heightMap
}
