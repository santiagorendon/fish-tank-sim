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
var commonEggObject;
var rareEggObject;
var legendaryEggObject;
var fishFoodObject;
var rareFishFoodObject;
var legendaryFishFoodObject;
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
var fishBeingHit = [];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

class Game{
  constructor(storeItems=[]){
    this.scene = 'tank';
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
    //flush
    this.flushCounter = 0;
    this.flushDelay =11;
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
      // do not sell items if they have more tthan 1000
      if(game.storeItems[i].name !== 'Toilet'){
        if(this.storeItems[i].obj.quantity >= 1000){
          game.storeItems[i].soldOut = true;
        }
        else{
          game.storeItems[i].soldOut = false;
        }
      }
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

      text(this.storeItems[i].name, this.storeItemX, this.storeItemY-80);
      if(this.storeItems[i].soldOut){
        text('Sold Out', this.storeItemX-5, this.storeItemY+80);
        strokeWeight(5);
        line(this.storeItemX-(this.storeItemSize/2), this.storeItemY-(this.storeItemSize/2), this.storeItemX+(this.storeItemSize/2), this.storeItemY+(this.storeItemSize/2));
        line(this.storeItemX+(this.storeItemSize/2), this.storeItemY-(this.storeItemSize/2), this.storeItemX-(this.storeItemSize/2), this.storeItemY+(this.storeItemSize/2));
        strokeWeight(1);
      }
      else{
        text(`$${this.storeItems[i].price}`, this.storeItemX-5, this.storeItemY+80);
        //add event listener if not sold out
        this.isStoreItemClicked(i);
      }
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
  isStoreItemClicked(index){
    let name = game.storeItems[index].name;
    let obj = game.storeItems[index].obj;
    let price = game.storeItems[index].price;
    let isHit = (dist(mouseX, mouseY, this.storeItemX, this.storeItemY) <= (this.storeItemSize/2))
    if((this.balance >= price) && (mouseIsPressed) && (this.counter >= this.buyDelay) && (isHit)){
      let alreadyOwned = buttonArray.indexOf(obj) !== -1;
      if(name === 'Toilet'){//if toilet is added add it to index 2
        buttonArray.splice(2, 0, obj);
        game.storeItems[index].soldOut = true;
      }
      else{ //if any item is added besides toilet
        if(alreadyOwned){
          obj.quantity = obj.quantity + obj.originalMax;
          obj.max = obj.quantity;
        }
        else{
          obj.quantity = obj.max;
          buttonArray.push(obj)
        }
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
      this.fishArr[i].draw();
    }
  }
  drawTank(){
    game.flushCounter += 1;//counts between flushes
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
      let isHit = dist(mouseX, mouseY, game.fishArr[i].x+game.fishArr[i].hitBoxXOf, game.fishArr[i].y+game.fishArr[i].hitBoxYOf) <= (game.fishArr[i].hitBox/2)
      if(isHit){
        fishBeingHit[i] = 1;
      }
      else{
        fishBeingHit[i] = 0;
      }
    }
    let fishIsHit = (fishBeingHit.indexOf(1) !== -1);
    let fishHitIndex = fishBeingHit.indexOf(1);
    if(mouseIsPressed && fishIsHit){ //if fish is clicked
      //if cursor is selector or food
      if((game.cursor === cursorImage || game.cursor === fishFoodImage || game.cursor === rareFishFoodImage || game.cursor === legendaryFishFoodImage)){
        game.stats.displayIndex = fishHitIndex; //display stats
      }
      //if cursor is toilet
      else if(state === 'toilet'){
        if(game.flushCounter  >= this.flushDelay){//prevent overlapping fish from being flushed
          game.fishArr[fishHitIndex].flush(fishHitIndex); //flush fish
          game.flushCounter = 0;
        }
      }
    }
    //make sure the player is not hovering over the fish when they feed them
    if(!fishIsHit && mouseIsPressed && state=='food' && mouseY >= 200){
      var tempFood = new Food(mouseX, mouseY)
      fishFoodObject.quantity-=0.1;
      foodArray.push(tempFood)
    }
    if(!fishIsHit && mouseIsPressed && state=='food2' && mouseY >= 200){
      var tempFood = new Food(mouseX, mouseY, 4)
      rareFishFoodObject.quantity-=0.1;
      foodArray.push(tempFood)
    }
    if(!fishIsHit && mouseIsPressed && state=='food3' && mouseY >= 200){
      var tempFood = new Food(mouseX, mouseY, 8)
      legendaryFishFoodObject.quantity-=0.1;
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
    if(game.stats.displayIndex != -1 && (game.cursor === cursorImage || game.cursor === fishFoodImage || game.cursor === rareFishFoodImage || game.cursor === legendaryFishFoodImage) && (game.scene !== 'store')){
      game.fishArr[game.stats.displayIndex].drawStats();
    }
  }
}


function crackLegendaryEgg(){
  let offSpringRarity = Math.floor(random(85, 100));
  if(offSpringRarity >= 95){
    return ['S', offSpringRarity];
  }
  return ['A', offSpringRarity];
}

function crackRareEgg(){
  let offSpringRarity = Math.floor(random(50, 85));
  if(offSpringRarity >= 70){
    return ['B', offSpringRarity];
  }
  return ['C', offSpringRarity];
}

function crackCommonEgg(){
  let offSpringRarity = Math.floor(random(0, 50));
  if(offSpringRarity >= 25){
    return ['D',offSpringRarity];
  }
  return ['F', offSpringRarity];
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

class Fish{
  constructor(type, imageArray, w, h, rarity, frameNum=2, frameDelay=25, hitBox, xOf=0, yOf=0){
    this.type = type;
    //stats
    this.rarity = rarity;
    this.health = 100;
    // this.startingPrice = 15;
    this.price = 15;
    this.age = 0;
    this.alive = true;
    this.width = w;
    this.height = h;
    this.hitBox = hitBox;
    this.hitBoxXOf = xOf;
    this.hitBoxYOf = yOf;
    this.x = random(0, width)
    this.y = random(0, height)
    this.frameDelay = frameDelay;
    this.frameCount = 0;
    this.frame = 0;
    this.frameNum = frameNum;
    // create a "noise offset" to keep track of our position in Perlin Noise space
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
    this.xMovement = 0;
    this.yMovement = 0;
    this.imageArray = imageArray;
  }
  drawHitBox(){
    strokeWeight(1);
    fill('rgba(0,255,0,0.1)')
    ellipse(this.x+this.hitBoxXOf, this.y+this.hitBoxYOf, this.hitBox, this.hitBox)
  }
  draw(){
    //this.drawHitBox();
    if(this.xMovement > 0){ //fish moving right
      image(this.imageArray[1][this.frame], this.x, this.y, this.width, this.height);
    }
    else{//fish moving left
      image(this.imageArray[0][this.frame], this.x, this.y, this.width, this.height);
    }


    // fish price varies depending on health
    // this.price = round(((this.health/100) * this.startingPrice), 2)
    this.price = constrain(this.price, 0, 100000)


    // fish progressively loses health
    this.health = constrain(this.health, 1, 100)
    this.health -=.01
    this.health = round(this.health, 2)

    // fish progressively ages
    //this.age += .0001

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
      this.xMovement = map( noise(this.xNoiseOffset), 0, 1, -3, 3 );
      this.yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1);
      this.x += this.xMovement;
      this.y += this.yMovement;
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
    //this.isClicked();
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
      game.fishArr.splice(game.stats.displayIndex, 1);
      fishBeingHit.splice(game.stats.displayIndex, 1);
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

  flush(index){ //check if toilet circle pressed
    // remove stats display
    game.stats.displayIndex = -1;
    //remove fish
    game.fishArr.splice(index, 1);
    fishBeingHit.splice(index, 1);
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
  commonFishImgArr = [[loadImage('images/commonFish/commonFish1.png'), loadImage('images/commonFish/commonFish2.png')], [loadImage('images/commonFish/commonFish3.png'), loadImage('images/commonFish/commonFish4.png')]]
  legendaryFishImgArr = [[
    loadImage('images/legendaryFish/legendaryFish1.png'),
    loadImage('images/legendaryFish/legendaryFish2.png'),
    loadImage('images/legendaryFish/legendaryFish3.png'),
    loadImage('images/legendaryFish/legendaryFish4.png'),
    loadImage('images/legendaryFish/legendaryFish5.png'),
    loadImage('images/legendaryFish/legendaryFish6.png'),
  ],
  [
    loadImage('images/legendaryFish/legendaryFish7.png'),
    loadImage('images/legendaryFish/legendaryFish8.png'),
    loadImage('images/legendaryFish/legendaryFish9.png'),
    loadImage('images/legendaryFish/legendaryFish10.png'),
    loadImage('images/legendaryFish/legendaryFish11.png'),
    loadImage('images/legendaryFish/legendaryFish12.png')
  ]];
  //fish eggs
  commonEggImage = loadImage('images/commonEgg.png');
  rareEggImage = loadImage('images/rareEgg.png');
  legendaryEggImage = loadImage('images/legendaryEgg.png');
  //objects
  rockImage = loadImage('images/rock.png')
  waterImage = loadImage('images/water.png')
  grassImage = loadImage('images/grass.png')
  sandImage = loadImage('images/sand.png');
  fishFoodImage = loadImage('images/fishFood/fishfood.png')
  rareFishFoodImage = loadImage('images/fishFood/rareFishFood.png')
  legendaryFishFoodImage = loadImage('images/fishFood/legendaryFishFood.png')
  toiletImage = loadImage('images/toilet.png')
  cursorImage = loadImage('images/cursor.png')
  shopImage = loadImage('images/shop.png')
  //sounds
  waterSound = loadSound("sounds/bubbles.mp3")
  sellSound = loadSound("sounds/sell.mp3")
  flushSound = loadSound("sounds/flush.mp3")
}



function setup() {
  state = 'water'
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');

  // theCanvas = document.querySelector('canvas');
  //smooth out the image
  // context = theCanvas.getContext('2d');
  // context.webkitImageSmoothingEnabled = false;
  // context.mozImageSmoothingEnabled = false;
  // context.imageSmoothingEnabled = false;

  waterObject = new Button('water', waterImage, 100, 100)
  sandObject = new Button('sand', sandImage, 100, 100)
  toiletObject = new Button('toilet', toiletImage, 100, 100)
  rockObject = new Button('rock', rockImage, 3, 3)
  grassObject = new Button('grass', grassImage, 3, 3)
  commonEggObject = new Button('commonEgg', commonEggImage, 1, 1)
  rareEggObject = new Button('rareEgg', rareEggImage, 1, 1)
  legendaryEggObject = new Button('legendaryEgg', legendaryEggImage, 1, 1)
  fishFoodObject = new Button('food', fishFoodImage, 50, 50)
  rareFishFoodObject = new Button('food2', rareFishFoodImage, 50, 50)
  legendaryFishFoodObject = new Button('food3', legendaryFishFoodImage, 50, 50)

  cursorObject = new Button('cursor', cursorImage, 1000)
  shopObject = new Button('shop', shopImage, 1000)
  buttonArray = [cursorObject, shopObject, waterObject, commonEggObject]

  let storeItems = [{name:'Common Food', img: fishFoodImage, obj: fishFoodObject, price: '15', soldOut: false},
                    {name:'Rare Food', img: rareFishFoodImage, obj: rareFishFoodObject, price: '15', soldOut: false},
                    {name:'Legendary Food', img: legendaryFishFoodImage, obj: legendaryFishFoodObject, price: '15', soldOut: false},
                    {name:'Toilet', obj: toiletObject, img: toiletImage, price: '15', soldOut: false},
                    {name:'Grass', obj: grassObject, img: grassImage, price: '15', soldOut: false},
                    {name:'Rock', obj: rockObject, img: rockImage, price: '15', soldOut: false},
                    {name:'Sand', obj: sandObject, img: sandImage, price: '15', soldOut: false},
                    {name:'Common Egg', obj: commonEggObject, img: commonEggImage, price: '15', soldOut: false},
                    {name:'Rare Egg', obj: rareEggObject, img: rareEggImage, price: '15', soldOut: false},
                    {name:'Legendary Egg', obj: legendaryEggObject, img: legendaryEggImage, price: '15', soldOut: false}

                  ]
  game = new Game(storeItems);
  noiseDetail(24);
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
        if(dist(this.x, this.y, fishArr[i].x+fishArr[i].hitBoxXOf, fishArr[i].y+fishArr[i].hitBoxYOf) < (fishArr[i].hitBox/2)){
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
  else if (mouseIsPressed && state=='commonEgg' && mouseY >= 200){
    fishBeingHit.push(0);
    let newFish = crackCommonEgg();
    let rarity = newFish[1];
    //name width height rarity hitbox frames framedelay
    game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 2, 25, 60));
  }
  // ADD FISH
  else if (mouseIsPressed && state=='rareEgg' && mouseY >= 200){
    fishBeingHit.push(0);
    let newFish = crackRareEgg();
    let rarity = newFish[1];
    game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 6, 20, 60));
  }
  else if (mouseIsPressed && state=='legendaryEgg' && mouseY >= 200){
    fishBeingHit.push(0);
    let newFish = crackLegendaryEgg();
    let rarity = newFish[1];
    game.fishArr.push(new Fish("Aqua", legendaryFishImgArr, 300, 300, rarity, 6, 8, 80, -10, -30));
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
    this.x = x;
    this.y = y;
    this.buttonX = 50;
    this.buttonY = 50;
    this.highlightColor = 'rgba(255, 152, 100, 0.8)'
  }

  draw(buttonArray, mouseX, mouseY){
      for (var i=0; i<buttonArray.length; i++){
        if(buttonArray[i].quantity < 1){ //if tool runs out of uses
          game.cursor = cursorImage;
          state = 'cursor';
          buttonArray.splice(i, 1);
          return;
        }
        noFill()
        strokeWeight(1)
        stroke(0)
        //if tool is currently selected
        if(buttonArray[i].name === state){
          fill(this.highlightColor);
          rect(this.buttonX, this.buttonY, 50, 50);
        }
        image(buttonArray[i].image, this.buttonX+25, this.buttonY+25, 30, 30)

        noStroke()
        fill(0)
        textSize(15);
        textAlign(CENTER, TOP);
        if(buttonArray[i].name !== 'cursor' && buttonArray[i].name !== 'shop' && buttonArray[i].name !== 'toilet'){
          text(`${int(buttonArray[i].quantity)}/${int(buttonArray[i].max)}` , (this.buttonX+25), this.buttonY+55)
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
    this.originalMax = max;
  }
}
