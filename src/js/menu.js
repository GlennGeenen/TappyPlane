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
          
          this.add.sprite(0, 0, 'background');

            this.addTitles();
            this.addScore();
        },

        addTitles: function () {
          
          var shape = this.add.graphics(this.game.width * 0.225, 450);
            shape.lineStyle(5, 0xFFFFFF, 1);
            shape.beginFill(0xCFEAF5, 1);
            shape.drawRect(0, 0, 400, 180);
          
          shape = this.add.graphics(this.game.width * 0.555, 450);
            shape.lineStyle(5, 0xFFFFFF, 1);
            shape.beginFill(0xCFEAF5, 1);
            shape.drawRect(0, 0, 400, 180);

            var text = this.add.text(this.game.width * 0.5, 200, 'Handen omhoog om te starten', {
                font: '42px Arial',
                fill: '#ffffff',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.5, 100, 'TappyPlane', {
                font: '128px Arial',
                fill: '#ffe200',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.333, 500, 'Hoogste Score', {
                font: '48px Arial',
                fill: '#ffffff',
                align: 'center'
            });
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.666, 500, 'Mijn Score', {
                font: '48px Arial',
                fill: '#ffffff',
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
                font: '64px Arial',
                fill: '#ffffff',
                align: 'center'
            };

            var text = this.add.text(this.game.width * 0.333, 580, this.highScore, style);
            text.anchor.set(0.5);

            text = this.add.text(this.game.width * 0.666, 580, this.score, style);
            text.anchor.set(0.5);

        },

        update: function () {

          if (this.game.kinectbody) {

            var joints = this.game.kinectbody.Joints;
            if (joints.HandLeft.Position.Y < joints.Head.Position.Y) {
              return;
            }
            if (joints.HandRight.Position.Y < joints.Head.Position.Y) {
              return;
            }
            
            this.game.state.start('game');
          }
          
        }
    };

    window['tappyplane'] = window['tappyplane'] || {};
    window['tappyplane'].Menu = Menu;

}());