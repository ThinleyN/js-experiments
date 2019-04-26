let canvas = document.querySelector('canvas');

canvas.width = 400;
canvas.height = 512;
canvas.style.backgroundColor = 'black';
canvas.style.marginLeft = '150px';

let c = canvas.getContext('2d');

var gameover = false;

//Environment
function Environment() {
  this.bgPos = 0;
  this.bgSpeed = 4;
  this.bgWidth = 288;
  this.bgImage = document.getElementById('background');
  this.baseImage = document.getElementById('base');
  this.baseWidth = 112;
  this.gameover = false;

  this.update = function() {
    this.bgPos += this.bgSpeed;
    if (this.bgPos < this.bgWidth) {
      this.bgPos = 0;
    }
  };

  //loop background
  this.render = function() {
    for (i = 0; i <= canvas.width / this.bgWidth; i++) {
      c.drawImage(this.bgImage, this.bgPos + this.bgWidth * i, 0);
      c.drawImage(
        this.baseImage,
        this.bgPos + this.bgWidth * i,
        canvas.height - this.baseWidth
      );
    }
  };

  this.groundCollision = function(bird) {
    if (bird.y >= canvas.height - this.baseWidth - 24) {
      environment.gameover = true;
    }
  };
}

var environment = new Environment();

//Bird Class
function Bird() {
  this.y = 200;
  this.x = 60;
  this.sprites = [
    document.getElementById('birdup'),
    document.getElementById('birdmid'),
    document.getElementById('birddown')
  ];
  this.spriteWidth = 34;
  this.spriteHeight = 24;
  this.tracker = 0;
  this.spriteIndex = 0;
  this.radius = 10;
  this.velocity = 0;
  this.gravity = 0.3;
  this.flap = 7;
  this.score = 0;

  this.scoreImage = [];
  for (i = 0; i < 10; i++) {
    this.scoreImage[i] = document.getElementById(i);
  }

  //KeyPress
  window.addEventListener('keyup', event => {
    if (event.keyCode == 32) {
      this.velocity -= this.flap;
      this.y += this.velocity;
      console.log('press');
      document.getElementById('flapsound').play();
    }
  });

  //Draw bird with flapping motion
  this.show = function() {
    c.drawImage(
      this.sprites[this.spriteIndex],
      this.x - this.spriteWidth / 2,
      this.y - this.spriteHeight / 2
    );

    //for flapping animation
    this.tracker++;
    if (this.tracker % 5 === 0) {
      this.spriteIndex++;
    }
    if (this.spriteIndex === 2) {
      this.spriteIndex = 0;
    }
  };

  //Update Bird
  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > canvas.height) {
      this.y = canvas.height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  };

  this.showScore = function() {
    var a = '';
    a = bird.score;
    if (bird.score >= 10) {
      c.drawImage(this.scoreImage[Math.floor(bird.score / 10)], 155, 50);
      c.drawImage(this.scoreImage[bird.score % 10], 180, 50);
    } else {
      c.drawImage(this.scoreImage[bird.score % 10], 180, 50);
    }
  };
}

//Pipe Class
function Pipe() {
  this.top = 50 + Math.random() * 162;
  this.x = canvas.width;
  this.width = 70;
  this.y = this.top + 150;
  this.speed = 4;
  this.pipes = [];
  this.highlight = false;
  this.pipeNorth = document.getElementById('pipenorth');
  this.pipeSouth = document.getElementById('pipesouth');

  this.draw = function() {
    c.fillStyle = 'green';

    c.drawImage(this.pipeNorth, this.x, -500 + this.top, this.width, 500);

    c.drawImage(this.pipeSouth, this.x, this.y, this.width, 500);
  };

  //Check collision
  this.checkCollision = function(bird) {
    if (
      bird.y < this.top + bird.spriteHeight / 2 ||
      bird.y > this.y - bird.spriteHeight / 2
    ) {
      if (
        bird.x > this.x - bird.spriteWidth / 2 &&
        bird.x < this.x + this.width - bird.spriteWidth / 2
      ) {
        environment.gameover = true;
      }
    }
  };

  //Detect Score
  this.scoreDetect = function(bird) {
    if (this.x === bird.x) {
      ++bird.score;
      document.getElementById('pointsound').play();
    }
  };

  //Moves pipe forward
  this.move = function(bird) {
    this.x -= this.speed;
    this.checkCollision(bird);
    this.scoreDetect(bird);
  };
}

//initialize objects
var bird = new Bird();
var pipe = new Pipe();
var pipes = [];
pipes.push(pipe);

//make new pipe every 1 second
setInterval(function() {
  pipes.push(new Pipe());
}, 1500);

//Game Loop
function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);

  var start = window.requestAnimationFrame(animate);

  environment.update();
  environment.render();
  environment.groundCollision(bird);

  bird.show();
  bird.update();
  bird.showScore();

  for (i = 0; i < pipes.length; i++) {
    pipes[i].draw();
    pipes[i].move(bird);
  }

  if (environment.gameover === true) {
    document.getElementById('hitsound').play();
    c.font = '20px Arial';
    c.strokeText('Press any key to replay and Space to flap', 15, 200);
    window.cancelAnimationFrame(start);
  }

  document.addEventListener('keydown', event => {
    if (environment.gameover) {
      if (event) {
        document.location.reload(true);
      }
    }
  });
}

animate();
