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
    game.load.tilemap('mappa','tilemap600x20.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1','tiles-1.png');

    game.load.spritesheet('flag','flag.png');
    game.load.spritesheet('slime','slime.png');

    game.load.atlas('robot','atlas_robot_basicPackaging.png','atlas_robot_basicPackaging.json');
}

var robot;
var checkpoints;
var enemies;
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
	
    //include ALL the tiles
	map.setCollisionBetween(0,67);
    
	//impostazione proprietà robot
    robot = game.add.sprite(50,50,'robot','Idle (2).png');
	robot.scale.setTo(0.3,0.3);
    game.physics.enable(robot,Phaser.Physics.ARCADE,true);
    robot.anchor.setTo(0.5,0.5);
	robot.body.colliderWorldBounds = true;
	
	//animazioni 
    robot.animations.add('run',['Run (1).png','Run (2).png'],4,true,false);
    robot.animations.add('still',['Idle (1).png'],1,false,false);

    //gruppi oggetti
    flags = game.add.group();
    enemies = game.add.group();

    flags.enableBody = true;
    enemies.enableBody = true;

    //nemici
        //createFromObjects è una funzione che permette di prendere un livello di tiled di tipo Object Layer e inserire gli oggetti nel gruppo da noi creato
    //parametri:    nome dell'Object Layer su tiled
    //                      id dell'oggetto (lo si trova nel file .json)
    //                      nome dello spritesheet utilizzato
    //                      numero del frame da utilizzare inizialmente
    //                      booleano che ci indica se l'oggetto esiste oppure no (se è visibile?)
    //                      booleano che ci indica se l'oggetto si distrugge quando esce dal campo di ripresa della camera
    //                      nome del gruppo in cui inserire questi oggetti (checkpoints in questo caso)

    map.createFromObjects('Enemies',75,'slime',1,true,false,enemies);

    enemies.forEach(function(enemy){
        enemy.body.immovable = true;

        enemy.animations.add('enemyMovement',[0,1],4,true);
        enemy.animations.play('enemyMovement');
        enemy.tween = game.add.tween(enemy).to({x:enemy.x+100},1000,'Linear',true,0,-1,true);
        enemy.tween.start();
    },this);

    map.createFromObjects('Checkpoints',75,'checkpoint',true,false,checkpoints);

    flags.forEach(function(checkpoint){
        checkpoint.body.immovable = true;
        checkpoint.animations.add('save',[0,1,2,3]);
        checkpoint.body.allowGravity = false;

        checkpoint.used = false;

    },this);

    game.physics.enable(checkpoints,Phaser.Physics.ARCADE);
    game.physics.enable(enemies,Phaser.Phaser.ARCADE);
}

var robotVelocity = 150;
var jumpTime = 0;
function update()
{
	game.physics.arcade.collide(robot,mapLayer);
	

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        if(robot.body.onFloor() && game.time.now - jumpTime > 90)
        {
            robot.body.velocity.y = -120;
            jumpTime = game.time.now;    
        }
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        robot.body.velocity.x = robotVelocity;
        robot.animations.play('run');
        robot.scale.setTo(0.3,0.3);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        robot.body.velocity.x = -robotVelocity;
        robot.animations.play('run');
        robot.scale.setTo(-0.3,0.3);
    }
    else{
		//non azzerare la velocità ad ogni frame, altrimenti la gravità non funziona correttamente
        //robot.body.velocity.setTo(0,0);
		robot.body.velocity.x = 0;
        robot.animations.stop('run',true);
        robot.animations.play('still');
    }

    //collisione nemico
    game.physics.arcade.collide(enemies,mapLayer);
    game.physics.arcade.overlap(robot,enemies,killPlayer,null,this);   //controllare firma metodo

    //collisione bandierina
    game.physics.arcade.overlap(robot,checkpoints,savePosition,null,this);
}

function savePosition(player,checkpoint)
{
    if(! checkpoint.isUsed)
    {
        checkpoint.animations.play('save');
        //per evitare di riprodurre continuamente la stessa animazione
        checkpoint.used = true;
    }
}

function killPlayer()
{
    robot.kill();
}