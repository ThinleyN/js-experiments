let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        c.strokeStyle = 'red';
        c.lineWidth = '3';
        c.stroke();
    }

    this.move = function(circleArr) {
        if((this.x+radius) > innerWidth || (this.x-this.radius) < 0){
            this.dx = -this.dx;
        }
        if((this.y+radius) > innerHeight || (this.y-this.radius) < 0){
            this.dy = -this.dy;
        }
    
        for(i of circleArr){

            if(this === i){
                continue;
            }
            else if(Math.sqrt(Math.pow(this.x-i.x,2) + Math.pow(this.y-i.y,2)) - this.radius*2 < 0){
                this.dx = -this.dx;
                this.dy = -this.dy
            }
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

function isDrawable(circleArr,x,y,radius){
    for(j=0; j<circleArr.length; j++){
        if(Math.sqrt(Math.pow(x-circleArr[j].x,2) + Math.pow(y-circleArr[j].y,2)) - radius*2 <= 0){
            console.log('conjoint1');   
            flag = 1;
            break;
        }
    }
}

let circleArr = [];
let totalnumber = 50;
let counterArr = [];
let flag =0;

for(i = 0; i < totalnumber; i++){
    let radius = 20;
    flag = 0 ;
    let x = (Math.random() * (innerWidth - radius*2)+radius);
    let y = (Math.random() * (innerHeight - radius*2)+radius) ;
    let dx =  (Math.random() - 0.5) * 5;
    let dy = (Math.random() - 0.5) * 5;
    
    isDrawable(circleArr,x,y,radius);
    
    if(flag === 1){
        i--;
        continue;
    }

    circleArr.push(new Circle(x, y, dx, dy, radius)); 
}


function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0 , innerWidth, innerHeight);

    for(i of circleArr){
        i.draw();

        i.move(circleArr);
    }

}

animate();