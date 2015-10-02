$(function() {
	WIDTH = 640;
	HEIGHT = 480;

	BIRD_WIDTH = 32;
	BIRD_HEIGHT = 32;

	BULLET_WIDTH = 25;
	BULLET_HEIGHT = 25;

	ENEMY_WIDTH = 45;
	ENEMY_HEIGHT = 44;

	FLOOR_WIDTH = WIDTH;
	FLOOR_HEIGHT = 0;

	function Game() {
		this.start = function() {

			Crafty.init(WIDTH, HEIGHT, document.getElementById('js-game'));

			Crafty.sprite(32, "img/bird.png", {
		        flying: [0, 0],
		    });

		    Crafty.sprite(45, "img/enemy.png", {
		        twocan: [0, 0],
		    });

		    Crafty.sprite(25, "img/reader.png", {
		        reader: [0, 0],
		    });

		    Crafty.audio.add("shoot", "sounds/shoot.mp3");
		    Crafty.audio.add("hit", "sounds/hit.mp3");
		    Crafty.audio.add("game_over", "sounds/game_over.wav");

			Crafty.c('Floor', {
			    init: function() {

			        this.addComponent('Floor, 2D, Canvas, Color');
			        this.x = 0;
			        this.y = HEIGHT - FLOOR_HEIGHT;
			        this.w = FLOOR_WIDTH;
			        this.h = FLOOR_HEIGHT;
			        this.color("green");

			    },
			});

			Crafty.c('Bird', {
			    init: function() {

			        this.addComponent('2D, Canvas, Color, Fourway, Gravity, Keyboard, flying, SpriteAnimation');
			        this.x = WIDTH / 2;
			        this.y = 0;
			        this.w = BIRD_WIDTH;
			        this.h = BIRD_HEIGHT;

			        this.reel("walking", 1000, [
						[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
					])
					.animate("walking", -1);

			    },
			    gameOver: function() {
			    	var wasSoundGameOver = false;
			    	$('#js-game').hide();
			    	$('#js-wrapper__game__over').show();
			    	//Crafty.pause();
			    	Crafty.stop();
			    	Crafty.audio.play("game_over", 1, 0.5);
					console.log('GameOver');
			    },
			    moveItem: function(e) {
			    	if(this.x <= 0) {
						this.x = 0;
					} else if(this.x >= WIDTH - BIRD_WIDTH) {
						this.x = WIDTH - BIRD_WIDTH
					}
					if(this.y <= 0) {
						this.y = 0;
					} else if (this.y >= HEIGHT / 2) {
						this.y = HEIGHT / 2
						this.gameOver();
					}
			    },
			    shoot: function() {
							
					var bulletX = this.x + BIRD_WIDTH/2-BULLET_WIDTH/2;
					var bulletY = this.y + BIRD_HEIGHT;
					
					Crafty.e( "Bullet, 2D, DOM, Color, Collision, Tween, reader, SpriteAnimation" )
						.attr(
							{
								x:bulletX,
								y:bulletY,
								w:BULLET_WIDTH,
								h:BULLET_HEIGHT,
								speed:5
							}
						)
						.bind( 
							"explode",
							function()
							{
								this.destroy();
							}
						)
						.tween( { y:HEIGHT }, 500 ).onHit( 
							"Enemy",
							function(e) {
								var scores = parseInt($('#js-scores').text());
								$('#js-scores').text(++scores);
								Crafty.audio.play("hit", 1, 0.5);
								e[0].obj.destroy();
								
								//this.destroy();
							}
						);
			    }
			});

			Crafty.e('Floor').bind('EnterFrame', function () { 
					if (Crafty.frame() % 50 == 0) {

						var max = WIDTH - ENEMY_WIDTH,
							min = ENEMY_WIDTH; 

						
						Crafty.e( "Enemy, 2D, DOM, Color, twocan, SpriteAnimation" )
							.attr(
								{
									x:Math.floor(Math.random() * (max - min + 1)) + min,
									y:HEIGHT-ENEMY_HEIGHT-FLOOR_HEIGHT,
									w:ENEMY_WIDTH,
									h:ENEMY_HEIGHT,
								}
							).timeout(function() {
								this.destroy();
							}, 3000);
					}
				});
			Crafty.e('Bird')
				.fourway(6)
				.gravity('Floor')
				.gravityConst(0.0025)
				.bind('Moved', function(e) {
					this.moveItem(e);
				})
				.bind('KeyDown', function () { 
					if (this.isDown('SPACE')) {
						Crafty.audio.play("shoot", 1, 0.5);
						this.shoot();
					} 
				});
		}
	};

	var game = new Game();

	$('#js-start__btn').click(function(e) {
		e.preventDefault();

		var _this = $(this),
			startBlock = _this.closest('.wrapper__start'),
			gameBlock = $('#js-game'),
			infoBlock = $('.wrapper__game__info');

		startBlock.hide();
		gameBlock.show();
		infoBlock.show();

		game.start();

	});
});
