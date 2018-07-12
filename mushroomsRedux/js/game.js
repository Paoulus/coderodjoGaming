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
var mapCollisionLayer;


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
var keyA;
var keyD;
var keySpacebar;
function create()
{	
    //assegnazione tasti 
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	//impostazione mappa
    map = this.add.tilemap("mappa");
    var tileset = map.addTilesetImage('tiles-1');
    mapCollisionLayer = map.createStaticLayer("Livello tile 1",tileset);
	
    //include ALL the tiles
	map.setCollisionBetween(0,67);
    
	//impostazione proprietà robot
    robot = this.physics.add.sprite(50,50,'robot','Idle (2).png');
	robot.scaleX = 0.3; 
    robot.scaleY = 0.3;
    robot.anchorX = 0.5;
    robot.anchorY = 0.5;

    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNames('robot',{prefix:'Run (',start:1,end:8,suffix:').png'}),
        repeat: -1
    });
    this.anims.create({
        key: "flagUp",
        frames: this.anims.generateFrameNumbers('flag', { start: 0, end: 4, first: 0 })
    });
    this.anims.create({
        key: "still",
        frames: this.anims.generateFrameNames('robot', { prefix:'Idle (',start:1,end:8,suffix:').png' })
    });
    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNames('robot', { prefix:'Jump (',start:1,end:10,suffix:').png' })
    });

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

    this.physics.add.collider(robot, mapCollisionLayer);
    this.cameras.main.startFollow(robot);
    this.cameras.main.setBackgroundColor('rgba(10,34,100)');
}

var robotVelocity = 330;
var jumpTime = 0;
function update()
{
    if(keySpacebar.isDown)
    {
        if(robot.body.onFloor() && this.time.now - jumpTime > 90)
        {
            robot.body.velocity.y = -200;
            jumpTime = this.time.now;
        }
    }

    if(keyD.isDown)
    {
        robot.body.velocity.x = robotVelocity;
        robot.play('run',true);
        robot.scaleX = 0.3;
        robot.scaleY = 0.3;
    }
    else if(keyA.isDown)
    {
        robot.body.velocity.x = -robotVelocity;
        robot.play('run',true);
        robot.scaleX = -0.3;
        robot.scaleY = 0.3;
    }
    else{
		//non azzerare la velocità ad ogni frame, altrimenti la gravità non funziona correttamente
		robot.body.velocity.x = 0;

        robot.play('still');
    }
}

function savePosition(player,checkpoint)
{
    if(! checkpoint.isUsed)
    {
        checkpoint.play('save');
        //per evitare di riprodurre continuamente la stessa animazione
        checkpoint.used = true;
    }
}

function killPlayer()
{
    robot.kill();
}