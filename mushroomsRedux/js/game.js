var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', 
	{ 
		preload: preload, 
		create: create, 
		update: update 
	});

function preload(){
	game.load.tilemap('mappa','mappa-esportata.json',null,Phaser.Tilemap.TILED_JSON);
	game.load.image('tileset','tiles-1.png');
}
	
var mappa;
function create(){
	mappa = game.add.tilemap('mappa');
	mappa.addTilesetImage('tileset','tileset');
	
	var layer = mappa.createLayer('Livello tile 1');
	layer.resizeWorld();
}

function update(){

}




	



	


