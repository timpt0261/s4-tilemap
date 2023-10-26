import "./style.css";

// setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

// defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

// defining the size of the select grid
const numSelectables = 8; // The number of selectable textures
const selectHeight = selectCanvas.height / numSelectables;

// Create a FlyweightFactory to manage the shared textures
class TextureFlyweightFactory {
  private textures: Map<string, HTMLImageElement> = new Map();

  getTexture(imageUrl: string): HTMLImageElement {
    if (!this.textures.has(imageUrl)) {
      const texture = new Image();
      texture.src = imageUrl;
      this.textures.set(imageUrl, texture);
    }
    return this.textures.get(imageUrl)!;
  }
}

const textureFactory = new TextureFlyweightFactory();

// creating the tilemap nested array
let tilemap: HTMLImageElement[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = textureFactory.getTexture("/tile1.png");
  }
  tilemap[i] = row;
}

// track the selected tile
let currentTile = "/tile1.png";

// draw the initial canvases
redrawTilemap();
drawSelectCanvas();

// Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  cellSize: number
) {
  ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        tilemap[i][j],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize
      );
    }
  }
}

gridCanvas.addEventListener("click", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = textureFactory.getTexture(currentTile);
  redrawTilemap();
});

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const imageUrl = imageUrls[i];
    const selectableImage = textureFactory.getTexture(imageUrl);
    drawTexture(
      0,
      i,
      selectCtx,
      selectableImage,
      selectCanvas.width,
      selectHeight,
      64
    );
  }
}

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = imageUrls[coordY];
});
