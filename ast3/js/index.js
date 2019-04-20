let canvas = document.querySelector('canvas');

canvas.width = 400;
canvas.height = 600;
canvas.style.backgroundColor = 'black';
canvas.style.marginLeft = '150px';

let c = canvas.getContext('2d');

var flag;
var gameover = false;
var colorchanged = false;

//Bird Class
function Bird() {
    this.y = 300;
    this.x = 60;
    this.radius = 10;
    this.velocity = 0;
    this.gravity = 0.5;
    this.velocity = 0;
    this.flap = 14;


    this.show = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        c.fillStyle = 'white';
        c.fill();
    }
    
    this.update = function(){
        this.velocity += this.gravity;
        this.y += this.velocity;

        if(this.y > canvas.height){
            this.y = canvas.height;
            this.velocity = 0;
        }

        if(this.y < 0){
            this.y = 0;
            this.velocity = 0;
        }

        if(flag === 1){
            this.velocity -= this.flap;
            this.y += this.velocity;
            flag =0;
        }
    }
}

 //Pipe Class
function Pipe() {
    this.top = Math.random() * canvas.height/2;
    this.bottom = Math.random() * canvas.height/2;
    this. x = canvas.width;
    this.width = 20;
    this.y = canvas.height-this.bottom;
    this.speed = 4;
    this.pipes =[];
    this.highlight = false;

    this.draw = function(){

        c.fillStyle = 'white';

        //for changing color of pipe after collision
        if(this.highlight === true){
            c.fillStyle = 'red';
            colorchanged = true;
        }

        //Upper pipe
        c.beginPath();
        c.rect(this.x, 0, this.width, this.top ); 
        c.fill();
        c.stroke();

        //Lower pipe 
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.bottom ); 
        c.fill();
        c.stroke();   
    }

    //Check collision
    this.checkCollision = function(bird){
        if(bird.y < this.top || bird.y > canvas.height-this.bottom){
            if(bird.x > this.x && bird.x < this.x + this.width){
                this.highlight = true;
                gameover = true;
            }
        }
    }

    //Moves pipe forward
    this.move = function(bird){
        this.x -= this.speed;
        this.checkCollision(bird);   
    }

}


//initialize objects
var bird = new Bird();
var pipe = new Pipe();
var pipes = [];
pipes.push(pipe);


//make new pipe every 1 second
setInterval(function(){
    pipes.push(new Pipe);
},1000);


//for key press
this.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        flag = 1;
    }
});

//Animate
function animate(){

    c.clearRect(0, 0 , innerWidth, innerHeight);
   
    var start = window.requestAnimationFrame(animate);
    
    bird.show();
    bird.update();

    for(i=0;i<pipes.length;i++){
        pipes[i].draw();
        pipes[i].move(bird);
    }
    

    if(gameover === true && colorchanged === true){
        window.cancelAnimationFrame(start);
    }
}

animate();




