window.onload = function(){
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
        this.bgSpeed = 10;
        this.bgWidth = 288;
        this.bgImage = document.getElementById('background');
        
       
    
        this.update = function(){
            this.bgPos -= this.bgSpeed;
            if(this.bgPos < this.bgWidth){
                this.bgPos = 0;
            }
        };
        
        //loop background
        this.render = function(){
            for(i=0;i<=canvas.width/this.bgWidth;i++){
                c.drawImage(this.bgImage,this.bgPos+this.bgWidth*i,0);
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

        //KeyPress
        window.addEventListener('keypress', (event) => {
            if (event.keyCode == 13) {
                this.velocity -= this.flap;
                this.y += this.velocity;
                

                
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
    
    
    //Game Loop
    function animate(){
    
        c.clearRect(0, 0 , innerWidth, innerHeight);
       
        var start = window.requestAnimationFrame(animate);
    
        environment.update();
        environment.render();
        
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
}    


