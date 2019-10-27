class mainScene extends Phaser.Scene {
	constructor() {
		super("mainScene");
	}

	preload() {
		this.load.setBaseURL('');
		this.load.image('ground', 'assets/platform.png');
	}

	create() {
		this.initializeValues();

		// Continue text
		this.continueText = this.add.text(200, 200, 'Continue', this.continueTextStyle)
							.setInteractive()
							.on('pointerup', this.continueClick, this);
		this.continueText.visible = false;

		// Platform
		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(400, 550, 'ground');

		// Plank
		this.plank = this.physics.add.image(400, this.currentPlankPosY, 'ground').setImmovable(true);
		this.plank.body.setAllowGravity(false);
		this.plank.body.velocity.setTo(-1 * this.velocity, 0);
		this.plank.body.collideWorldBounds = true;
		this.plank.body.bounce.set(1);
		this.currentPlankPosY -= 32;
		this.planks.push(this.plank);

		// Click
		this.input.on('pointerup', this.mouseClick, this);
	}

	continueClick() {
		this.scene.restart();
	}

	mouseClick() {
		if(this.isGameOver) {
			return;
		}
		if (!this.isGameOver) {
			this.tempPlank = this.planks[this.plankIndex];
			this.tempPlank.body.velocity.setTo(0, 0);
			this.posX = this.tempPlank.body.position.x;
			this.posY = this.tempPlank.body.position.y;

			// If plank is outside the range
			if ((this.posX < this.previousPlankPosX && this.posX + this.currentLength < this.previousPlankPosX) || (this.posX > this.previousPlankPosX + this.currentLength)) {
				this.gameover();
			}
			// If plank fits exactly or If plank is at the left
			else if (Math.pow(Math.abs(this.posX - this.previousPlankPosX), 2) < 0.01 || this.posX < this.previousPlankPosX) {
				// Crop plank
				this.tempPlank.setCrop(this.previousPlankPosX - this.posX, 0, this.currentLength - (this.previousPlankPosX - this.posX), 32);
				this.planks[this.plankIndex] = this.tempPlank;
				this.currentLength = this.currentLength - (this.previousPlankPosX - this.posX);
				this.previousPlankPosX = 200;
				this.previousPlankPosY = this.posY;

				// New plank
				this.tempPlank = this.physics.add.image(400, this.currentPlankPosY, 'ground').setImmovable(true);
			}
			// If plank is at the right
			else if (this.posX > this.previousPlankPosX) {
				// Crop plank
				this.tempPlank.setCrop(0, 0, (this.previousPlankPosX + this.currentLength) - this.posX, 32);
				this.planks[this.plankIndex] = this.tempPlank;
				this.currentLength = (this.previousPlankPosX + this.currentLength) - this.posX;
				this.previousPlankPosX = this.posX;
				this.previousPlankPosY = this.posY;

				// New plank
				this.tempPlank = this.physics.add.image(this.previousPlankPosX + 200, this.currentPlankPosY, 'ground').setImmovable(true);
			}

			this.tempPlank.body.setAllowGravity(false);
			this.tempPlank.body.velocity.setTo(-1 * this.velocity, 0);
			this.tempPlank.body.collideWorldBounds = true;
			this.tempPlank.body.bounce.set(1);
			this.tempPlank.setCrop(0, 0, this.currentLength, 32);
			this.plankIndex += 1;
			this.planks[this.plankIndex] = this.tempPlank;
			this.currentPlankPosY -= 32;
			this.numPlanks += 1;

			// Move camera up every click when number of planks is more than 10
			if (this.numPlanks > 10) {
				this.cameras.main.y += 32;
			}
		}
	}

	update(time, delta) {
	}

	initializeValues() {
		this.currentPlankPosY = 518;
		this.previousPlankPosX = 200;
		this.previousPlankPosY = 534;
		this.currentLength = 400;
		this.planks = [];
		this.plankIndex = 0;
		this.numPlanks = 1;
		this.velocity = 200;
		this.isGameOver = false;
		this.continueTextStyle = { font: "74px Arial Black", fill: "#AA4465" };
	}

	gameover() {
		this.isGameOver = true;
		this.gameOverText = this.add.text(200, 100, 'Game over', { font: "74px Arial Black", fill: "#462255" });
		this.continueText.visible = true;
		this.gameOverText.depth = 2;
		this.continueText.depth = 2;
	}
}