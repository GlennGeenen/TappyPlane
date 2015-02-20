(function () {
    'use strict';

    function Menu() {
        this.titleTxt = null;
        this.startTxt = null;
        this.score = 0;
        this.highScore = 0;
    }

    Menu.prototype = {

        create: function () {

            this.addTitles();
            this.addScore();

            this.input.onDown.add(this.onDown, this);
        },

        addTitles: function () {

            var text = this.add.text(this.game.width * 0.5, 200, 'tap/click', {
                font: '42px Arial',
                fill: '#ffffff',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.5, 100, 'TappyPlane', {
                font: '68px Arial',
                fill: '#ffe200',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.333, 500, 'High Score', {
                font: '48px Arial',
                fill: '#ffe200',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.666, 500, 'Your Score', {
                font: '48px Arial',
                fill: '#ffe200',
                align: 'center'
            });
            text.anchor.set(0.5);
        },

        addScore: function () {

            if (localStorage.HighScore) {
                this.highScore = localStorage.HighScore;
            }
            if (this.score > this.highScore) {
                localStorage.HighScore = this.score;
                this.highScore = this.score;
            }

            var style = {
                font: '42px Arial',
                fill: '#ffffff',
                align: 'center'
            };

            var text = this.add.text(this.game.width * 0.333, 560, this.highScore, style);
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.666, 560, this.score, style);
            text.anchor.set(0.5);

        },

        update: function () {

        },

        onDown: function () {
            this.game.state.start('game');
        }
    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Menu = Menu;

}());