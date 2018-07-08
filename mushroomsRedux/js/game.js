var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:{
        default : "arcade",
        arcade :{
            gravity : {y : 150}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var mapLayer;


function preload()
{
    this.load.tilemapTiledJSON('mappa','assets/maps/tilemap600x20.json');
    this.load.image('tiles-1','assets/tilemaps/tiles-1.png');

    this.load.spritesheet('flag','assets/sprites/flag.png', { frameWidth: 37, frameHeight: 45 });
    this.load.spritesheet('slime','assets/sprites/slime.png', { frameWidth: 37, frameHeight: 45 });

    this.load.atlas('robot','assets/sprites/atlas_robot_basicPackaging.png','assets/sprites/atlas_robot_basicPackaging.json');
}

var robot;
var checkpoints;
var enemies;
function create()
{	
	//impostazione mappa
    map = this.add.tilemap("mappa");
    var tileset = map.addTilesetImage('tiles-1');
    mapLayer = map.createStaticLayer("Livello tile 1",tileset);
	
    //include ALL the tiles
	map.setCollisionBetween(0,67);
    
	//impostazione proprietà robot
    robot = this.physics.add.sprite(50,50,'robot','Idle (2).png');
	robot.scaleX = 0.3; 
    robot.scaleY = 0.3;
    robot.anchorX = 0.5;
    robot.anchorY = 0.5;

    //gruppi oggetti
    flags = this.add.group();
    enemies = this.add.group();

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
}

var robotVelocity = 150;
var jumpTime = 0;
function update()
{
    if((Phaser.Input.Keyboard.KeyCodes.SPACEBAR))
    {
        if(robot.body.onFloor() && this.time.now - jumpTime > 90)
        {
            robot.body.velocity.y = -120;
            jumpTime = this.time.now;    
        }
    }

    if((Phaser.Input.Keyboard.KeyCodes.D))
    {
        robot.body.velocity.x = robotVelocity;
        robot.animations.play('run');
        robot.scale.setTo(0.3,0.3);
    }
    else if((Phaser.Input.Keyboard.KeyCodes.A))
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