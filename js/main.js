//Declaring variables
var player = {
     energy: 0,
     energyAtOnce: 1,
     energyPerSecond: 0,
     metal: 0,

     crankUpgradeEnergyCost: 10,
     crankUpgradeMetalCost: 5,

    //Generators
     generatorCost: 2,
     generatorEarnings: 1,
     generatorAmount: 0
};

//Loading and saving
function updateView() {
    $("#buyGenerator").html("Make for " + player.generatorCost + " metal");
    $("#generatorLevel").html( "lvl " + player.generatorAmount);
    $("#upgradeCrank").html( "Upgrade for " + player.crankUpgradeEnergyCost + " energy and " + player.crankUpgradeMetalCost + " metal");

    updateScreen();
}

function saveGame() {
    localStorage.setItem("gameSave", JSON.stringify(player));
    console.log('saved');
}

function loadGame() {
    var result = localStorage.getItem("gameSave");
    player = JSON.parse(result);
    console.log('loaded');
    updateView();
}

function reset() {
    localStorage.removeItem("gameSave");
    updateView();
}

//window.onbeforeunload = saveGame();

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

//Starting game logic
function updateScreen() {
    $("#energy").html(player.energy);
    $("#metal").html(player.metal);
    $("#eps").html(player.energyPerSecond);
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

    updateScreen();
}, 1000);

//Auto-saving
setInterval(function(){
    saveGame();
}, 10000);
