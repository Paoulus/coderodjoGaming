var game = new Phaser.Game(800,480,Phaser.AUTO,"gameDiv",

{
    preload: preload,
    create: create,
    update: update

});
var map;
var mapLayer;


function preload()
{
    game.load.tilemap('mappa','mappa-esportata.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1','tiles-1.png');

    game.load.atlas('robot','atlas_robot_basicPackaging.png','atlas_robot_basicPackaging.json');
}

var robot;
function create()
{
	//attiva fisica 
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
    //impostazione gravità locale
	game.physics.arcade.gravity.y = 184;
	
	//impostazione mappa
    map = game.add.tilemap("mappa");
    map.addTilesetImage("tiles-1");
    mapLayer = map.createLayer("Livello tile 1");
    mapLayer.resizeWorld();
	
	map.setCollisionBetween(0,10);
    
	//impostazione proprietà robot
    robot = game.add.sprite(50,50,'robot','Idle (2).png');
	robot.scale.setTo(0.37,0.37);
    game.physics.enable(robot,Phaser.Physics.ARCADE,true);
    robot.anchor.setTo(0.5,0.5);
	robot.body.colliderWorldBounds = true;
	
	//animazioni 
    robot.animations.add('run',['Run (1).png','Run (2).png'],4,true,false);
    robot.animations.add('still',['Idle (1).png'],1,false,false);
}

var robotVelocity = 150;
function update()
{
	game.physics.arcade.collide(robot,mapLayer);
	
    if(game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        robot.body.velocity.x = robotVelocity;
        robot.animations.play('run');
        robot.scale.setTo(0.37,0.37);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        robot.body.velocity.x = -robotVelocity;
        robot.animations.play('run');
        robot.scale.setTo(-0.37,0.37);
    }
    else{
		//non azzerare la velocità ad ogni frame, altrimenti la gravità non funziona correttamente
        //robot.body.velocity.setTo(0,0);
		robot.body.velocity.x = 0;
        robot.animations.stop('run',true);
        robot.animations.play('still');
    }
}