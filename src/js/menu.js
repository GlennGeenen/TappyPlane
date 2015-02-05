(function () {
	'use strict';

	function Menu() {
		this.titleTxt = null;
		this.startTxt = null;
	}

	Menu.prototype = {

		create: function () {
			var x = this.game.width * 0.5;
			var y = this.game.height * 0.5;

			var text = this.add.text(x, y, 'TappyPlane', {
				font: '65px Arial',
				fill: '#ffe200',
				align: 'center'
			});
			text.anchor.set(0.5);

			text = this.add.text(x, y + 100, 'tap to start', {
				font: '48px Arial',
				fill: '#ffffff',
				align: 'center'
			});
			text.anchor.set(0.5);

			this.input.onDown.add(this.onDown, this);
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