from random import randrange



def breed(rarity1, rarity2):
    rarity3 = randrange(0, 101)
    average = (rarity3+rarity2+rarity1)/3
    return average

def price(fish):
    bonus = 0
    # if(fish >= 95): # s tier
    #     bonus = 240
    # if(fish >= 85): # a tier
    #     bonus = 120
    # if(fish >= 70): # b tier
    #     bonus = 60
    # if(fish >= 50): # c tier
    #     bonus = 40
    # if(fish >= 25): # d tier
    #     bonus = 20
    # else: # f tier
    #     bonus = 10
    return fish**4/100000+bonus

def buyEgg(money, minParent):
    # priceOfLegendaryEgg = 815;
    # priceOfRareEgg = 240;
    priceOfLegendaryEgg = 1300;
    priceOfRareEgg = 300;
    if(money > priceOfLegendaryEgg and minParent < 95):
        return [randrange(85, 100), priceOfLegendaryEgg]
    elif(money > priceOfRareEgg and minParent < 70):
        return [randrange(50, 85), priceOfRareEgg]
    return [-1, 0] #no egg bought

def generation():
    #commonFood
    numFish = 2
    priceOfFood = 18
    priceOfFoodPerGen = (1/3)*priceOfFood*numFish
    treasureBought = False
    money = 8+18#+18 because they start with 1 food
    offspringCount = 0
    parent1 = 5
    parent2 = 5
    eggsCracked = 0;
    totalRarityofFishDiscarded = 0
    fishDiscarded = 0
    offSpringRarity = 0
    while(offSpringRarity < 95 and parent1 < 95 and parent2 < 95):
        #try to buy a treasure chest if not alreadyOwned
        if((not treasureBought) and money > 400):
            money -= 400
            treasureBought = True
        if(treasureBought): #every generation you get 20 coins
            money += 30
        # try to buy an egg first if u can
        minParentRarity = min(parent1, parent2);
        crackEgg = buyEgg(money, minParentRarity)
        if(crackEgg[0] != -1):
            eggsCracked += 1
        eggSpawnRarity = crackEgg[0]
        money -= crackEgg[1]
        if(eggSpawnRarity > minParentRarity):
            if(parent1 == minParentRarity):
                parent1 = eggSpawnRarity
            else:
                parent2 = eggSpawnRarity
            minParentRarity = min(parent1, parent2);
        #now spawn offspring with best 2 fish
        offSpringRarity = breed(parent1, parent2)
        if(offSpringRarity > minParentRarity):#if offspring has better rarity than parents
            if(parent1 == minParentRarity):
                #sell parent and save his rarity
                money += price(parent1)
                fishDiscarded += 1
                totalRarityofFishDiscarded += parent1
                #replace parent with offspring
                parent1 = offSpringRarity
            else:
                #sell parent and save his rarity
                money += price(parent2)
                fishDiscarded += 1
                totalRarityofFishDiscarded += parent2
                #replace parent with offspring
                parent2 = offSpringRarity
        offspringCount += 1
        if(offspringCount%6 == 0): #feed fish every 80 seconds
            money -= priceOfFoodPerGen
    return [offspringCount, totalRarityofFishDiscarded/fishDiscarded, money, eggsCracked]

def displayResults(agOffspringCount, agFishDiscarded, agMoney, agEggsCracked, generationCount):
    eggcrackTime = 20
    print('\n')
    print('1000 games played simulation result:')
    print("-----------------------------------") #shows average of the below stats of running 1000 simulations
    print('{:<40}'.format("playtime:"), str(int((agOffspringCount/generationCount*eggcrackTime)/60))+'m')
    print('{:<40}'.format("generations:"), int(agOffspringCount/generationCount))
    print('{:<40}'.format("discarded fish rarity:"), int(agFishDiscarded/generationCount))
    print('{:<40}'.format("Eggs Cracked:"), int(agEggsCracked/generationCount))
    print('{:<40}'.format("Money Left:"), int(agMoney/generationCount))
    print('\n')

def main(): #ag = all generations
    generationCount = 0

    agOffspringCount = 0
    agMoney = 0;
    agFishDiscarded = 0;
    agEggsCracked = 0;
    for i in range(1000):
        generationResult = generation()
        agOffspringCount += generationResult[0]
        agFishDiscarded += generationResult[1]
        agMoney += generationResult[2]
        agEggsCracked += generationResult[3]
        generationCount += 1
    displayResults(agOffspringCount, agFishDiscarded, agMoney, agEggsCracked, generationCount)


main()
