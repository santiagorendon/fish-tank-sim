// IMAGES
var fishImage, waterImage, grassImage, sandImage, foodImage, toiletImage, cursorImage

// SOUNDS
var waterSound, sellSound, flushSound

// ARRAYS
var sandArray = []
var waterArray = []
var decorationArray = []
var bubblesArray = []
var coinArray = []
var foodArray = []
var buttonArray
var fishBeingHit = [];
var coinArr = [];

// OBJECTS
var waterObject, sandObject, rockObject, treasureObject, grassObject, commonEggObject, rareEggObject, legendaryEggObject, fishFoodObject, rareFishFoodObject, legendaryFishFoodObject, cursorObject, shopObject, breedObject, toiletObject


// MISC
var counter = 0;
var maxCounter = 35;
var findBarrelPosition;
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



// main game play
class Game{
  constructor(storeItems=[]){
    // this.scene = 'menu';
    this.scene = 'tank';
    //fish holder
    this.fishArr = [];
    this.balance = 10008;
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
    this.clickCounter = 0;
    this.clickDelay =11;
    //menu text
    this.angle = 0;
    this.rotationSpeed = 0.35;
    this.rotationMax = 10;
    this.subtitleColor = [random(0,255),random(0,255),random(0,255)];
    this.textSize = 32;
    this.textSizeMin= 30;
    this.textSizeMax = 35;
    this.textSizeIncSpeed = 0.1;
    // stats vars
    this.stats = {displayIndex: -1, background: 'rgba(221,221,221,0.95)', bar: 'rgba(132, 43, 215, 0.6)',x: 770, y: 5, w: 225, h: 315};
    //breed stats vars
    this.breedStats = {background: 'rgba(221,221,221,0.95)', bar: 'rgba(132, 43, 215, 0.6)', x: 658, y:5, w: 337, h: 236}
    this.displayBreed = false;
    let rarity =80;
    this.parent1 = 0;
    this.parent2 = 0;
    this.lastParent = 0;
  }
  drawBreedStats(){ // draw the stats for breeding two fish together
    textAlign(CENTER, CENTER);
    let alreadyOwned = buttonArray.indexOf(mysteryEggObject) !== -1;
    let middleX = game.breedStats.x+(game.breedStats.w/2);
    let middleY = (game.breedStats.y+game.breedStats.h)/2;
    //background
    fill(game.breedStats.background);
    strokeWeight(1);
    rect(game.breedStats.x ,game.breedStats.y ,game.breedStats.w ,game.breedStats.h );
    //CLOSE Button
    image(closeImg, game.breedStats.x+game.breedStats.w-12, game.breedStats.y+15, 20, 20);
    this.breedIsClosed();
    if(alreadyOwned){
      fill('black')
      textSize(20);
      image(mysteryEggImage, middleX, middleY-20, 100, 100);
      text('Please hatch your current egg\nbefore you breed again.', middleX ,middleY+60)
      return
    }
    fill('black')
    //draw parent 1
    if(this.parent1){
      textSize(30);
      text(this.parent1.type, (game.breedStats.x+middleX)/2, middleY-75);
      image(this.parent1.imageArray[1][0], (game.breedStats.x+middleX)/2-this.parent1.hitBoxXOf, middleY-15-this.parent1.hitBoxYOf, this.parent1.width, this.parent1.height);
      image(rarityImg, (game.breedStats.x+middleX)/2-55, middleY+65, 80, 80);
      fill(game.breedStats.bar);
      let parent1RarityW = map(this.parent1.rarity, 0, 100, 0, 92);
      rect(game.breedStats.x+50, middleY+53, parent1RarityW, 25);
      fill(255,255,255,0);
      rect(game.breedStats.x+50, middleY+53, 92, 25);
      fill(0, 0, 0);
      textSize(20);
      text(`(${this.parent1.rarity}/100)`, (game.breedStats.x+middleX)/2+15, middleY+65);
    }
    //draw parent 2 and heart
    if(this.parent2){
      //breed button
      textSize(20);
      text('Breed', middleX ,middleY+20)
      image(heartImg, middleX+3, middleY, 100, 100);
      textSize(30);
      text(this.parent2.type, (middleX+canvasWidth)/2, middleY-75);
      image(this.parent2.imageArray[0][0], (middleX+canvasWidth)/2-this.parent2.hitBoxXOf, middleY-15-this.parent2.hitBoxYOf, this.parent2.width, this.parent2.height);
      image(rarityImg, (middleX+canvasWidth)/2-55, middleY+65, 80, 80);
      fill(game.breedStats.bar);
      let parent2RarityW = map(this.parent2.rarity, 0, 100, 0, 92);
      rect(middleX+50, middleY+53, parent2RarityW, 25);
      fill(255,255,255,0);
      rect(middleX+50, middleY+53, 92, 25);
      fill(0, 0, 0);
      textSize(20);
      text(`(${this.parent2.rarity}/100)`, (middleX+canvasWidth)/2+15, middleY+65);
    }
    else{
      text('Please select\n another parent',  (middleX+canvasWidth)/2, middleY)
      fill('black');
      line(middleX, game.breedStats.y,middleX ,game.breedStats.y+game.breedStats.h);

    }
    textAlign(CENTER, TOP);
    this.breedIsPressed(middleX, middleY);
  }
  breedIsPressed(middleX, middleY){ // click the breed button
    if(mouseIsPressed && dist(mouseX, mouseY, middleX, middleY-5) <= 20){
      if(this.parent1.alive && this.parent2.alive){
        createMysteryEgg(this.parent1.rarity, this.parent1.rarity);
      }
      this.parent1 = 0;
      this.parent2 = 0;
      this.lastParent = 0;
      this.displayBreed = false;
    }
  }
  breedIsClosed(){ // close the breed panel
    if(mouseIsPressed && dist(mouseX, mouseY, game.breedStats.x+game.breedStats.w-12, game.breedStats.y+15) < 10){
      this.parent1 = 0;
      this.parent2 = 0;
      this.lastParent = 0;
      this.displayBreed = false;
    }
  }
  drawBalance(){ // draw game balance
    noStroke()
    fill(0,0,0);
    textFont(fishFont);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Balance: $" + round(this.balance,2), 48, 25 );
  }
  drawStore(){ // main function for drawing the store
    strokeWeight(1);
    this.counter += 1;
   backgroundFill(214, 253, 255,200);
   fill(0, 0, 0);
   textAlign(LEFT, TOP)
   .textSize(80);
   textFont(fishFont);
   textAlign(CENTER, TOP);
   text('STORE', canvasWidth/2, 10);
   textAlign(LEFT, TOP);
   text(`$${this.balance}`, 60, 10);
   image(closeImg, this.storeCloseX, this.storeCloseY, this.storeCloseD, this.storeCloseD);
   this.drawStoreItems();
   this.isStoreClosed();
  }
  drawStoreItems(){ // add the items in the store
    for(let i=0;i<this.storeItems.length;i++){
      // do not sell items if they have more than 1000
      if(game.storeItems[i].name !== 'Toilet' && game.storeItems[i].name !== 'Treasure'){
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
  }
  isStoreItemClicked(index){ // clicking a store item
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
      else if(name === 'Treasure'){//treasures
        buttonArray.push(obj);
        game.storeItems[index].soldOut = true;
      }
      else{ //if any item is added besides toilet or treasure
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
  isStoreClosed(){ // close the store
    if((dist(mouseX, mouseY, this.storeCloseX, this.storeCloseY) <= this.storeCloseD/2) && mouseIsPressed){
      state = 'cursor';
      this.scene = 'tank';
    }
  }
  drawFish(){ // draw fish
    for(let i=0; i < this.fishArr.length; i++){
      this.fishArr[i].draw();
    }
  }
  drawMenuText(){ // pre-game loading screen
    textFont(fishFont)
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    fill('black')
    textSize(75);
    text('Fish Tank Simulator', canvasWidth/2, canvasHeight/2-40);
    if(this.textSize >= this.textSizeMax || this.textSizeMin >= this.textSize){
      this.textSizeIncSpeed = -this.textSizeIncSpeed;
      this.textCounter = 0;
    }
    this.textSize += this.textSizeIncSpeed;
    textSize(this.textSize);
    push();
    translate(canvasWidth/2, canvasHeight/2+100)
    rotate(radians(this.angle));
    fill(this.subtitleColor[0], this.subtitleColor[1], this.subtitleColor[2]);
    text('*Fill Tank to Start Game*', 0, 0);
    this.angle += this.rotationSpeed;
    pop();
    if(this.angle > this.rotationMax || this.angle < -this.rotationMax){
      this.subtitleColor = [random(0,255),random(0,255),random(0,255)];
      this.rotationSpeed = -this.rotationSpeed;
    }
  }
  drawMainMenu(){
    // FILL TANK
    drawWater();
    if (mouseIsPressed && state == 'water'){
      drawWater();
      if (waterLevel<=500){
        waterLevel +=1
      }
      if (level2>50){
        if (! waterSound.isPlaying() ) { // .isPlaying() returns a boolean
          waterSound.play();
        }
      }
      level1 -= 3; // how fast to fill the tank
      level2 -= 3;
      var drop = new Water(mouseX, mouseY);
      waterArray.push(drop)
    }
    for (var i = waterArray.length-1; i >= 0; i--) { // display and remove water particles
      let check = waterArray[i].display()
      if (check == 'gone'){
        waterArray.splice(i, 1)
        i-=1
      }
    }
    displayTankWalls() // walls of the tank
    waterLevelMapped = int(map(waterLevel, 0, 250, 1, 100)) // finish filling the tank?
    if (waterLevelMapped==100){
      if (waterSound.isPlaying() ) { // .isPlaying() returns a boolean
        waterSound.pause();
      }
      game.state = cursor;
      game.cursor = cursorImage;
      game.scene = 'tank'
    }
    this.drawMenuText();
  }
  drawTank(){
    let alreadyOwned = buttonArray.indexOf(mysteryEggObject) !== -1;
    if(alreadyOwned){
      if (frameCount % 60 == 0 && mysteryEggObject.hatchTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        mysteryEggObject.hatchTimer -= 1;
      }
    }
    game.clickCounter += 1;
    backgroundFill(100,200,255);
    drawFloor();

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
      else if(game.cursor === breedImage && game.clickCounter  >= this.clickDelay && game.fishArr[fishHitIndex].alive){
        this.clickCounter = 0;
        //only one parent is chosen and u cant choose same parent twice
        if(game.parent1 !== game.fishArr[fishHitIndex] && (game.parent1 && !game.parent2)){
          this.lastParent = 2;
          game.parent2 = game.fishArr[fishHitIndex];
        }
        //you cant choose same parent twice both parents chosen or only one chosen
        else if((game.parent1 !== game.fishArr[fishHitIndex] && game.parent2 !== game.fishArr[fishHitIndex]) && (game.parent1 && game.parent2) || !game.parent1){
          if(this.lastParent === 0 || this.lastParent === 2){ // no parent chosen yet or last chose parent2
            this.lastParent = 1;
            game.parent1 = game.fishArr[fishHitIndex];
          }
          else{
            this.lastParent = 2;
            game.parent2 = game.fishArr[fishHitIndex];
          }

        }
        game.displayBreed = true;
      }
      //if cursor is toilet
      else if(state === 'toilet'){
        if(game.clickCounter  >= this.clickDelay){//prevent overlapping fish from being flushed
          game.fishArr[fishHitIndex].flush(fishHitIndex); //flush fish
          game.clickCounter = 0;
        }
      }
    }
    let isHittingToolBar = isHittingToolBarHitBox();
    // ADD SAND
    if (mouseIsPressed && state=='sand' && !isHittingToolBar){
      var tempSand = new Sand(mouseX, mouseY)
      sandObject.quantity-=0.1;
      sandArray.push(tempSand)
      if(sandLevel<=200){
        sandLevel +=1
      }
    }
    //make sure the player is not hovering over the fish when they feed them
    if(!fishIsHit && mouseIsPressed && !isHittingToolBar){
      if(state=='food'){
        fishFoodObject.quantity-=0.08;
        foodArray.push(new Food(mouseX, mouseY, 0.7))
      }
      else if(state=='food2'){
        rareFishFoodObject.quantity-=0.05;
        foodArray.push(new Food(mouseX, mouseY, 1))
      }
      else if(state=='food3'){
        legendaryFishFoodObject.quantity-=0.05;
        foodArray.push(new Food(mouseX, mouseY, 1.8))
      }
    }

    // DISPLAY CLASSES
    for (var i = sandArray.length-1; i >= 0; i--) {
      sandArray[i].display()
    }

    for (var i=0; i < bubblesArray.length; i++){
      bubblesArray[i].display()
    }
    for(var i = 0; i < decorationArray.length; i++) {
      decorationArray[i].display();
    }
    for(var i = 0; i < coinArray.length; i++) {
      coinArray[i].display();
      if(coinArray[i].age >= coinArray[i].lifeSpan){
        coinArray.splice(i, 1)
        i -= 1;
      }
    }
    for (var i = foodArray.length-1; i >= 0; i--) {
      let check = foodArray[i].display(game.fishArr)
      if (check == 'gone'){
        foodArray.splice(i, 1)
        i-=1
      }
    }
    // DISPLAY STATS, BUTTONS, AND TANK WALLS
    this.drawBalance();
    displayButtons()
    displayTankWalls()
    this.drawFish();
    if(this.displayBreed && this.cursor===breedImage){
      this.drawBreedStats();
    }
    if(this.stats.displayIndex != -1 && (this.cursor === cursorImage || this.cursor === fishFoodImage || this.cursor === rareFishFoodImage || this.cursor === legendaryFishFoodImage) && (this.scene !== 'store')){
      this.fishArr[this.stats.displayIndex].drawStats();
    }
  }
}

function isHittingToolBarHitBox(){
  let leftOfToolBar = mouseX < 50;
  let rightOfToolBar = mouseX > buttonArray.length*50 + 50;
  let upOfToolbar = 50 > mouseY;
  let downOfToolbar = 100 < mouseY;
  return !leftOfToolBar && !rightOfToolBar && !upOfToolbar && !downOfToolbar;
}

// functions for cracking an egg
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

function createMysteryEgg(rarity1, rarity2){
  let alreadyOwned = buttonArray.indexOf(mysteryEggObject) !== -1;
  if(!alreadyOwned){
    mysteryEggObject.setMystery(rarity1, rarity2);
    mysteryEggObject.quantity = 1;
    buttonArray.push(mysteryEggObject);
  }
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

// main class for fish
class Fish{
  constructor(type, imageArray, w, h, rarity, frameNum=2, frameDelay=25, hitBox, xOf=0, yOf=0){
    this.type = type;
    //stats
    this.rarity = int(rarity);
    this.health = 100;
    this.healthLoss = 0.83;
    // this.startingPrice = 15;
    this.price = int(rarity**4/100000);
    this.minPrice = 1;
    if(this.price<this.minPrice){
      this.price = 1;
    }
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
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
    this.xMovement = 0;
    this.yMovement = 0;
    this.imageArray = imageArray;
  }
  drawHitBox(){ // each fish has its own hit box
    stroke('black')
    strokeWeight(1);
    fill('rgba(0,255,0,0.1)')
    ellipse(this.x+this.hitBoxXOf, this.y+this.hitBoxYOf, this.hitBox, this.hitBox)
  }
  draw(){
    // this.drawHitBox();
    if(this.xMovement > 0){ //fish moving right
      image(this.imageArray[1][this.frame], this.x, this.y, this.width, this.height);
    }
    else{//fish moving left
      image(this.imageArray[0][this.frame], this.x, this.y, this.width, this.height);
    }


    this.price = constrain(this.price, 0, 100000)

    // fish progressively loses health
    this.health = constrain(this.health, 1, 100)
    if (frameCount % 60 == 0) {//a second has passed
      this.health -= this.healthLoss;
    }
    this.health = round(this.health, 2)


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
      this.x = constrain(this.x, (this.hitBox/2), (canvasWidth-(this.hitBox/2)) )
      this.y = constrain(this.y, this.height, (canvasHeight-(this.hitBox/2)) )
      this.xNoiseOffset += 0.01;
      this.yNoiseOffset += 0.01;
    }

    // fish sinks to bottom of tank when it dies
    else {
      this.health = 0
      this.price = 0
      if (this.y+this.hitBoxYOf <= (canvasHeight-(this.hitBox/2))){
        this.y += 1
      }
    }
    //this.isClicked();
  }
  drawStats(){ // stats for each fish
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
    fill(255,255,255,0);
    rect(game.stats.x+65, game.stats.y+88, 135, 25);
    fill(0, 0, 0);
    text(`(${int(this.health)}/100)`, game.stats.x+129, game.stats.y+91);

    image(rarityImg, game.stats.x+40, game.stats.y+155, 100, 100);
    fill(game.stats.bar);
    let rarityW = map(this.rarity, 0, 100, 0, 135);
    rect(game.stats.x+65, game.stats.y+145, rarityW, 25);
    fill(255,255,255,0);
    rect(game.stats.x+65, game.stats.y+145, 135, 25);
    fill(0, 0, 0);
    text(`(${this.rarity}/100)`, game.stats.x+129, game.stats.y+148);

    image(cashImg, game.stats.x+40, game.stats.y+210, 70, 70);
    text(`${this.price}`, game.stats.x+129, game.stats.y+201);

    if (this.alive){
      image(sellImg, (game.stats.x+game.stats.x+game.stats.w)/2+10, game.stats.y+280, 150, 150);
    }

    //add event listeners
    this.isClosed();
    this.isSold();
  }
  isSold(){ // selling a fish
    let higherThanSell = mouseY < game.stats.y+280 -35;
    let lowerThanSell = mouseY > game.stats.y+280 +150 -125;
    let leftOfSell = mouseX < (game.stats.x+game.stats.x+game.stats.w)/2+10  -25;
    let rightOfSell = mouseX > (game.stats.x+game.stats.x+game.stats.w)/2+10+150 -132;
    let isHit = (!higherThanSell && !lowerThanSell && !leftOfSell && !rightOfSell);
    if(mouseIsPressed && isHit && this.alive){
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

function updateCounter() {
  counter++;   // increase our counter
  // maxCounter++
  // use the counter to set the style on the '#progress_bar' div
  var progress_bar = select('#progress_bar');
  progress_bar.style('width', int(counter/maxCounter*100) + "%");
}

function preload(){
  //font
  fishFont = loadFont('font/FISH.TTF', updateCounter);
  // fish stats images
  rarityImg = loadImage('images/rarity.png', updateCounter);
  heartImg = loadImage('images/heart.png', updateCounter);
  cashImg = loadImage('images/cash.png', updateCounter);
  sellImg = loadImage('images/sell.png', updateCounter);
  closeImg = loadImage('images/close.png', updateCounter);
  //fish images
  commonFishImgArr = [[
    loadImage('images/commonFish/commonFish1.png', updateCounter),
    loadImage('images/commonFish/commonFish2.png', updateCounter)],
    [loadImage('images/commonFish/commonFish3.png', updateCounter),
    loadImage('images/commonFish/commonFish4.png', updateCounter)]]
  pufferFishImgArr = [[
    loadImage('images/pufferFish/pufferFish1.png', updateCounter),
    loadImage('images/pufferFish/pufferFish2.png', updateCounter)
    ],
    [
    loadImage('images/pufferFish/pufferFish3.png', updateCounter),
    loadImage('images/pufferFish/pufferFish4.png', updateCounter)
    ]
  ]
  angelFishImgArr = [[
    loadImage('images/angelFish/angelFish1.png', updateCounter),
    loadImage('images/angelFish/angelFish2.png', updateCounter),
    loadImage('images/angelFish/angelFish3.png', updateCounter),
    loadImage('images/angelFish/angelFish4.png', updateCounter)
    ],
    [
    loadImage('images/angelFish/angelFish5.png', updateCounter),
    loadImage('images/angelFish/angelFish6.png', updateCounter),
    loadImage('images/angelFish/angelFish7.png', updateCounter),
    loadImage('images/angelFish/angelFish8.png', updateCounter)
    ]
  ]
  sharkImgArr = [[
    loadImage('images/shark/shark1.png', updateCounter),
    loadImage('images/shark/shark2.png', updateCounter),
    loadImage('images/shark/shark3.png', updateCounter),
    loadImage('images/shark/shark4.png', updateCounter)
    ],
    [
    loadImage('images/shark/shark5.png', updateCounter),
    loadImage('images/shark/shark6.png', updateCounter),
    loadImage('images/shark/shark7.png', updateCounter),
    loadImage('images/shark/shark8.png', updateCounter)
    ]
  ]
  legendaryFishImgArr = [[
    loadImage('images/legendaryFish/legendaryFish1.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish2.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish3.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish4.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish5.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish6.png', updateCounter),
  ],
  [
    loadImage('images/legendaryFish/legendaryFish7.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish8.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish9.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish10.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish11.png', updateCounter),
    loadImage('images/legendaryFish/legendaryFish12.png', updateCounter)
  ]];
  //fish eggs
  mysteryEggImage = loadImage('images/mysteryEgg.png', updateCounter);
  commonEggImage = loadImage('images/commonEgg.png', updateCounter);
  rareEggImage = loadImage('images/rareEgg.png', updateCounter);
  legendaryEggImage = loadImage('images/legendaryEgg.png', updateCounter);
  //objects
  rockImage = loadImage('images/rock.png', updateCounter)
  waterImage = loadImage('images/water.png', updateCounter)
  grassImage = loadImage('images/grass.png', updateCounter)
  treasureImage = loadImage('images/treasure.png', updateCounter)
  barrelImage = loadImage('images/barrel.png', updateCounter);
  logSignImage = loadImage('images/logSign.png', updateCounter);
  sandImage = loadImage('images/sand.png', updateCounter);
  fishFoodImage = loadImage('images/fishFood/fishfood.png', updateCounter)
  rareFishFoodImage = loadImage('images/fishFood/rareFishFood.png', updateCounter)
  legendaryFishFoodImage = loadImage('images/fishFood/legendaryFishFood.png', updateCounter)
  toiletImage = loadImage('images/toilet.png', updateCounter)
  cursorImage = loadImage('images/cursor.png', updateCounter)
  shopImage = loadImage('images/shop.png', updateCounter)
  breedImage = loadImage('images/breed.png', updateCounter)
  coinImg = loadImage('images/coin.png', updateCounter);
  //sounds
  waterSound = loadSound("sounds/bubbles.mp3", updateCounter)
  waterSound.setVolume(0.3);
  sellSound = loadSound("sounds/sell.mp3", updateCounter)
  flushSound = loadSound("sounds/flush.mp3", updateCounter)
  coinSound = loadSound("sounds/coin.wav", updateCounter)
  coinSound.setVolume(0.2);
}


function setup() {
  state = 'water'
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  waterObject = new Button('water', waterImage, 100, 100)
  sandObject = new Button('sand', sandImage, 100, 100)
  toiletObject = new Button('toilet', toiletImage, 100, 100)
  rockObject = new Button('rock', rockImage, 3, 3)
  grassObject = new Button('grass', grassImage, 3, 3, 70, -10);
  treasureObject = new Button('treasure', treasureImage, 1, 1, 100, 3)
  barrelObject = new Button('barrel', barrelImage, 1, 1, 85, -10)
  logSignObject = new Button('logSign', logSignImage, 1, 1, 120, -20)
  commonEggObject = new Button('commonEgg', commonEggImage, 1, 1)
  rareEggObject = new Button('rareEgg', rareEggImage, 1, 1)
  legendaryEggObject = new Button('legendaryEgg', legendaryEggImage, 1, 1)
  fishFoodObject = new Button('food', fishFoodImage, 50, 50)
  rareFishFoodObject = new Button('food2', rareFishFoodImage, 50, 50)
  legendaryFishFoodObject = new Button('food3', legendaryFishFoodImage, 50, 50)
  cursorObject = new Button('cursor', cursorImage, 1000)
  shopObject = new Button('shop', shopImage, 1000)
  breedObject = new Button('breed', breedImage, 1000)
  mysteryEggObject = new Button('mysteryEgg', mysteryEggImage, 1, 1);
  buttonArray = [cursorObject, shopObject, breedObject, fishFoodObject]
  let storeItems = [{name:'Common Food', img: fishFoodImage, obj: fishFoodObject, price: '18', soldOut: false},
                    {name:'Rare Food', img: rareFishFoodImage, obj: rareFishFoodObject, price: '38', soldOut: false},
                    {name:'Legendary Food', img: legendaryFishFoodImage, obj: legendaryFishFoodObject, price: '95', soldOut: false},
                    {name:'Toilet', obj: toiletObject, img: toiletImage, price: '20', soldOut: false},
                    {name:'Treasure', obj: treasureObject, img: treasureImage, price: '400', soldOut: false},
                    {name:'Common Egg', obj: commonEggObject, img: commonEggImage, price: '10', soldOut: false},
                    {name:'Rare Egg', obj: rareEggObject, img: rareEggImage, price: '300', soldOut: false},
                    {name:'Legendary Egg', obj: legendaryEggObject, img: legendaryEggImage, price: '1300', soldOut: false},
                    {name:'Grass', obj: grassObject, img: grassImage, price: '15', soldOut: false},
                    {name:'Rock', obj: rockObject, img: rockImage, price: '15', soldOut: false},
                    {name:'Sand', obj: sandObject, img: sandImage, price: '10', soldOut: false},
                    {name:'Log Sign', obj: logSignObject, img: logSignImage, price: '100', soldOut: false},
                    {name:'Barrel', obj: barrelObject, img: barrelImage, price: '150', soldOut: false}
                  ]
  game = new Game(storeItems);
  game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, 5, 2, 25, 60))
  game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, 5, 2, 25, 60))
  noiseDetail(24);
}

function draw() {
  imageMode(CENTER);
  //draw game scene
  if(game.scene === "tank"){
      game.drawTank();
  }
  else if(game.scene === "store"){
      game.drawStore();
  }
  else if (game.scene === "menu"){
    game.drawMainMenu();
  }
  //add custom cursor
  noCursor();
  image(game.cursor, mouseX, mouseY, 20, 20);
}

class Coin{ // magic coin that comes from the treasure box
  constructor(x=250, y=250){
    this.x = x;
    this.y = y;
    this.size = 35;
    this.hitBox = 40;
    this.ySpeed = 0.4;
    this.age = 0;
    this.lifeSpan = 250;
    this.value = 5;
  }
  drawHitBox(){
    stroke('black')
    strokeWeight(1);
    fill('rgba(0,255,0,0.1)')
    ellipse(this.x, this.y, this.hitBox, this.hitBox);
  }
  display(){
    this.age += 1;
    if(this.y <= (height-this.size)){
      this.y += this.ySpeed;
    }
    //this.drawHitBox();
    image(coinImg, this.x, this.y, this.size, this.size);
    this.isClicked();
  }
  isClicked(){
    if(mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < (this.hitBox/2) && game.cursor === cursorImage){
      this.age = this.lifeSpan;
      coinSound.play()
      game.balance += 5;
    }
  }
}

class Bubbles { // bubbles come out of the barrel
  constructor(){
    this.ellipseY = decorationArray[findBarrelPosition].y
    this.ellipseX = decorationArray[findBarrelPosition].x
    this.randomSize = random(5, 25)
    this.xNoiseOffset = random(0,1000);
    this.xMovement = 0
  }
  display(){
    stroke(255)
    fill(255,255,255, 100)
    ellipse(this.ellipseX, this.ellipseY, this.randomSize, this.randomSize)
    this.ellipseY -= 1
    this.xMovement = map( noise(this.xNoiseOffset), 0, 1, -1, 1 );
    this.ellipseX += this.xMovement;
    this.xNoiseOffset += 0.01;
  }
}
class Decoration { // main class to store decorations
  constructor(image, x, y, size=100, yOffset=0){
    this.x = x
    this.y = y;
    this.size = size;
    this.image = image;
    this.counter = 0;
    this.coinDelay = 350;
    this.yOffset = yOffset; //how extra far to the bottom
  }
  display(){
    for (var i=0; i<decorationArray.length; i++){ // find position of barrel in decorationArray
      if (decorationArray[i].image === barrelImage){
        findBarrelPosition = i
      }
    }
    if (this.image === barrelImage){
      if (frameCount % 120 == 0){
        var bubbleParticle = new Bubbles()
        bubblesArray.push(bubbleParticle)
      }
    }
    if(this.image === treasureImage){
      this.counter += 1;
      if(this.counter >= this.coinDelay){
        coinArray.push(new Coin(this.x-15, this.y-15));
        this.counter = 0;
      }
    }
    image(this.image, this.x, this.y, this.size, this.size);
    if (this.y < (height-(this.size/2))+this.yOffset){
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
      // this.radius = random(20, 50)
      this.radius = 73;
      this.h = 36
      this.s = 100
      this.l = random(90, 95)
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
// FOOD CLASS
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


function mousePressed(){
  let isHittingToolBar = isHittingToolBarHitBox();
  if((state == 'grass' || state == 'rock' || state === 'treasure' || state === 'barrel' || state === 'logSign') && !isHittingToolBar){//decoration
    decorationArray.push(new Decoration(window[state+"Image"], mouseX, mouseY, window[state+"Object"].size, window[state+"Object"].yOffset));
    window[state+"Object"].quantity -= 1;
  }
  // ADD FISH
  if(mouseIsPressed && !isHittingToolBar){
    if ( state == 'mysteryEgg'){
      fishBeingHit.push(0);
      let newFish = breedFish(mysteryEggObject.parent1, mysteryEggObject.parent2);
      let type = newFish[0];
      let rarity = newFish[1];
      //name imagearray width height rarity framenum framedelay hitbox hiboxXof hitboxYof
      if(type === 'S'){
        game.fishArr.push(new Fish("Aqua", legendaryFishImgArr, 300, 300, rarity, 6, 8, 80, -10, -30));
      }
      else if(type === 'A'){
        game.fishArr.push(new Fish("Bull Shark", sharkImgArr, 100, 100, rarity, 4, 9, 105));
      }
      else if(type === 'B'){
        game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 2, 25, 60));
      }
      else if(type === 'C'){
        game.fishArr.push(new Fish("Angel Fish", angelFishImgArr, 75, 75, rarity, 4, 9, 80, 0, -10));
      }
      else if(type === 'D'){
        game.fishArr.push(new Fish("Puffer Fish", pufferFishImgArr, 80, 80, rarity, 2, 25, 85));
      }
      else{
        game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 2, 25, 60));
      }
      mysteryEggObject.quantity -= 1
    }
    else if (state=='commonEgg'){
      fishBeingHit.push(0);
      let newFish = crackCommonEgg();
      let type = newFish[0];
      let rarity = newFish[1];
      //name imagearray width height rarity framenum framedelay hitbox hiboxXof hitboxYof
      if(type === 'D'){
        game.fishArr.push(new Fish("Puffer Fish", pufferFishImgArr, 80, 80, rarity, 2, 25, 85));
      }
      else{
        game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 2, 25, 60));
      }
      commonEggObject.quantity -= 1
    }
    // ADD FISH
    else if (state=='rareEgg'){
      fishBeingHit.push(0);
      let newFish = crackRareEgg();
      let type = newFish[0];
      let rarity = newFish[1];
      if(type === 'C'){
        game.fishArr.push(new Fish("Angel Fish", angelFishImgArr, 75, 75, rarity, 4, 9, 80, 0, -10));
      }
      else{
        game.fishArr.push(new Fish("Gold Fish", commonFishImgArr, 100, 100, rarity, 2, 25, 60));
      }
      rareEggObject.quantity -= 1
    }
    else if (state=='legendaryEgg'){
      fishBeingHit.push(0);
      let newFish = crackLegendaryEgg();
      let type = newFish[0];
      let rarity = newFish[1];
      if(type === 'A'){
        game.fishArr.push(new Fish("Bull Shark", sharkImgArr, 100, 100, rarity, 4, 9, 105));
      }
      else{
        game.fishArr.push(new Fish("Aqua", legendaryFishImgArr, 300, 300, rarity, 6, 8, 80, -10, -30));
      }
      legendaryEggObject.quantity -= 1
    }
  }
}

function backgroundFill(r, g, b, a){
  fill(r, g, b, a);
  rect(0, 0, canvasWidth, canvasHeight);
}

function drawFloor(){
  stroke('black')
  strokeWeight(1);
  fill('rgba(105,103,100,0.6)')
  rect(0, canvasHeight-38, canvasWidth, canvasHeight);
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

class ToolBar{ // class to store the things in your toolbar
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
        if(buttonArray[i].name === 'cursor' || buttonArray[i].name === 'shop' || buttonArray[i].name === 'breed' || buttonArray[i].name === 'toilet'){
          text(buttonArray[i].name , (this.buttonX+25), this.buttonY+55)
        }
        else if(buttonArray[i].name === 'mysteryEgg'){
          if(buttonArray[i].hatchTimer > 0){
            text(`${buttonArray[i].hatchTimer}s` , (this.buttonX+25), this.buttonY+55)
          }
          else{
            text(`${int(buttonArray[i].quantity)}/${int(buttonArray[i].max)}` , (this.buttonX+25), this.buttonY+55)
          }
        }
        else{
          text(`${int(buttonArray[i].quantity)}/${int(buttonArray[i].max)}` , (this.buttonX+25), this.buttonY+55)
        }
        this.buttonX += 50
        if (mouseIsPressed && mouseX > this.buttonX-50 && mouseX < this.buttonX && mouseY > this.buttonY && mouseY < this.buttonY + 50) {
          if(buttonArray[i].name === 'shop'){
            game.cursor = cursorImage;
            state = 'cursor';
            game.scene = 'store';
            return 'cursor';
          }
          else if(buttonArray[i].name === 'mysteryEgg'){ //disable mystery egg if timer is not up
            if(buttonArray[i].hatchTimer > 0){
              return;
            }
          }
          //remove displays from saving
          game.parent1 = 0;
          game.parent2 = 0;
          game.lastParent = 0;
          game.displayBreed = false;
          game.stats.displayIndex = -1;

          game.cursor = buttonArray[i].image;
          state = buttonArray[i].name
        }
      }
  }
}

function displayButtons(){
    var toolBar = new ToolBar(mouseX, mouseY)
    toolBar.draw(buttonArray, mouseX, mouseY);
}

class Button{ // class to create an object
  constructor(name, image, quantity=0, max=0, size=100, yOffset=0){
    this.yOffset = yOffset;
    this.name = name;
    this.image = image;
    this.quantity = quantity;
    this.max = max;
    this.originalMax = max;
    this.size=size;
  }
  setMystery(parent1, parent2){ //used for mystery egg
    this.parent1 = parent1;
    this.parent2 = parent2;
    this.hatchTimer = 20;
  }
}
