var Cylon = require('cylon');
var ws = require('nodejs-websocket');
var bot;
var altitude;



// Initialise the robot
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
    
// Fly the bot
function fly(robot) {
    bot = robot;

    bot.nav.on("navdata", function(data) {
        console.log(data);
    });
    bot.drone.ftrim();
    after(2*1000, function() {
        bot.drone.takeoff();
    });
    after(3*1000, function(){
        bot.drone.hover(0.2);
    })
    after(7*1000, function() {
        bot.drone.left(0.07);
    });
    after(14*1000, function(){
       bot.drone.front (0.095)
    });
    after(18*1000, function() {
        bot.drone.right(0.07);
    });
    after(22*1000, function() {
        bot.drone.back(0.095);
    });
    after(29*1000, function() {
        bot.drone.left(0.07);
    });
    after(40*1000, function() {
        bot.drone.land();
    });
    bot.nav.on("altitudeChange", function(data) {
        console.log("Altitude:", data);
        // Drone is higher than 1.0 meters up
        if (altitude > 1.0) {
            bot.drone.land();
        }
    });
    after(45*1000, function() {
        bot.drone.stop();
    });

}
Cylon.start();