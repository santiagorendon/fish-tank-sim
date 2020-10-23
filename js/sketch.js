var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage, sandImage, sellSound, foodImage, toiletImage, flushSound, cursorImage
var sandArray = []
var waterArray = []
var rockArray = []
var grassArray = []
var foodArray = []
var state, tempState
var canvas;

var waterObject;
var sandObject;
var rockObject;
var grassObject;
var fishObject;
var fishFoodObject;
var cursorObject;
var shopObject;
var toiletObject;

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
var fishBeingHit = [0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

class Game{
  constructor(storeItems=[]){
    this.scene = 'tank';
    //this.scene = 'store';
    /* stats */
    this.stats = {displayIndex: -1, background: 'rgba(221,221,221,0.95)', bar: 'rgba(132, 43, 215, 0.6)',x: 770, y: 5, w: 225, h: 315};
    //fish holder
    this.fishArr = [];
    this.balance = 150;
    //store vars
    this.storeItems = storeItems;
    this.storeCloseX = canvasWidth-50;
    this.storeCloseY = 50;
    this.storeCloseD = 70;
    this.storeItemGap = 65;
    this.storeItemOrigX = 85+this.storeItemGap;
    this.storeItemOrigY = 200;
    this.storeItemX = this.storeItemOrigX;
    this.storeItemY = this.storeItemOrigY;
    this.storeItemSize = 110;
    this.counter = 0;
    this.buyDelay = 11;
    this.cursor = waterImage;
  }
  drawBalance(){
    fill(0,0,0);
    textFont(fishFont);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Balance: $" + round(this.balance,2), 48, 25 );
  }
  drawStore(){
    strokeWeight(1);
    this.counter += 1;
    backgroundFill(214, 253, 255);
    fill(0, 0, 0);
    textAlign(LEFT, TOP)
   .textSize(80);
    textFont(fishFont);
    textAlign(CENTER, TOP);
    text('STORE', canvasWidth/2, 10);
    textAlign(LEFT, TOP);
    // textSize(40);
    text(`$${this.balance}`, 60, 10);
    //fill(255,255,255)
    // ellipse(canvasWidth-50, 50, 70, 70);
    image(closeImg, this.storeCloseX, this.storeCloseY, this.storeCloseD, this.storeCloseD);

    this.drawStoreItems();
    this.isStoreClosed();
  }
  drawStoreItems(){
    for(let i=0;i<this.storeItems.length;i++){
      if( (i %5) === 0 && (i!=0)){
        this.storeItemX = this.storeItemOrigX;
        this.storeItemY += this.storeItemSize+110;
      }

      fill(255,255,255)
      //ellipse(this.storeItemX, this.storeItemY, this.storeItemSize, this.storeItemSize);
      image(this.storeItems[i].img, this.storeItemX, this.storeItemY, this.storeItemSize, this.storeItemSize);

      textAlign(CENTER, CENTER);
      fill(0,0,0);
      textSize(25);
      text(`$${this.storeItems[i].price}`, this.storeItemX-5, this.storeItemY+80);
      text(this.storeItems[i].name, this.storeItemX, this.storeItemY-80);
      this.isStoreItemClicked(this.storeItems[i].name, this.storeItemX, this.storeItemY, this.storeItems[i].price, this.storeItems[i].obj);

      this.storeItemX += this.storeItemSize + this.storeItemGap;
    }
    this.storeItemX = this.storeItemOrigX;
    this.storeItemY = this.storeItemOrigY;

    // //ellipse(this.storeItemOrigX, this.storeItemY+210, this.storeItemSize, this.storeItemSize);
    // image(this.storeItems[0].img, this.storeItemOrigX, this.storeItemY+230, this.storeItemSize, this.storeItemSize);
    // text(`$${15}`, this.storeItemX-5, this.storeItemY+210+110);
    //
    // //ellipse(this.storeItemOrigX, this.storeItemY+210+210, this.storeItemSize, this.storeItemSize);
    // image(this.storeItems[0].img, this.storeItemOrigX, this.storeItemY+230+210, this.storeItemSize, this.storeItemSize);
    // text(`$${15}`, this.storeItemX-5, this.storeItemY+210+210+110);
  }
  isStoreItemClicked(name, x, y, price, obj){
    let isHit = (dist(mouseX, mouseY, x, y) <= (this.storeItemSize/2))
    if((this.balance >= price) && (mouseIsPressed) && (this.counter >= this.buyDelay) && (isHit)){
      if(name === 'Toilet'){//if toilet is added add it to index 2
        buttonArray.splice(2, 0, obj);
      }
      else{
        buttonArray.push(obj)
      }
      this.balance -= price;
      this.counter = 0;
    }
  }
  isStoreClosed(){
    if((dist(mouseX, mouseY, this.storeCloseX, this.storeCloseY) <= this.storeCloseD/2) && mouseIsPressed){
      this.scene = 'tank';
    }
  }
  drawFish(){
    for(let i=0; i < this.fishArr.length; i++){
      // this.fishArr[i].index = i;
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
    if (mouseIsPressed && state=='sand' && mouseY >= 200){
      var tempSand = new Sand(mouseX, mouseY)
      sandObject.quantity-=0.1;
      sandArray.push(tempSand)
      if(sandLevel<=200){
        sandLevel +=1
      }
    }

    // check if any fish is being selected
    for(let i=0; i < game.fishArr.length;i++){
      let isHit = dist(mouseX, mouseY, game.fishArr[i].x, game.fishArr[i].y) <= (game.fishArr[i].hitBox/2)
      if(isHit){
        fishBeingHit[i] = 1;
      }
      else{
        fishBeingHit[i] = 0;
      }
    }
    //make sure the player is not hovering over the fish when they feed them
    if((fishBeingHit.reduce(reducer) <= 0) && mouseIsPressed && state=='food' && mouseY >= 200){
      var tempFood = new Food(mouseX, mouseY)
      fishFoodObject.quantity-=0.1;
      foodArray.push(tempFood)
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
    if(game.stats.displayIndex != -1 && (game.cursor === cursorImage || game.cursor === fishFoodImage) && (game.scene !== 'store')){
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
  constructor(type, rarity, hitBox, index){
    this.index = index;
    this.type = type;
    //stats
    this.rarity = rarity;
    this.health = 100;
    // this.startingPrice = 15;
    this.price = 15;
    this.age = 0;
    this.alive = true;
    this.width = 100;
    this.height = 100;
    this.hitBox = hitBox;
    this.x = random(0, width)
    this.y = random(0, height)
    this.frameDelay = 25;
    this.frameCount = 0;
    this.frame = 0;
    this.frameNum = 2;
    // create a "noise offset" to keep track of our position in Perlin Noise space
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
    //flush vars
    this.flushCounter = 0;
    this.flushDelay = 11;
  }
  draw(){
    this.flushCounter += 1;
    // strokeWeight(1);
    // fill('white')
    // ellipse(this.x, this.y, this.hitBox, this.hitBox)
    if(this.type === "Gold Fish"){
      image(commonFishImgArr[this.frame], this.x, this.y, this.width, this.height);
    }

    // fish price varies depending on health
    // this.price = round(((this.health/100) * this.startingPrice), 2)
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
    if(mouseIsPressed && isHit && (game.cursor === cursorImage || game.cursor === fishFoodImage)){
      game.stats.displayIndex = this.index;
      return true;
    }
    else if(mouseIsPressed && isHit && (state === 'toilet')){
      console.log(isHit);
      if(this.flushCounter >= this.flushDelay){ //prevent flush spamming
        this.flush();
        this.flushCounter = 0;
      }

    }
    return false;
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
    text(`(${int(this.health)}/100)`, game.stats.x+129, game.stats.y+91);

    image(rarityImg, game.stats.x+40, game.stats.y+155, 100, 100);
    fill(game.stats.bar);
    let rarityW = map(this.rarity, 0, 100, 0, 135);
    rect(game.stats.x+65, game.stats.y+145, rarityW, 25);
    fill(0, 0, 0);
    text(`(${this.rarity}/100)`, game.stats.x+129, game.stats.y+148);

    image(cashImg, game.stats.x+40, game.stats.y+210, 70, 70);
    //rect(game.stats.x+65, game.stats.y+202, 135, 25);
    text(`${this.price}`, game.stats.x+129, game.stats.y+201);

    image(sellImg, (game.stats.x+game.stats.x+game.stats.w)/2+10, game.stats.y+280, 150, 150);
    // ellipse((game.stats.x+game.stats.x+game.stats.w)/2-80, game.stats.y+280, 60, 60);

    //add event listeners
    this.isClosed();
    this.isSold();
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
      //reindex
      for(let i=0; i < game.fishArr.length; i++){
        game.fishArr[i].index = i;
      }
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

  flush(){ //check if toilet circle pressed
    // remove stats display
    game.stats.displayIndex = -1;
    //remove fish
    game.fishArr.splice(this.index, 1);
    //reindex
    for(let i=0; i < game.fishArr.length; i++){
      game.fishArr[i].index = i;
    }
    // play noise
    if (! flushSound.isPlaying() ) {
      flushSound.play();
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
  cursorImage = loadImage('images/cursor.png')
  shopImage = loadImage('images/shop.png')
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

  waterObject = new Button('water', waterImage, 100, 100)
  sandObject = new Button('sand', sandImage, 100, 100)
  toiletObject = new Button('toilet', toiletImage, 100, 100)
  rockObject = new Button('rock', rockImage, 3, 3)
  grassObject = new Button('grass', grassImage, 3, 3)
  fishObject = new Button('fish', fishImage, 4, 4)
  fishFoodObject = new Button('food', fishFoodImage, 50, 50)
  cursorObject = new Button('cursor', cursorImage, 1000)
  shopObject = new Button('shop', shopImage, 1000)
  buttonArray = [cursorObject, shopObject, waterObject, fishObject]

  let storeItems = [{name:'Common Food', img: fishFoodImage, obj: fishFoodObject, price: '15'},
                    {name:'Toilet', obj: toiletObject, img: toiletImage, price: '15'},
                    {name:'Grass', obj: grassObject, img: grassImage, price: '15'},
                    {name:'Rock', obj: rockObject, img: rockImage, price: '15'},
                    {name:'Sand', obj: sandObject, img: sandImage, price: '15'},


                  ]
    game = new Game(storeItems);
  // game.fishArr.push(new Fish("Gold Fish", 10, 0));
  noiseDetail(24);

  // objects and array used to hold button info


}

function draw() {
  imageMode(CENTER)
  if(game.scene === "tank"){
      game.drawTank();
  }
  else if(game.scene === "store"){
      game.drawStore();
  }
  noCursor();
  image(game.cursor, mouseX, mouseY, 20, 20);
}


// ROCK CLASS
class Rock {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(rockImage, this.x, this.y, 100, 100)
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
    constructor(x, y, healthIncrease=2){
      this.x = x
      this.y = y
      this.xSpeed = random(-0.5, 0.5)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(.5, 3)
      this.arrayOfFish = game.fishArr
      this.disolveSpeed = 4;
      this.healthIncrease = healthIncrease;
    }
    display(fishArr){
      noStroke()
      fill(139,69,19,this.alpha);
      if (this.y <= height-10){ // food floats to bottom of tank
        this.y += this.ySpeed
        this.x += this.xSpeed
      }
      ellipse(this.x, this.y, this.radius, this.radius)
      this.alpha -=this.disolveSpeed // food gets absorbed by the water
      for (var i=0; i<fishArr.length; i++){
        if(dist(this.x, this.y, fishArr[i].x, fishArr[i].y) < (fishArr[i].hitBox/2)){
          fishArr[i].health +=this.healthIncrease;
          game.stats.displayIndex = i;
          return 'gone';
        }
      }

      // fish moves closer to the fish food if it's hungry
      // for (var i=0; i<fishArr.length; i++){
      //   if (dist(fishArr[i].x, fishArr[i].y, this.x, this.y) >= 1 && fishArr[i].health <= 90 && fishArr.length >= 1 && fishArr[i].health >= 1){
      //     if (fishArr[i].x < this.x){
      //       fishArr[i].x += .01
      //     }
      //     else {
      //       fishArr[i].x -= .01
      //     }
      //     if (fishArr[i].y < this.y){
      //       fishArr[i].y += .01
      //     }
      //     else {
      //       fishArr[i].y -= .01
      //     }
      //   }
      //   if (dist(fishArr[i].x, fishArr[i].y, this.x, this.y) < 1){
      //     fishArr[i].health +=2
      //     return 'gone'
      //   }
      // }

      if (this.alpha < 0){
          return 'gone'
      }
      return 'ok'
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
  if (state == 'rock'&& mouseY >= 200){
    var tempRock = new Rock(mouseX, mouseY)
    rockObject.quantity -= 1;
    rockArray.push(tempRock)
    if (rockLevel <=3){
      rockLevel +=1
    }
  }
  else if (state == 'grass' && mouseY >= 200){
    var tempGrass = new Grass(mouseX, mouseY)
    grassObject.quantity -= 1;
    grassArray.push(tempGrass)
    if (grassLevel <=3){
      grassLevel +=1

    }
  }
  // ADD FISH
  else if (mouseIsPressed && state=='fish' && mouseY >= 200){
    fishBeingHit.push(0);
    game.fishArr.push(new Fish("Gold Fish", 10, 60, game.fishArr.length));
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
        if(buttonArray[i].quantity <= 0){
          game.cursor = cursorImage;
          state = 'cursor';
          buttonArray.splice(i, 1);
          return;
        }
        noFill()
        strokeWeight(1)
        stroke(0)
        rect(this.buttonX, this.buttonY, 50, 50)
        image(buttonArray[i].image, this.buttonX+25, this.buttonY+25, 25, 25)

        noStroke()
        fill(0)
        textSize(15);
        textAlign(CENTER, TOP);
        if(buttonArray[i].name !== 'cursor' && buttonArray[i].name !== 'shop' && buttonArray[i].name !== 'toilet'){
          text(`${int(buttonArray[i].quantity)}/${buttonArray[i].max}` , (this.buttonX+25), this.buttonY+55)
        }
        else{
          text(buttonArray[i].name , (this.buttonX+25), this.buttonY+55)
        }

        this.buttonX += 50
        if (mouseIsPressed && mouseX > this.buttonX-50 && mouseX < this.buttonX && mouseY > this.buttonY && mouseY < this.buttonY + 50) {
          if(buttonArray[i].name === 'shop'){
            game.cursor = cursorImage;
            game.scene='store';
            return 'cursor';
          }
          game.cursor = buttonArray[i].image;
          return buttonArray[i].name
        }
      }
  }
}

function displayButtons(){
    var toolBar = new ToolBar(mouseX, mouseY)
    tempState = toolBar.draw(buttonArray, mouseX, mouseY);
    if (tempState){
      state = tempState
    }
}


class Button{
  constructor(name, image, quantity=0, max=0){
    this.name = name;
    this.image = image;
    this.quantity = quantity;
    this.max = max;
  }
}
