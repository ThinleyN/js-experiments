var carousel = document.getElementById('carousel');
var indicator = ([] = document.getElementsByClassName('indicator'));

const PICTURE_WIDTH = 600;

function Images() {
  this.imagearray = document
    .getElementById('carousel')
    .getElementsByTagName('img');

  this.counter = 0;
  this.leftMargin = 0;
  this.flag = 0;
  this.select = 0;
  this.speed = -25;

  this.slide = function() {
    this.leftMargin = this.leftMargin + this.speed;
    carousel.style.marginLeft = this.leftMargin;
    this.counter += this.speed;
  };

  this.reverse = function() {
    this.speed = -this.speed;
  };

  this.checkForReverse = function() {
    if (this.leftMargin <= MIN_WIDTH || this.leftMargin >= MAX_WIDTH) {
      this.reverse();
    }
  };

  this.arrowHide = function() {
    if (this.leftMargin <= MIN_WIDTH) {
      document.getElementById('rightarrow').classList.toggle('hide');
      setTimeout(function() {
        document.getElementById('rightarrow').classList.remove('hide');
      }, 1500);
    }

    if (this.leftMargin >= MAX_WIDTH) {
      document.getElementById('leftarrow').classList.toggle('hide');
      setTimeout(function() {
        document.getElementById('leftarrow').classList.remove('hide');
      }, 1500);
    }
  };
}

var images = new Images();

const MAX_WIDTH = 0;
const MIN_WIDTH = -(PICTURE_WIDTH * (images.imagearray.length - 1));

carousel.style.width = PICTURE_WIDTH * images.imagearray.length;

function slide() {
  leftMargin = leftMargin + speed;
  carousel.style.marginLeft = leftMargin;
  counter += speed;
}

function right() {
  if (images.speed > 0) {
    images.speed = -images.speed;
  } else {
    images.speed = images.speed;
  }
}

function left() {
  if (images.speed > 0) {
    images.speed = images.speed;
  } else {
    images.speed = -images.speed;
  }
}

function animate() {
  var move = window.requestAnimationFrame(animate);

  images.slide();

  images.checkForReverse();

  images.arrowHide();

  if (images.counter % PICTURE_WIDTH === 0) {
    for (i of indicator) {
      i.style.backgroundColor = 'white';
    }
    velocity = 1;
    window.cancelAnimationFrame(move);
    var number = images.leftMargin / PICTURE_WIDTH;
    var pos = -number * 1;
    indicator[pos].style.backgroundColor = 'brown';
    counter = 0;
    setTimeout(function() {
      window.requestAnimationFrame(animate);
    }, 1500);
  }
}

animate();
