var carousel = document.getElementById('carousel');
var indicator = [] = document.getElementsByClassName('indicator');

console.log(indicator);


var counter = 0;
var speed = -10;
var leftMargin = 0;
var maxWidth = 0;
var minWidth = -1200;
var flag = 0;
var select = 0;

function slide(){
        leftMargin = leftMargin + speed ;
        carousel.style.marginLeft = leftMargin;
        counter+=speed;
}

function reverse(){
    speed = -speed;
}

function right(){
    if(speed > 0){
        speed = -speed ;
    }else{
        speed = speed;
    }

}

function left(){
    if(speed > 0){
        speed = speed;
    }else{
        speed = -speed;
    }

}

function selectIndicator(event){
    select = event.target.value;
    flag = 1;
}


function animate(){
    var move = window.requestAnimationFrame(animate);

    slide();

    if(leftMargin === minWidth || leftMargin === maxWidth || leftMargin <= minWidth || leftMargin >=maxWidth){
        console.log('reverse');
        reverse();
    }

    if(flag === 0) {
        if(counter%600 === 0){
            for(i of indicator){
                i.style.backgroundColor = 'white';
            }

            console.log('flag00');
            velocity = 1;
            window.cancelAnimationFrame(move);
            var a= leftMargin/600;
            var pos = -a * 1;
        
            indicator[pos].style.backgroundColor = 'brown';
    
            counter=0;
    
            setTimeout(function(){
                window.requestAnimationFrame(animate);
            },3000);
        }
    } else {
        if(counter === (-select*600)){
            window.cancelAnimationFrame(move);
            flag = 0;

                for(i of indicator){
                    i.style.backgroundColor = 'white';
                }


            indicator[select].style.backgroundColor = 'brown';

            setTimeout(function(){
                window.requestAnimationFrame(animate);
            },3000);
        }
    } 
}

animate();



