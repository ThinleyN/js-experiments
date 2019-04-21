
let canvas = document.querySelector('canvas');

canvas.width = 400;
canvas.height = 512;
canvas.style.backgroundColor = 'black';
canvas.style.marginLeft = '150px';

let c = canvas.getContext('2d');

var gameover = false;
var colorchanged = false;


//Environment
function Environment() {
    this.bgPos = 0;
    this.bgSpeed = 4;
    this.bgWidth = 288;
    this.bgImage = document.getElementById('background');
    this.baseImage = document.getElementById('base');
    this.baseWidth = 112;


    this.update = function(){
        this.bgPos += this.bgSpeed;
        if(this.bgPos < this.bgWidth){
            this.bgPos = 0;
        }
    };
    
    //loop background
    this.render = function(){
        for(i=0;i<=canvas.width/this.bgWidth;i++){
            c.drawImage(this.bgImage,this.bgPos+this.bgWidth*i,0);
            c.drawImage(this.baseImage,this.bgPos+this.bgWidth*i,canvas.height-this.baseWidth);
        }
        
    }
};

var environment = new Environment;


//Bird Class
function Bird() {
    this.y = 300;
    this.x = 60;
    this.sprites = [document.getElementById('birdup'),
                    document.getElementById('birdmid'), 
                    document.getElementById('birddown')
                ];
    this.spriteWidth = 34;
    this.spriteHeight = 24;
    this.tracker = 0;
    this.spriteIndex = 0;
    this.radius = 10;
    this.velocity = 0;
    this.gravity = 0.7;
    this.flap = 13;
    this.score = 0;
    



    this.digitscore = [];

    this.scoreImage = [];
    this.scoreImage[0] = document.getElementById('0');
    this.scoreImage[1] = document.getElementById('1'); 
    this.scoreImage[2] = document.getElementById('2');  
    this.scoreImage[3] = document.getElementById('3');
    this.scoreImage[4] = document.getElementById('4');
    this.scoreImage[5] = document.getElementById('5');
    this.scoreImage[6] = document.getElementById('6');
    this.scoreImage[7] = document.getElementById('7');
    this.scoreImage[8] = document.getElementById('8');
    this.scoreImage[9] = document.getElementById('9');

    //KeyPress
    window.addEventListener('keypress', (event) => {
        if (event.keyCode == 13) {
            this.velocity -= this.flap;
            this.y += this.velocity;
            console.log('press');
            document.getElementById('flapsound').play();  
        }
    });


    this.show = function(){
        //for flapping animation
        this.tracker++;
        if(this.tracker%15 === 0){
            this.spriteIndex++;
        }
        if(this.spriteIndex === 2){
            this.spriteIndex =0 ;
        }
    
        c.drawImage(this.sprites[this.spriteIndex],this.x - this.spriteWidth/2,this.y - this.spriteHeight/2);
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

    }

    this.showScore = function(){
        var a = '';
        a = bird.score;
        if(bird.score >= 10){

            c.drawImage(this.scoreImage[Math.floor(bird.score/10)],155,50);
            c.drawImage(this.scoreImage[bird.score%10],180,50);
        }else{
            c.drawImage(this.scoreImage[bird.score%10],180,50);
        }

        
    }
}

    //Pipe Class
function Pipe() {
    this.top = Math.random() * canvas.height/2;
    this.bottom = Math.random() * canvas.height/2;
    this. x = canvas.width;
    this.width = 40;
    this.y = canvas.height-this.bottom;
    this.speed = 4;
    this.pipes =[];
    this.highlight = false;
    this.pipeNorth = document.getElementById('pipenorth');
    this.pipeSouth = document.getElementById('pipesouth');

    this.draw = function(){

        c.fillStyle = 'green';

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

        // c.drawImage(this.pipeNorth,this.x, this.top,52,0);

        //Lower pipe 
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.bottom ); 
        c.fill();
        c.stroke();   
        // c.drawImage(this.pipeSouth,this.x, this.y,52,this.bottom);
    }

    //Check collision
    this.checkCollision = function(bird){
        if(bird.y < this.top + bird.spriteHeight/2 || bird.y > canvas.height-this.bottom - bird.spriteHeight/2){
            if(bird.x > this.x -bird.spriteWidth/2 && bird.x < this.x + this.width-bird.spriteWidth/2
                ){
                this.highlight = true;
                gameover = true;
            }
        } 
    }

    this.scoreDetect = function(bird){
        if(this.x === bird.x){
            ++bird.score;
            document.getElementById('pointsound').play();
        }
    }

    //Moves pipe forward
    this.move = function(bird){
        this.x -= this.speed;
        this.checkCollision(bird); 
        this.scoreDetect(bird);
         
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
},1500);


//Game Loop
function animate(){

    c.clearRect(0, 0 , innerWidth, innerHeight);
    
    var start = window.requestAnimationFrame(animate);

    environment.update();
    environment.render();
    
    bird.show();
    bird.update();
    bird.showScore(); 

    for(i=0;i<pipes.length;i++){
        pipes[i].draw();
        pipes[i].move(bird);
    }
    

    if(gameover === true && colorchanged === true){
        document.getElementById('hitsound').play();
        window.cancelAnimationFrame(start);
    }
}

animate();



