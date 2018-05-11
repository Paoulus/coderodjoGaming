var game = new Phaser.Game(800,480,Phaser.AUTO,"gameDiv",

{
    preload: preload,
    create: create,
    update: update

});
var map;
var layer;


function preload()
{
    game.load.tilemap('mappa','mappa-esportata.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset','tiles-1.png');

    game.load.atlas('robot','atlas_robot_basicPackaging.png','atlas_robot_basicPackaging.json');
}

var robot;
function create()
{
    
    map = game.add.tilemap("mappa");
    map.addTilesetImage("tileset");
    layer = map.createLayer("Livello tile 1");
    layer.resizeWorld();
    

    robot = game.add.sprite(50,50,'robot','Idle (2).png');
    game.physics.enable(robot,Phaser.Physics.ARCADE,true);
    robot.anchor.setTo(0.5,0.5);

    robot.animations.add('run',['Run (1).png','Run (2).png'],4,true,false);
    robot.animations.add('still',['Idle (1).png'],1,false,false);
}

var robotVelocity = 150;
function update()
{
    if(game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        robot.body.velocity.setTo(robotVelocity,0);
        robot.animations.play('run');
        robot.scale.setTo(1,1);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        robot.body.velocity.setTo(-robotVelocity,0);
        robot.animations.play('run');
        robot.scale.setTo(-1,1);
    }
    else{
        robot.body.velocity.setTo(0,0);
        robot.animations.stop('run',true);
        robot.animations.play('still');
    }
}