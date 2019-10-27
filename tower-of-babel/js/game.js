new Phaser.Game({
    width: 800, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "game", // ID of the DOM element to add the canvas to
    backgroundColor: '#ace5ff', // The background color
    scene: [mainScene], // The name of the scene we created
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        debug: false
      }
    }, // The physics engine to use
  });