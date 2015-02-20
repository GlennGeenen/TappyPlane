(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.blocks = null;
        this.emitter = null;
        this.lastX = 0;
        this.lastY = 0;
        this.playerY = 2;
    }

    Game.prototype = {

        create: function () {

            this.gameOver = false;
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.add.sprite(0, 0, 'background');

            this.createPlane();
            this.createBlocks();
            this.createEmitter();
            this.createInterface();

            this.time.events.loop(250, this.updateScore, this);
            this.input.onDown.add(this.onInputDown, this);
            this.input.onUp.add(this.onInputUp, this);
        },

        createPlane: function () {
            this.player = this.add.sprite(200, this.game.height * 0.5, 'plane');
            this.player.anchor.set(0.5);
            this.player.animations.add('fly');
            this.player.animations.play('fly', 50, true);
            this.physics.enable(this.player, Phaser.Physics.ARCADE);
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

            this.lastX = 0;
            this.lastY = 200 + Math.random() * 100;

            for (var i = 0; i < 23; ++i) {

                this.lastX = i * 50;

                this.computeNextY();

                if (i === 4) {
                    this.player.y = this.lastY + 150;
                }

                var block = this.blocks.create(this.lastX, this.lastY, 'block');
                block.anchor.setTo(0.5, 1.0);

                block = this.blocks.create(this.lastX, this.lastY + (250 + Math.random() * 150), 'block');
                block.anchor.setTo(0.5, 0.0);
            }

        },

        createInterface: function () {
            this.score = 0;
            var style = {
                font: '100px Arial',
                fill: '#ffe200',
                align: 'center'
            };
            this.scoreText = this.add.text(20, 20, this.score, style);
        },

        update: function () {

            if (!this.gameOver) {

                this.player.body.velocity.y += this.playerY;
                this.player.angle = this.player.body.velocity.y * 0.1;

                this.emitter.emitY = this.player.y;
                this.updateBlocks();
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

                    block.x = this.lastX + 50;

                    if (block.anchor.y === 0) {
                        block.y = this.lastY + (250 + Math.random() * 150);
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

        updateScore: function () {
            this.scoreText.text = ++this.score;
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

        onInputDown: function () {
            this.playerY = -2;
        },

        onInputUp: function () {
            this.playerY = 2;
        },

        onGameOver: function () {

            this.game.state.states['menu'].score = this.score;

            this.game.state.start('menu');
        }

    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Game = Game;

}());