var Cylon = require('cylon');
var ws = require('nodejs-websocket');
var bot;
var altitude;
var speed, turn, front, up;



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
        bot.drone.animateLeds("snakeGreenRed", 60, 20);

        // SPEED MODIFIER
        speed = 3;
        // TURNING SPEED
        turn = 0.25;
        // FORWARD SPEED
        front = 0.1;
        // UPWARDS SPEED
        up = 0.05;

        bot.drone.clockwise(turn * speed);
        bot.drone.front(front * speed);
        bot.drone.up(up);
    });

    after(30 * 1000, function() {
        bot.drone.stop();
        bot.drone.clockwise(1);
    });

    after(36 * 1000, function() {
        bot.drone.stop();
        bot.drone.antiClockwise(turn * speed);
        bot.drone.back(front * speed);
        bot.drone.down(up);
    });

    after(46 * 1000, function() {
        bot.drone.stop();
    });

    after(48 * 1000, function() {
        bot.drone.wave();
    });

    after(52 * 1000, function() {
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
