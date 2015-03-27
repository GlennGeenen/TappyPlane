(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.blocks = null;
        this.emitter = null;
        this.point = null;
    }

    Game.prototype = {

        create: function () {

            this.gameOver = false;
            this.gap = 350;
            this.lastX = 0;
            this.lastY = 0;

            this.add.sprite(0, 0, 'background');

            this.createPlane();
            this.createBlocks();
            this.createEmitter();
            this.createInterface();

            this.time.events.loop(250, this.updateScore, this);
          
        },

        createPlane: function () {
            this.player = this.add.sprite(400, 700, 'plane');
            this.player.anchor.set(0.5);
            this.player.animations.add('fly');
            this.player.animations.play('fly', 50, true);
            this.player.g = 0;
        },

        createEmitter: function () {

            this.emitter = this.add.emitter(this.player.x, this.player.y, 100);
            this.emitter.makeParticles('puffSmall');

            this.emitter.setXSpeed(-200, -100);
            this.emitter.setYSpeed(-5, 5);

            this.emitter.emitX = this.player.x - 40;
            this.emitter.emitY = this.player.y;

            this.emitter.start(false, 4000, 100);
        },

        createBlocks: function () {
            
            this.blocks = this.add.group();
            this.points = this.add.group();

            var i;
            var block;
          
            this.lastX = 0;
            this.lastY = 450;

            for (i = 0; i < 20; ++i) {

                this.lastX = i * 50;

                block = this.blocks.create(this.lastX, this.lastY, 'block');
                block.anchor.setTo(0.5, 1.0);

                block = this.blocks.create(this.lastX, this.lastY + 400, 'block');
                block.anchor.setTo(0.5, 0.0);
            }
          
            for (i = 0; i < 20; ++i) {

                this.lastX = 1000 + i * 50;

                this.computeNextY();

                block = this.blocks.create(this.lastX, this.lastY, 'block');
                block.anchor.setTo(0.5, 1.0);

                block = this.blocks.create(this.lastX, this.lastY + (this.gap + Math.random() * 150), 'block');
                block.anchor.setTo(0.5, 0.0);
            }
            
            this.point = this.add.sprite(this.lastX, this.lastY + Math.random() * this.gap, 'gold');

        },

        createInterface: function () {
            this.score = 0;
            var style = {
                font: '100px Arial',
                fill: '#265c69',
                align: 'center'
            };
            this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, style);
        },

        update: function () {

            if (!this.gameOver) {
              
                if(this.game.kinectbody) {
                  var joints = this.game.kinectbody.Joints;

                  var ldif = joints.SpineMid.Position.Z - joints.HandLeft.Position.Z - 0.3;
                  var rdif = joints.SpineMid.Position.Z - joints.HandRight.Position.Z - 0.3;

                  this.player.g = (ldif + rdif) * 150;
                }
              
                var deltaTime = this.time.elapsed / 1000;
              
                this.player.y += deltaTime * this.player.g;
              
                this.player.angle = this.player.g  * 0.25;

                this.emitter.emitY = this.player.y;
                
                this.updateBlocks();
                this.updateBonus();
            }
        },

        computeNextY: function () {
            if (this.lastY + 50 >= 500) {
                this.lastY -= 50;
            } else if (this.lastY <= 50) {
                this.lastY += 50;
            } else if (Math.floor(Math.random() * 2) % 2 === 0) {
                this.lastY -= 50;
            } else {
                this.lastY += 50;
            }
        },

        updateBlocks: function () {

            var moveSpeed = -2;
            var increaseX = false;
            var crashed = false;

            this.lastX += moveSpeed;
            this.blocks.forEach(function (block) {
                block.x += moveSpeed;

                if (block.x < -50) {

                    if (!increaseX) {
                        increaseX = true;
                        this.computeNextY();
                    }
                    
                    if(!this.point.alive) {
                        this.point.x = this.lastX + 50;
                        this.point.y = this.lastY + Math.random() * this.gap;
                        this.point.revive();
                    }

                    block.x = this.lastX + 50;
                    if (block.anchor.y === 0) {
                        block.y = this.lastY + (this.gap + Math.random() * 150);
                    } else {
                        block.y = this.lastY;
                    }
                    
                } else {
                    var distx = this.player.x - block.x;

                    if (distx * distx < 55 * 55) {
                        if (block.anchor.y === 1 && block.y > this.player.y - 30) {
                            crashed = true;
                        } else if (block.anchor.y === 0 && block.y < this.player.y + 30) {
                            crashed = true;
                        }
                    }
                }

            }, this);

            if (increaseX) {
                this.lastX += 50;
            }

            if (crashed) {
                this.onCollision();
            }
        },
        
        updateBonus: function () {
            
            if(this.point.alive) {
                this.point.x -= 2;
                if(this.point.x < -50) {
                    this.point.alive = false;
                } else if(this.point.x < 450 && this.point.x > 350) {
                    
                    if (Math.abs(this.point.y - this.player.y) < 60) {
                        
                        this.score += 100;
                        this.point.kill();
                        
                        var sprite = this.add.sprite(this.point.x, this.point.y, 'bonus');
                        sprite.anchor.set(0.5);
                        
                        var tw = this.add.tween(sprite);
                        tw.to({
                            x: this.point.x + 350,
                            y: this.point.y - 350
                        }, 5000, Phaser.Easing.Linear.None, true);
                        
                        tw = this.add.tween(sprite);
                        tw.to( { alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
                        tw.onComplete.add(function() {
                            sprite.destroy();
                        });
                        
                    } 

                }
                
            }
            
        },

        updateScore: function () {
            
            if(this.time.totalElapsedSeconds() > 120) {
                this.gap = 100;
            }
            else if(this.time.totalElapsedSeconds() > 90) {
                this.gap = 150;
            }
            else if(this.time.totalElapsedSeconds() > 60) {
                this.gap = 200;
            }
            else if(this.time.totalElapsedSeconds() > 45) {
                this.gap = 250;
            }
            else if(this.time.totalElapsedSeconds() > 30) {
                this.gap = 300;
            }
            
            this.scoreText.text = 'Score: ' + (this.score+=2);
        },

        onCollision: function () {

            this.explodePlane();
            this.emitter.kill();
            this.player.kill();

            this.gameOver = true;
            this.time.events.add(2500, this.onGameOver, this);
        },

        explodePlane: function () {
            var explosion = this.add.sprite(this.player.x, this.player.y, 'explosion');
            explosion.anchor.set(0.5);
            this.time.events.removeAll();
            this.time.events.add(3000, this.onGameOver, this);
        },

        onGameOver: function () {

            this.game.state.states['menu'].score = this.score;

            this.game.state.start('menu');
        }

    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Game = Game;

}());