var Cylon = require('cylon');
var ws = require('nodejs-websocket');
var bot;
var altitude;



// Initialise the robot.
Cylon.robot()
    .connection("ardrone", {
        adaptor: 'ardrone',
        port: '192.168.1.1'
    })
    .device("drone", {
        driver: "ardrone",
        connection: "ardrone"
    })
    .device("nav", {
        driver: "ardrone-nav",
        connection: "ardrone"
    })
    .on("ready", fly);
    
// Fly the bot.
function fly(robot) {
    bot = robot;

    bot.nav.on("navdata", function(data) {
        console.log(data);
    });
    bot.drone.ftrim();

    bot.drone.takeoff(function() {
        bot.drone.animateLeds("blinkGreen", 60, 10);
        bot.drone.clockwise(0.3);
        bot.drone.front(0.1);
    });

    after(15 * 1000, function() {
        bot.drone.stop();
        bot.drone.land(function() {
            console.log("Landed!");
        });
    });

    bot.nav.on("altitudeChange", function(data) {
        if (data.altitude > 1.5) {
            bot.drone.stop();
            bot.drone.land();
        }
    });
}


// metre-based function
function doDist(func, dist) {
    bot.drone[func](0.25);
    after(4000 * dist, function() {
        bot.drone.stop();
    });
}

Cylon.start();