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

    bot.drone.ftrim();

    bot.drone.takeoff(function() {
        console.log("Turning on snake eyes...");
        bot.drone.animateLeds("snakeGreenRed", 60, 20);

        var speed = 3.333;

        console.log("Working @ speed of " + speed + "...");

        var clock = 0.3 * speed;
        var front = 0.1 * speed;

        console.log("Turning clockwise @ " + clock + ".");
        console.log("Going forwards @ " + front + ".");

        bot.drone.clockwise(clock);
        bot.drone.front(front);

        var up = 0.05;

        console.log("Going up @ " + up + ".");

        bot.drone.up(up);

        after(30 * 1000, function() {
            bot.drone.stop();

            bot.drone.clockwise(1);

            after(6 * 1000, function() {
                bot.drone.stop();
                bot.drone.antiClockwise(clock);
                bot.drone.back(front);
                bot.drone.down(up);
            });
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
