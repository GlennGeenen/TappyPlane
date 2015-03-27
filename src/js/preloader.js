(function () {
    'use strict';

    function Preloader() {
        this.asset = null;
        this.ready = false;
    }

    Preloader.prototype = {

        preload: function () {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.asset.anchor.setTo(0.5, 0.5);

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.load.setPreloadSprite(this.asset);

            this.loadResources();
        },

        loadResources: function () {
            this.load.image('background', 'assets/background.png');
          
            this.load.image('start', 'assets/start.png');
            this.load.image('boven', 'assets/boven.png');
            this.load.image('beneden', 'assets/beneden.png');
          
            this.load.image('block', 'assets/block.png');
            this.load.image('puffSmall', 'assets/puffSmall.png');
            this.load.image('explosion', 'assets/explosion.png');
            this.load.image('gold', 'assets/starGold.png');
            this.load.image('bonus', 'assets/bonus.png');
          
            this.load.spritesheet('plane', 'assets/plane.png', 88, 73, 3);
        },

        create: function () {
            this.asset.cropEnabled = false;
        },

        update: function () {
            if (!!this.ready) {
                this.game.state.start('menu');
            }
        },

        onLoadComplete: function () {
            this.ready = true;
        }
    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Preloader = Preloader;

}());