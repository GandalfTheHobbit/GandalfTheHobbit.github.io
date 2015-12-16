//Declaring variables
var player = {
     energy: 0,
     energyAtOnce: 1,
     energyPerSecond: 0,

     metal: 0,
     metalPerSecond: 0,
     circuit: 0,

     crankUpgradeEnergyCost: 10,
     crankUpgradeMetalCost: 5,

    //Generators
     generatorCost: 2,
     generatorEarnings: 1,
     generatorAmount: 0,

     //Basic Robots
     basicRobotMetalCost: 10,
     basicRobotCircuitCost: 10,
     basicRobotConversions: 1,
     basicRobotAmount: 0
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
if(! player.basicRobotAmount) { player.basicRobotAmount = 0; }
if(! player.basicRobotMetalCost) { player.basicRobotMetalCost = 10; }
if(! player.basicRobotCircuitCost) { player.basicRobotCircuitCost = 10; }
if(! player.basicRobotConversions) { player.basicRobotConversions = 1; }
if(! player.metalPerSecond) { player.metalPerSecond = 0; }


//Starting game logic
function updateScreen() {
    $("#energy").html(player.energy);
    $("#metal").html(player.metal);
    $("#circuit").html(player.circuit);
    $("#eps").html(player.energyPerSecond - player.metalPerSecond * 2);
    $("#mps").html(player.metalPerSecond);
    $("#energyPerCrankClick").html(player.energyAtOnce);
}

$("#makeEnergy").on('click', function() {
    player.energy += player.energyAtOnce;
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
        player.energyPerSecond += player.generatorEarnings;
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

//The main game loop
setInterval(function(){
    player.energy += player.energyPerSecond;

    if(player.energy >= 2 * player.metalPerSecond) {
        player.energy -= 2 * player.metalPerSecond;
        player.metal += player.metalPerSecond * player.basicRobotConversions;
    }

    updateScreen();
}, 1000);

//Auto-saving
setInterval(function(){
    saveGame();
}, 10000);
