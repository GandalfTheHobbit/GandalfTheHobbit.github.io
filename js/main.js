window.onload = function() {
    //Declaring variables
    var energy = 0;
    var energyAtOnce = 1;
    var energyPerSecond = 0;
    var metal = 0;

    //Generators
    var generatorCost = 2;
    var generatorEarnings = 1;
    var generatorAmount = 0;

    //Setting up useful functions
    function getId(id) {
        return document.getElementById(id);
    }

    //Starting game logic
    function updateScreen() {
        getId("energy").innerHTML = energy;
        getId("metal").innerHTML = metal;
        getId("eps").innerHTML = energyPerSecond;
    }

    getId("makeEnergy").onclick = function() {
        energy += energyAtOnce;
        updateScreen();
    };

    getId("energyToMetal").onclick = function() {
        if(energy >= 2) {
            energy -= 2;
            metal++;
        } else {
            getId("energyToMetal").className = "btn btn-warning";
            setTimeout(function(){
                getId("energyToMetal").className = "btn btn-success";
            }, 2000);
        }
        updateScreen();
    };

    getId("buyGenerator").onclick = function() {
        if(metal >= generatorCost) {
            metal -= generatorCost;
            generatorAmount++;
            generatorCost = Math.pow(2, generatorAmount + 1);
            getId("buyGenerator").innerHTML = "Make for " + generatorCost + " metal";
            getId("generatorLevel").innerHTML = "lvl " + generatorAmount;
            energyPerSecond += generatorEarnings;
        } else {
            getId("buyGenerator").className = "btn btn-warning";
            setTimeout(function(){
                getId("buyGenerator").className = "btn btn-success";
            }, 2000);
        }
        updateScreen();
    };

    //The main game loop
    setInterval(function(){
        energy += energyPerSecond;

        updateScreen();
    }, 1000);
};
