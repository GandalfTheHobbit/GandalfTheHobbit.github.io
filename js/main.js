//Declaring variables
var player = {
     energy: 0,
     totalEnergy: 0,
     energyAtOnce: 1,
     energyPerSecond: 0,

     metal: 0,
     metalPerSecond: 0,
     circuit: 0,
     circuitPerSecond: 0,

     crankUpgradeEnergyCost: 10,
     crankUpgradeMetalCost: 5,

     generatorUpgradeMetalCost: 10,

     basicRobotUpgradeEnergyCost: 50,
     basicRobotUpgradeMetalCost: 25,

     basicFactoryUpgradeCircuitCost: 250,
     basicFactoryUpgradeMetalCost: 250,

    //Generators
     generatorCost: 2,
     generatorConversions: 1,
     generatorAmount: 0,

     //Basic Robots
     basicRobotMetalCost: 10,
     basicRobotCircuitCost: 10,
     basicRobotConversions: 1,
     basicRobotAmount: 0,

     //Basic factories
     basicFactoryMetalCost: 50,
     basicFactoryCircuitCost: 50,
     basicFactoryConversions: 1,
     basicFactoryAmount: 0,


     isBasicFactoryUnlocked: false,
     isBasicRobotUpgradeUnlocked: false,
     isGeneratorUpgradeUnlocked: false,
     isBasicFactoryUpgradeUnlocked: false
};

//Loading and saving
function saveGame() {
    localStorage.setItem("gameSave", JSON.stringify(player));
    console.log('saved');
}

function loadGame() {
    var result = localStorage.getItem("gameSave");
    player = JSON.parse(result);
    console.log('loaded');
    $("#buyGenerator").html("Make for " + player.generatorCost + " metal");
    $("#generatorLevel").html("lvl " + player.generatorAmount);
    $("#upgradeCrank").html("Upgrade for " + player.crankUpgradeEnergyCost + " energy and " + player.crankUpgradeMetalCost + " metal");
    $("#buyBasicRobot").html("Make for " + player.basicRobotMetalCost + " metal and " + player.basicRobotCircuitCost + " circuits");
    $("#basicRobotLevel").html("lvl " + player.basicRobotAmount);
    $("basicRobotConversions").html(basicRobotConversions);
    $("#buyBasicFactory").html("Make for " + player.basicFactoryMetalCost + " metal and " + player.basicFactoryCircuitCost + " circuits");
    $("#basicFactoryLevel").html("lvl " + player.basicFactoryAmount);
    $("basicFactoryConversions").html(basicFactoryConversions);

    if(player.isBasicFactoryUnlocked === true) {
        $("#basicFactory").removeClass('hidden');
    }
    if(player.isBasicFactoryUpgradeUnlocked === true) {
        $("#basicFactoryUpgrade").removeClass('hidden');
    }
    if(player.isBasicRobotUpgradeUnlocked === true) {
        $("#basicRobotUpgrade").removeClass('hidden');
    }
    if(player.isGeneratorUpgradeUnlocked === true) {
        $("#generatorUpgrade").removeClass('hidden');
    }

    $("#upgradeBasicRobot").html("Upgrade for " + player.basicRobotUpgradeEnergyCost + " energy and " + player.basicRobotUpgradeMetalCost + " metal");
    $("#upgradeBasicFactory").html("Upgrade for " + player.basicFactoryUpgradeCircuitCost + " circuits and " + player.basicFactoryUpgradeMetalCost + " metal");

    updateScreen();
}

function reset() {
    localStorage.removeItem("gameSave");
    window.location.reload();
}

if(localStorage.getItem("gameSave") === null){
    saveGame();
} else {
    loadGame();
}

$("#loadtheGame").on('click', function() {
    loadGame();
});

$("#savetheGame").on('click', function() {
    saveGame();
});

$("#resettheGame").on('click', function() {
    if(confirm("Are you sure you want to reset the game?")){
        reset();
    } else{
        return false;
    }
});


//Content addition pack (for new content, setting it to the right values)
if(! player.basicFactoryAmount) { player.basicFactoryAmount = 0; }
if(! player.basicFactoryMetalCost) { player.basicFactoryMetalCost = 50; }
if(! player.basicFactoryCircuitCost) { player.basicFactoryCircuitCost = 50; }
if(! player.basicFactoryConversions) { player.basicFactoryConversions = 1; }
if(! player.totalEnergy) { player.totalEnergy = 0; }
if(! player.isBasicFactoryUnlocked) { player.isBasicFactoryUnlocked = false; }


//Starting game logic
function updateScreen() {
    $("#energy").html(player.energy);
    $("#metal").html(player.metal);
    $("#circuit").html(player.circuit);
    $("#eps").html((player.generatorAmount * player.generatorConversions - (player.metalPerSecond * player.basicRobotConversions) * 2) - (player.circuitPerSecond * player.basicFactoryConversions) * 4);
    $("#mps").html(player.metalPerSecond * player.basicRobotConversions);
    $("#cps").html(player.circuitPerSecond * player.basicFactoryConversions);
    $("#energyPerCrankClick").html(player.energyAtOnce);
}

$("#makeEnergy").on('click', function() {
    player.energy += player.energyAtOnce;
    player.totalEnergy += player.energyAtOnce;
    updateScreen();
});

$("#energyToMetal").on('click', function() {
    if(player.energy >= 2) {
        player.energy -= 2;
        player.metal++;
    } else {
        $("#energyToMetal").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#energyToMetal").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#energyToCircuit").on('click', function() {
    if(player.energy >= 4) {
        player.energy -= 4;
        player.circuit++;
    } else {
        $("#energyToCircuit").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#energyToCircuit").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#buyGenerator").on('click', function() {
    if(player.metal >= player.generatorCost) {
        player.metal -= player.generatorCost;
        player.generatorAmount++;
        player.generatorCost = Math.ceil(Math.pow(1.5, player.generatorAmount + 1));
        $("#buyGenerator").html("Make for " + player.generatorCost + " metal");
        $("#generatorLevel").html("lvl " + player.generatorAmount);
    } else {
        $("#buyGenerator").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#buyGenerator").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#buyBasicRobot").on('click', function() {
    if(player.metal >= player.basicRobotMetalCost && player.circuit >= player.basicRobotCircuitCost) {
        player.metal -= player.basicRobotMetalCost;
        player.circuit -= player.basicRobotCircuitCost;
        player.basicRobotAmount++;
        player.basicRobotMetalCost *= 2;
        player.basicRobotCircuitCost *= 2;
        $("#buyBasicRobot").html("Make for " + player.basicRobotMetalCost + " metal and " + player.basicRobotCircuitCost + " circuits");
        $("#basicRobotLevel").html("lvl " + player.basicRobotAmount);
        player.metalPerSecond++;
    } else {
        $("#buyBasicRobot").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#buyBasicRobot").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#buyBasicFactory").on('click', function() {
    if(player.metal >= player.basicFactoryMetalCost && player.circuit >= player.basicFactoryCircuitCost) {
        player.metal -= player.basicFactoryMetalCost;
        player.circuit -= player.basicFactoryCircuitCost;
        player.basicFactoryAmount++;
        player.basicFactoryMetalCost *= 2;
        player.basicFactoryCircuitCost *= 2;
        $("#buyBasicFactory").html("Make for " + player.basicFactoryMetalCost + " metal and " + player.basicFactoryCircuitCost + " circuits");
        $("#basicFactoryLevel").html("lvl " + player.basicFactoryAmount);
        player.circuitPerSecond++;
    } else {
        $("#buyBasicFactory").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#buyBasicFactory").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#upgradeCrank").on('click', function() {
    if(player.metal >= player.crankUpgradeMetalCost && player.energy >= player.crankUpgradeEnergyCost) {
        player.metal -= player.crankUpgradeMetalCost;
        player.energy -= player.crankUpgradeEnergyCost;
        player.energyAtOnce++;
        player.crankUpgradeEnergyCost *= 4;
        player.crankUpgradeMetalCost *= 4;
        $("#upgradeCrank").html("Upgrade for " + player.crankUpgradeEnergyCost + " energy and " + player.crankUpgradeMetalCost + " metal");
    } else {
        $("#upgradeCrank").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#upgradeCrank").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#upgradeGenerator").on('click', function() {
    if(player.metal >= player.generatorUpgradeMetalCost) {
        player.metal -= player.generatorUpgradeMetalCost;
        player.generatorConversions++;
        player.generatorUpgradeMetalCost *= 4;
        $("#upgradeGenerator").html("Upgrade for " + player.generatorUpgradeMetalCost + " metal");
    } else {
        $("#upgradeGenerator").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#upgradeGenerator").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#upgradeBasicRobot").on('click', function() {
    if(player.metal >= player.basicRobotUpgradeMetalCost && player.energy >= player.basicRobotUpgradeEnergyCost) {
        player.metal -= player.basicRobotUpgradeMetalCost;
        player.energy -= player.basicRobotUpgradeEnergyCost;
        player.basicRobotConversions++;
        player.basicRobotUpgradeMetalCost *= 4;
        player.basicRobotUpgradeEnergyCost *= 4;
        $("#upgradeBasicRobot").html("Upgrade for " + player.basicRobotUpgradeEnergyCost + " energy and " + player.basicRobotUpgradeMetalCost + " metal");
    } else {
        $("#upgradeBasicRobot").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#upgradeBasicRobot").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

$("#upgradeBasicFactory").on('click', function() {
    if(player.metal >= player.basicFactoryUpgradeMetalCost && player.circuit >= player.basicFactoryUpgradeCircuitCost) {
        player.metal -= player.basicFactoryUpgradeMetalCost;
        player.circuit -= player.basicFactoryUpgradeCircuitCost;
        player.basicFactoryConversions++;
        player.basicFactoryUpgradeMetalCost *= 4;
        player.basicFactoryUpgradeCircuitCost *= 4;
        $("#upgradeBasicFactory").html("Upgrade for " + player.basicFactoryUpgradeCircuitCost + " circuits and " + player.basicFactoryUpgradeMetalCost + " metal");
    } else {
        $("#upgradeBasicFactory").removeClass('btn-success').addClass('btn-warning');
        setTimeout(function(){
            $("#upgradeBasicFactory").removeClass('btn-warning').addClass('btn-success');
        }, 2000);
    }
    updateScreen();
});

//The main game loop
setInterval(function(){
    metalPerSecond = player.metalPerSecond * player.basicRobotConversions;
    circuitPerSecond = player.circuitPerSecond * player.basicFactoryConversions;

    player.energy += player.generatorAmount * player.generatorConversions;
    player.totalEnergy += player.generatorAmount * player.generatorConversions;

    if(player.energy >= 2 * metalPerSecond) {
        player.energy -= 2 * metalPerSecond;
        player.metal += metalPerSecond;
    }
    if(player.energy >= 4 * circuitPerSecond) {
        player.energy -= 4 * circuitPerSecond;
        player.circuit += circuitPerSecond;
    }

    updateScreen();
}, 1000);

//Auto-saving
setInterval(function(){
    saveGame();
    if(player.generatorAmount >= 10) {
        $("#generatorUpgrade").removeClass('hidden');
        player.isGeneratorUpgradeUnlocked = true;
    }
    if(player.totalEnergy >= 2000) {
        $("#basicFactory").removeClass('hidden');
        player.isBasicFactoryUnlocked = true;
    }
    if(player.basicRobotAmount >= 10) {
        $("#basicRobotUpgrade").removeClass('hidden');
        player.isBasicRobotUpgradeUnlocked = true;
    }
    if(player.basicFactoryAmount >= 10) {
        $("#basicFactoryUpgrade").removeClass('hidden');
        player.isBasicFactoryUpgradeUnlocked = true;
    }
}, 10000);
