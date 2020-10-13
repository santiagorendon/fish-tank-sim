var sand, rock, rock2, c1, c2, fishImage


var sandArray = []
var fishArray = []
var rockArray = []
var state = 'sand'

function preload(){
  sand = loadImage('images/sand.png')
  rock = loadImage('images/rock.png')
  fishImage = loadImage('images/fish.png')
}

function setup() {
  createCanvas(1000, 800);
  c1 = color(	0, 159, 253);
  c2 = color(42,42,114);
}

function draw() {
  fill(52, 189, 235)
  setGradient(c1, c2);
  imageMode(CENTER)

  // create

  if (mouseIsPressed && state=='sand' && mouseY >= 100){
    var tempSand = new Sand(mouseX, mouseY)
    sandArray.push(tempSand)
  }

  if (mouseIsPressed && state=='rock' && mouseY >= 100){
    var tempRock = new Rock(mouseX, mouseY)
    rockArray.push(tempRock)
  }

  if (mouseIsPressed && state=='fish' && mouseY >= 100){
    var newFish = new fish(mouseX, mouseY);
    fishArray.push(newFish)
  }


  // display
  for (var i = sandArray.length-1; i >= 0; i--) {
    sandArray[i].display()
    }
  for (var i = rockArray.length-1; i >= 0; i--) {
    rockArray[i].display()
    }
    for (var i = fishArray.length-1; i >= 0; i--) {
      fishArray[i].display()
      fishArray[i].move()
      
  }
  

    // buttons
    buttonImages()
}


class Rock {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(rock, this.x, this.y, 200, 100)
  }
}

class Sand {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(sand, this.x, this.y, 100, 100)
  }
}


// need a better way of doing this
function buttonImages(){
  clickedSand.onclick = function(){
    clickedSand.style.backgroundColor = 'black'
    clickedRock.style.backgroundColor = 'white'
    clickedFish.style.backgroundColor = 'white'
    state = 'sand' 
  }
  clickedRock.onclick = function(){
    clickedSand.style.backgroundColor = 'white'
    clickedRock.style.backgroundColor = 'black'
    clickedFish.style.backgroundColor = 'white'
    state = 'rock'
  }
  clickedFish.onclick = function(){
    clickedSand.style.backgroundColor = 'white'
    clickedRock.style.backgroundColor = 'white'
    clickedFish.style.backgroundColor = 'black'
    state = 'fish'

}
  
}

// code from https://editor.p5js.org/REAS/sketches/S1TNUPzim
function setGradient(c1, c2) {
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

class fish {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
  }

  display() {
    image(fishImage, this.x, this.y, 25, 25);
  }

  move() {
    var xMovement = map( noise(this.xNoiseOffset), 0, 1, -1, 1 );
    var yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    this.x += xMovement;
    this.y += yMovement;
    constrain(this.x, fishImage.size, width-fishImage.size )
    constrain(this.y, fishImage.size, height-fishImage.size)
    this.xNoiseOffset += 0.01;
    this.yNoiseOffset += 0.01;
  }
}
