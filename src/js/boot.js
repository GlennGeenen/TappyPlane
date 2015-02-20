(function () {
    'use strict';

    function Boot() {}

    Boot.prototype = {

        preload: function () {
            this.load.image('preloader', 'assets/preloader.gif');
        },

        create: function () {
            this.game.input.maxPointers = 1;

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;

            this.game.scale.maxWidth = 1920;
            this.game.scale.maxHeight = 1080;

            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.setScreenSize(true);

            this.game.state.start('preloader');
        }
    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Boot = Boot;

}());