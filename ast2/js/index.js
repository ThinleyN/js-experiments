let canvas = document.querySelector('canvas');

const START_ANGLE = 0;
const END_ANGLE = 2 * Math.PI;
const STROKE_STYLE = 'red';
const LINE_WIDTH = '3';
const INNER_WIDTH = window.innerWidth;
const INNER_HEIGHT = window.innerHeight;

canvas.width = INNER_WIDTH;
canvas.height = INNER_HEIGHT;

let c = canvas.getContext('2d');

function Circle(x, y, dx, dy, radius, mass) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.mass = mass;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, START_ANGLE, END_ANGLE, true);
    c.strokeStyle = STROKE_STYLE;
    c.lineWidth = LINE_WIDTH;
    c.stroke();
  };

  this.move = function(circleArr) {
    if (this.x + radius > INNER_WIDTH || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + radius > INNER_HEIGHT || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    for (i of circleArr) {
      if (this === i) {
        continue;
      } else if (
        Math.sqrt(Math.pow(this.x - i.x, 2) + Math.pow(this.y - i.y, 2)) -
          this.radius * 2 <=
        0
      )
        resolveCollision(this, i);
    }
    this.x += this.dx;
    this.y += this.dy;
  };
}

function rotate(dx, dy, angle) {
  const rotatedVelocities = {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle)
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.dx - otherParticle.dx;
  const yVelocityDiff = particle.dy - otherParticle.dy;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.dx, particle.dy, angle);
    const u2 = rotate(otherParticle.dx, otherParticle.dy, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.dx = vFinal1.x;
    particle.dy = vFinal1.y;

    otherParticle.dx = vFinal2.x;
    otherParticle.dy = vFinal2.y;
  }
}

let circleArr = [];
const TOTAL_NUMBER = 1000;
let counterArr = [];
let flag = 0;

function isNotDrawable(circleArr, x, y, radius, mass) {
  for (j = 0; j < circleArr.length; j++) {
    if (
      Math.sqrt(
        Math.pow(x - circleArr[j].x, 2) + Math.pow(y - circleArr[j].y, 2)
      ) -
        radius * 2 <=
      0
    ) {
      return true;
    }
  }
}

for (i = 0; i < TOTAL_NUMBER; i++) {
  let radius = 10;
  flag = 0;
  let x = Math.random() * (innerWidth - radius * 2) + radius;
  let y = Math.random() * (innerHeight - radius * 2) + radius;
  let dx = (Math.random() - 0.5) * 5;
  let dy = (Math.random() - 0.5) * 5;
  let mass = 1;

  if (isNotDrawable(circleArr, x, y, radius, mass)) {
    i--;
    continue;
  } else {
    circleArr.push(new Circle(x, y, dx, dy, radius, mass));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (circle of circleArr) {
    circle.draw();

    circle.move(circleArr);
  }
}

animate();
