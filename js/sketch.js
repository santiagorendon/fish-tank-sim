var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage, sandImage, sellSound, foodImage, toiletImage, flushSound
var sandArray = []
var waterArray = []
var rockArray = []
var grassArray = []
var foodArray = []
var state, tempState
var canvas;


var waterLevelMapped, grassLevelMapped, rockLevelMapped, sandLevelMapped

var yoff = 0;
var level1=700;
var level2=800;
var canvasHeight = 800;
var canvasWidth = 1000;

var waterLevel = 0
var sandLevel = 0
var rockLevel = 0
var grassLevel = 0
var buttonArray

class Game{
  constructor(){
    // this.scene = 'tank';
    this.scene = 'tank';
    /* stats */
    this.stats = {displayIndex: -1, background: 'rgba(221,221,221,0.95)', bar: 'rgba(132, 43, 215, 0.6)',x: 770, y: 5, w: 225, h: 315};
    //fish holder
    this.fishArr = [];
    this.balance = 150;
  }
  drawBalance(){
    fill(0,0,0);
    textFont(fishFont);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Balance: $" + round(this.balance,2), 48, 25 );
  }
  drawStore(){
    backgroundFill(214, 253, 255);
    fill(0, 0, 0);
    textAlign(LEFT, TOP)
   .textSize(80);
    textFont(fishFont);
    textAlign(CENTER, TOP);
    text('STORE', canvasWidth/2, 10)
  }
  drawFish(){
    for(let i=0; i < this.fishArr.length; i++){
      this.fishArr[i].draw();
    }
  }
  drawTank(){
    // FILL TANK
    drawWater();
    if (mouseIsPressed && state == 'water' && mouseY >= 200){
      drawWater();
      if (waterLevel<=500){
        waterLevel +=1
      }
      if (level2>50){
        if (! waterSound.isPlaying() ) { // .isPlaying() returns a boolean
        waterSound.play();
      }
    }
      level1 -= 1.5;
      level2 -= 1.5;
      var drop = new Water(mouseX, mouseY);
      waterArray.push(drop)
    }



    // ADD SAND
    if (mouseIsPressed && state=='sand' && mouseY >= 200 && buttonArray[1].locked == false){
      var tempSand = new Sand(mouseX, mouseY)
      sandArray.push(tempSand)
      game.balance-=.01
      if(sandLevel<=200){
        sandLevel +=1
      }
    }

    // ADD FISH FOOD
    if (mouseIsPressed && state=='food' && mouseY >= 200 && buttonArray[5].locked == false){
      var tempFood = new Food(mouseX, mouseY)
      foodArray.push(tempFood)
      game.balance-=.0001
    }

    // DISPLAY CLASSES
    for (var i = sandArray.length-1; i >= 0; i--) {
      sandArray[i].display()
    }
    for (var i = rockArray.length-1; i >= 0; i--) {
      rockArray[i].display()
    }
    for (var i = waterArray.length-1; i >= 0; i--) {
      let check = waterArray[i].display()
      if (check == 'gone'){
        waterArray.splice(i, 1)
        i-=1
      }
    }
    for (var i = grassArray.length-1; i >= 0; i--) {
      grassArray[i].display()
    }
    for (var i = foodArray.length-1; i >= 0; i--) {
      let check = foodArray[i].display(game.fishArr)
      if (check == 'gone'){
        foodArray.splice(i, 1)
        i-=1
      }
    }

    // DISPLAY STATS, BUTTONS, AND TANK WALLS
    //displayEnvironmentalStats()
    this.drawBalance();
    displayButtons()
    displayTankWalls()
    this.drawFish();
    if(game.stats.displayIndex != -1){
      game.fishArr[game.stats.displayIndex].drawStats();
    }
  }
}


function crackLegendaryEgg(){
  rarity = Math.floor(random(85, 100));
  if(offSpringRarity >= 95){
    return ['S', rarity];
  }
  return ['A', rarity];
}

function crackRareEgg(){
  rarity = Math.floor(random(50, 85));
  if(offSpringRarity >= 70){
    return ['B', rarity];
  }
  return ['C', rarity];
}

function crackCommonEgg(){
  rarity = Math.floor(random(0, 50));
  if(offSpringRarity >= 25){
    return ['D', rarity];
  }
  return ['F', rarity];
}

function breedFish(rarity1, rarity2){
  rarity3 = random(0, 100);
  offSpringRarity = Math.ceil((rarity3+rarity2+rarity3)/3);
  if(offSpringRarity >= 95){
    return ['S', offSpringRarity];
  }
  else if(offSpringRarity >= 85){
    return ['A', offSpringRarity];
  }
  else if(offSpringRarity >= 70){
    return ['B', offSpringRarity];
  }
  else if(offSpringRarity >= 50){
    return ['C', offSpringRarity];
  }
  else if(offSpringRarity >= 25){
    return ['D', offSpringRarity];
  }
  return ['F', offSpringRarity];
}

// class Toilet{
//   constructor(x, y){
//     this.x = x
//     this.y = y
//   }
//   flushFish(fish){
//     if (dist(this.x, this.y, fish.x, fish.y ) <= 100){
//       game.fishArr.splice(this.index, 1);
//     }
//   }
// }
class Fish{
  constructor(type, rarity, index){
    this.index = index;
    this.type = type;
    //stats
    this.rarity = rarity;
    this.health = 100;
    this.startingPrice = 15;
    this.price = 15;
    this.age = 0;
    this.alive = true
    this.width = 100;
    this.height = 100;
    this.x = 500;
    this.y = 500;
    this.frameDelay = 25;
    this.frameCount = 0;
    this.frame = 0;
    this.frameNum = 2;
    // create a "noise offset" to keep track of our position in Perlin Noise space
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
  }
  draw(){
    if(this.type === "Gold Fish"){
      image(commonFishImgArr[this.frame], this.x, this.y, this.width, this.height);
    }

    // fish price varies depending on health
    this.price = round(((this.health/100) * this.startingPrice), 2)
    this.price = constrain(this.price, 0, 100000)


    // fish progressively loses health
    this.health = constrain(this.health, 1, 100)
    this.health -=.01
    this.health = round(this.health, 2)

    // fish progressively ages
    this.age += .0001



    // fish starved or grew too old?
    if (this.health <= 1 || this.age >= 10){
      this.alive = false
    }

    // fish only moves if it's alive
    if (this.alive){
      this.frameCount += 1;
      if(this.frameCount >= this.frameDelay){
        this.frame = (this.frame+1)%this.frameNum //num between 0 and 1;
        this.frameCount = 0;
      }
      var xMovement = map( noise(this.xNoiseOffset), 0, 1, -3, 3 );
      var yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1);
      this.x += xMovement;
      this.y += yMovement;
      this.x = constrain(this.x, this.width, width-this.width)
      this.y = constrain(this.y, this.height, height)
      this.xNoiseOffset += 0.01;
      this.yNoiseOffset += 0.01;
    }

    // fish sinks to bottom of tank when it dies
    else {
      this.health = 0
      this.price = 0
      if (this.y<= height-20){
        this.y += 1
      }

    }




    this.isClicked();
  }
  isClicked(){
    let higherThanFish = mouseY < this.y-37;
    let lowerThanFish = mouseY > this.y+this.height-70;
    let leftOfFish = mouseX < this.x-30;
    let rightOfFish = mouseX > this.x+this.width-63;
    let isHit = (!higherThanFish && !lowerThanFish && !leftOfFish && !rightOfFish)
    if(mouseIsPressed && isHit){
      game.stats.displayIndex = this.index;
    }
  }
  drawStats(){
    fill(game.stats.background);
    strokeWeight(1);
    rect(game.stats.x ,game.stats.y ,game.stats.w ,game.stats.h );
    //close button
    image(closeImg, game.stats.x+game.stats.w-12, game.stats.y+15, 20, 20);
    //draw label
    fill(0);
    textAlign(CENTER, TOP);
    textFont(fishFont);
    textSize(30);
    text(this.type, (game.stats.x+game.stats.x+game.stats.w)/2 ,game.stats.y+35)

    //draw icons
    textSize(20);
    image(heartImg, game.stats.x+40, game.stats.y+102, 100, 100);
    fill(game.stats.bar);
    let healthW = map(this.health, 0, 100, 0, 135);
    rect(game.stats.x+65, game.stats.y+88, healthW, 25);
    fill(0, 0, 0);
    text(`(${this.health}/100)`, game.stats.x+129, game.stats.y+91);

    image(rarityImg, game.stats.x+40, game.stats.y+155, 100, 100);
    fill(game.stats.bar);
    let rarityW = map(this.rarity, 0, 100, 0, 135);
    rect(game.stats.x+65, game.stats.y+145, rarityW, 25);
    fill(0, 0, 0);
    text(`(${this.rarity}/100)`, game.stats.x+129, game.stats.y+148);

    image(cashImg, game.stats.x+40, game.stats.y+210, 70, 70);
    //rect(game.stats.x+65, game.stats.y+202, 135, 25);
    text(`$ ${this.price}`, game.stats.x+129, game.stats.y+201);

    image(sellImg, (game.stats.x+game.stats.x+game.stats.w)/2+10, game.stats.y+280, 150, 150);
    ellipse((game.stats.x+game.stats.x+game.stats.w)/2-80, game.stats.y+280, 60, 60);

    //add event listeners
    this.isClosed();
    this.isSold();
    this.isFlushed();
  }
  isSold(){
    let higherThanSell = mouseY < game.stats.y+280 -35;
    let lowerThanSell = mouseY > game.stats.y+280 +150 -125;
    let leftOfSell = mouseX < (game.stats.x+game.stats.x+game.stats.w)/2+10  -25;
    let rightOfSell = mouseX > (game.stats.x+game.stats.x+game.stats.w)/2+10+150 -132;
    let isHit = (!higherThanSell && !lowerThanSell && !leftOfSell && !rightOfSell);
    if(mouseIsPressed && isHit){
      //increment price
      game.balance += this.price;
      //remove fish
      game.fishArr.splice(this.index, 1);
      //remove stats display
      game.stats.displayIndex = -1;
      // play noise
      if (! sellSound.isPlaying() ) { // .isPlaying() returns a boolean
        sellSound.play();
      }

    }
  }
  isClosed(){ //check if close button pressed
    let higherThanClose = mouseY < game.stats.y+15-20;
    let lowerThanClose = mouseY > game.stats.y+15+11;
    let leftOfClose = mouseX < game.stats.x+game.stats.w-20;
    let rightOfClose = mouseX > game.stats.x+game.stats.w-12+9;
    let isHit = (!higherThanClose && !lowerThanClose && !leftOfClose && !rightOfClose)
    if(mouseIsPressed && isHit){
      game.stats.displayIndex = -1;
    }
  }

  isFlushed(){ //check if toilet circle pressed
    if(mouseIsPressed && dist(mouseX, mouseY,  ((game.stats.x+game.stats.x+game.stats.w)/2-80), game.stats.y+280) <= 50){
      // remove stats display
      game.stats.displayIndex = -1;
      //remove fish
      game.fishArr.splice(this.index, 1);
      //remove stats display
      game.stats.displayIndex = -1;
      // play noise
      if (! flushSound.isPlaying() ) { // .isPlaying() returns a boolean
        flushSound.play();
      }
    }
  }
}

function preload(){
  //font
  fishFont = loadFont('font/FISH.TTF');
  // fish stats images
  rarityImg = loadImage('images/rarity.png');
  heartImg = loadImage('images/heart.png');
  cashImg = loadImage('images/cash.png');
  sellImg = loadImage('images/sell.png');
  closeImg = loadImage('images/close.png');
  //fish images
  commonFishImgArr = [loadImage('images/commonFish1.png'), loadImage('images/commonFish2.png')]
  fishImage = loadImage('images/fish.png')
  //objects
  rockImage = loadImage('images/rock.png')
  waterImage = loadImage('images/water.png')
  grassImage = loadImage('images/grass.png')
  sandImage = loadImage('images/sand.png');
  fishFoodImage = loadImage('images/fishfood.png')
  toiletImage = loadImage('images/toilet.png')
  //sounds
  waterSound = loadSound("sounds/bubbles.mp3")
  sellSound = loadSound("sounds/sell.mp3")
  flushSound = loadSound("sounds/flush.mp3")
}



function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  game = new Game();
  game.fishArr.push(new Fish("Gold Fish", 10, 0));
  noiseDetail(24);

  // objects and array used to hold button info

  var waterObject = new Button('waterObj', 'water', waterImage, 0, false)
  var sandObject = new Button('sandObject', 'sand', sandImage, .10, false)
  var rockObject = new Button('rockObject', 'rock', rockImage, 2.50, false)
  var grassObject = new Button('grassObject', 'grass', grassImage, 2.50, false)
  var fishObject = new Button('fishObject', 'fish', fishImage, 10, true)
  var fishFoodObject = new Button('fishFoodObject', 'food', fishFoodImage, 1, false)
  buttonArray = [waterObject, sandObject, rockObject, grassObject, fishObject, fishFoodObject]
}

function draw() {
  imageMode(CENTER)
  if(game.scene === "tank"){
      game.drawTank();
  }
  else if(game.scene === "store"){
      game.drawStore();
  }
}


// ROCK CLASS
class Rock {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(rockImage, this.x, this.y, 200, 100)
    if (this.y < (height-50)){
      this.y += 1
    }
  }
}

// SAND CLASS

class Sand {
  constructor(x, y){
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(10, 50)
  }
  display(){
      noStroke()
      fill(255,222,173,this.alpha);
      if (this.y <= height-10){
        this.x += this.xSpeed
        this.y += this.ySpeed
      }
      ellipse(this.x, this.y, this.radius, this.radius)
  }
}

// GRASS CLASS
class Grass {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(grassImage, this.x, this.y, 100, 100)
    if (this.y < (height-50)){
      this.y += 1
    }
  }
}

// WATER CLASS
class Water {
  constructor(x, y){
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(10, 25)
  }
  display(){
      noStroke()
      fill(100,200,255,this.alpha);
      this.x += this.xSpeed
      this.y += this.ySpeed
      ellipse(this.x, this.y, this.radius, this.radius)
      this.alpha -=3
      if (this.alpha < 0){
          return 'gone'
      }
      else {
          return 'ok'
      }
  }
}

class Food {
    constructor(x, y){
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(.5, 3)
      this.arrayOfFish = game.fishArr
    }
    display(fishArr){
      noStroke()
      fill(139,69,19,this.alpha);
      if (this.y <= height-10){ // food floats to bottom of tank
        this.y += this.ySpeed
        this.x += this.xSpeed
      }
      ellipse(this.x, this.y, this.radius, this.radius)
      this.alpha -=.1 // food gets absorbed by the water
      // fish moves closer to the fish food if it's hungry
      for (var i=0; i<fishArr.length; i++){
        if (dist(fishArr[i].x, fishArr[i].y, this.x, this.y) >= 1 && fishArr[i].health <= 90 && fishArr.length >= 1){
          if (fishArr[i].x < this.x){
            fishArr[i].x += .1
          }
          else {
            fishArr[i].x -= .1
          }
          if (fishArr[i].y < this.y){
            fishArr[i].y += .1
          }
          else {
            fishArr[i].y -= .1
          }
        }
        if (dist(fishArr[i].x, fishArr[i].y, this.x, this.y) < 1){
          fishArr[i].health +=2
          return 'gone'
        }
      }

      if (this.alpha < 0){
          return 'gone'
      }
      else {
          return 'ok'
      }



    }
  }


// TANK WALLS
function displayTankWalls() {
    stroke(0)
    strokeWeight(10)
    line(0, 0, width, 0)
    line(0, 0, 0, width)
    line(0, height, width, height)
    line(width, 0, width, height)
}

// ENVIRONMENTAL STATS
function displayEnvironmentalStats(){
  fill(0)
   waterLevelMapped = int(map(waterLevel, 0, 500, 1, 100))
  text("Water level: " + waterLevelMapped + "%", width-120, 20 )

   sandLevelMapped = int(map(sandLevel, 0, 200, 1, 100))
  text("Sand level: " + sandLevelMapped + "%", width-120, 60 )

   rockLevelMapped = int(map(rockLevel, 0, 4, 1, 100))
  text("Rock level: " + rockLevelMapped + "%", width-120, 100 )

   grassLevelMapped = int(map(grassLevel, 0, 4, 1, 100));
  text("Grass level: " + grassLevelMapped + "%", width-120, 140 );
}


// display rocks and grass
function mousePressed(){
  if (state == 'rock'&& mouseY >= 200 && buttonArray[2].locked == false){
    var tempRock = new Rock(mouseX, mouseY)
    rockArray.push(tempRock)
    game.balance-=2.50
    if (rockLevel <=3){
      rockLevel +=1
    }
  }
  else if (state == 'grass' && mouseY >= 200 && buttonArray[3].locked == false){
    var tempGrass = new Grass(mouseX, mouseY)
    grassArray.push(tempGrass)
    game.balance-=2.50
    if (grassLevel <=3){
      grassLevel +=1

    }
  }
}

function backgroundFill(r, g, b){
  fill(r, g, b);
  rect(0, 0, canvasWidth, canvasHeight);
}

// MAKE THE WATER BOUNCE
function drawWater() { // https://editor.p5js.org/YiyunJia/sketches/BJz5BpgFm
  backgroundFill(254,254,255);
  fill(100,200,255,200);
  stroke(254,254,255);
  beginShape();  // We are going to draw a polygon out of the wave points
  var xoff = 0; // 2D Noise
  for (var x = 0; x <= width; x += 10) {  // Iterate over horizontal pixels
      var y = map(noise(xoff, yoff), 0, 1, level1, level2);
      vertex(x, y);      // Set the vertex
      xoff += 0.05;      // Increment x dimension for noise
  }
  yoff += 0.005;   // increment y dimension for noise
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

class ToolBar{
  constructor(x, y){
    this.x = x
    this.y = y
    this.buttonX = 50
    this.buttonY = 50
  }

  draw(buttonArray, mouseX, mouseY){
      for (var i=0; i<buttonArray.length; i++){
        noFill()
        strokeWeight(1)
        stroke(0)
        rect(this.buttonX, this.buttonY, 50, 50)
        image(buttonArray[i].image, this.buttonX+25, this.buttonY+25, 25, 25)
        if (buttonArray[i].locked){
          line(this.buttonX, this.buttonY, this.buttonX+50, this.buttonY+50)
          line(this.buttonX+50, this.buttonY, this.buttonX, this.buttonY+50)
        }
        noStroke()
        fill(0)
        textSize(15);
        textAlign(LEFT, TOP);
        text(buttonArray[i].name , this.buttonX, this.buttonY+55)
        this.buttonX += 50
        if (mouseIsPressed && mouseX > this.buttonX-50 && mouseX < this.buttonX && mouseY > this.buttonY && mouseY < this.buttonY + 50) {
          return buttonArray[i].name
        }
          // disable fish until environment is set up
        if (waterLevelMapped && sandLevelMapped && rockLevelMapped && grassLevelMapped == 100){
          buttonArray[4].locked = false
        }

        if (game.balance < buttonArray[i].cost){
          buttonArray[i].locked = true
        }
      }
  }
}

function displayButtons(){
    var toolBar = new ToolBar(mouseX, mouseY)
    tempState = toolBar.draw(buttonArray, mouseX, mouseY)
    if (tempState){
      state = tempState
    }
}


class Button{
  constructor(objectName, name, image, cost, locked){
    this.objectName = objectName
    this.name = name
    this.image = image
    this.cost = cost
    this.locked = locked
    return this.objectName = {
      name: this.name,
      image: this.image,
      cost: this.cost,
      locked: this.locked
    }
  }
}
