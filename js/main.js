window.onload = function() {
    //Declaring iables
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
    //Setting up useful functions
    function getId(id) {
        return document.getElementById(id);
    }

    //Loading and saving
    function setCookie(cookie_name,value) {
        expiry = new Date();
        expiry.setTime(new Date().getTime() + (10*60*1000));
        var c_value=escape(btoa(JSON.stringify(value))) + "; expires="+expiry.toUTCString();
        document.cookie=cookie_name + "=" + c_value;
    }

    function getCookie(cookie_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + cookie_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(cookie_name + "=");
        }
        if (c_start == -1) return false;
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = atob(unescape(c_value.substring(c_start,c_end)));
        return JSON.parse(c_value);
    }

    function updateView() {
        getId("buyGenerator").innerHTML = "Make for " + player.generatorCost + " metal";
        getId("generatorLevel").innerHTML = "lvl " + player.generatorAmount;
        getId("upgradeCrank").innerHTML = "Upgrade for " + player.crankUpgradeEnergyCost + " energy and " + player.crankUpgradeMetalCost + " metal";

        updateScreen();
    }

    function saveGame() {
        setCookie('energyIdleSave', player);
    }

    function loadGame() {
        var saveData = getCookie('energyIdleSave');
            if (!saveData) return;
        player = saveData;
        updateView();
    }

    window.onbeforeunload = saveGame();

    //Starting game logic
    function updateScreen() {
        getId("energy").innerHTML = player.energy;
        getId("metal").innerHTML = player.metal;
        getId("eps").innerHTML = player.energyPerSecond;
        getId("epc").innerHTML = player.energyAtOnce;
    }

    getId("makeEnergy").onclick = function() {
        player.energy += player.energyAtOnce;
        updateScreen();
    };

    getId("energyToMetal").onclick = function() {
        if(player.energy >= 2) {
            player.energy -= 2;
            player.metal++;
        } else {
            getId("energyToMetal").className = "btn btn-warning";
            setTimeout(function(){
                getId("energyToMetal").className = "btn btn-success";
            }, 2000);
        }
        updateScreen();
    };

    getId("buyGenerator").onclick = function() {
        if(player.metal >= player.generatorCost) {
            player.metal -= player.generatorCost;
            player.generatorAmount++;
            player.generatorCost = Math.ceil(Math.pow(1.5, generatorAmount + 1));
            getId("buyGenerator").innerHTML = "Make for " + player.generatorCost + " metal";
            getId("generatorLevel").innerHTML = "lvl " + player.generatorAmount;
            player.energyPerSecond += player.generatorEarnings;
        } else {
            getId("buyGenerator").className = "btn btn-warning";
            setTimeout(function(){
                getId("buyGenerator").className = "btn btn-success";
            }, 2000);
        }
        updateScreen();
    };

    getId("upgradeCrank").onclick = function() {
        if(player.metal >= player.crankUpgradeMetalCost && player.energy >= player.crankUpgradeEnergyCost) {
            player.metal -= player.crankUpgradeMetalCost;
            player.energy -= player.crankUpgradeEnergyCost;
            player.energyAtOnce++;
            player.crankUpgradeEnergyCost *= 4;
            player.crankUpgradeMetalCost *= 4;
            getId("upgradeCrank").innerHTML = "Upgrade for " + player.crankUpgradeEnergyCost + " energy and " + player.crankUpgradeMetalCost + " metal";
        } else {
            getId("upgradeCrank").className = "btn btn-warning";
            setTimeout(function(){
                getId("upgradeCrank").className = "btn btn-success";
            }, 2000);
        }
        updateScreen();
    };

    //The main game loop
    setInterval(function(){
        player.energy += player.energyPerSecond;

        updateScreen();
    }, 1000);
};
