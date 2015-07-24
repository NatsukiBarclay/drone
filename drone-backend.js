var Cylon = require('cylon');
var ws = require('nodejs-websocket');
var bot;


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
    .on("ready", fly);
    
// Fly the bot
function fly(robot) {
    bot = robot;
    robot.drone.ftrim();
    after(2*1000, function() {
        robot.drone.takeoff(0.2);
    });
    after(2 *1000, function() {
        robot.drone.left(0.3);
    });
    after(2*1000, function() {
        robot.drone.right(0.3);
    });
    after(2*1000, function() {
        robot.drone.land();
    });
    after(2*1000, function() {
        robot.drone.stop();
    });

}
Cylon.start();