var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
canvas.width = 1024
canvas.height = 1024

const scoreEl = document.querySelector('#scoreEl') // 점수
const startGame = document.querySelector('#startGame'); // 시작 버튼
const startWindow = document.querySelector('#startWindow'); // 시작 창
const scoreElTwo = document.querySelector('#scoreElTwo'); // 시작 창에 점수
const highScoreEl = document.querySelector('#highScoreEl'); // 최고 점수

var mapSize = 20000;
var mapImg = new Image(); // ship의 움직임에 따라 반대로 움직일 게임 배경
mapImg.src = "media/space1.png"
var map = {
    x: canvas.width - mapSize / 2,
    y: canvas.height - mapSize / 2,
    w: mapSize,
    h: mapSize,
    img: mapImg
}

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var rightD = false; //각 방향을 상태를 나타낼 변수
var leftD = false;
var upD = false;
var downD = false;
var shootPressed = false;

var speed = 2;
var shipSize = 40;
var shipImg = new Image();
var shipImgW = new Image();
shipImgW.src = "media/shipw.png";
var shipImgA = new Image();
shipImgA.src = "media/shipa.png";
var shipImgS = new Image();
shipImgS.src = "media/ships.png";
var shipImgD = new Image();
shipImgD.src = "media/shipd.png";
shipImg = shipImgW // ship의 각 바라보는 방향마다 이미지를 추가.

var ship = {
    x: (canvas.width - shipSize) / 2,
    y: (canvas.height - shipSize) / 2,
    w: shipSize,
    h: shipSize,
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
        rightD = true;
        leftD = false;
        upD = false;
        downD = false;
       shipImg = shipImgD //움직이는 방향에 따라 그 방향을 바라보는 이미지를 선택. 기본은 위를 바라본다.
    }
    else if (e.keyCode == 37) {
        rightPressed = false;
        leftPressed = true;
        upPressed = false;
        downPressed = false;
        rightD = false;
        leftD = true;
        upD = false;
        downD = false;
       shipImg = shipImgA
    }
    else if (e.keyCode == 38) {
        rightPressed = false;
        leftPressed = false;
        upPressed = true;
        downPressed = false;
        rightD = false;
        leftD = false;
        upD = true;
        downD = false;
       shipImg = shipImgW
    }
    else if (e.keyCode == 40) {
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
        downPressed = true;
        rightD = false;
        leftD = false;
        upD = false;
        downD = true;
       shipImg = shipImgS
    }
    if (e.keyCode == 32) {
        if (bulletTime >= 10000) { // 연속으로 총알이 나가지 않도록 제한하는 조건문
            if (upD == true && downD == false && leftD == false && rightD == false) {
                bullets.push(new bullet(0)) // 버튼을 누를 때마다 (방향에 따라 다른 방향으로) 새로운 총알 객체를 총알 배열에 추가
            }
            if (upD == false && downD == true && leftD == false && rightD == false) {
                bullets.push(new bullet(1))
            }
            if (upD == false && downD == false && leftD == true && rightD == false) {
                bullets.push(new bullet(2))
            }
            if (upD == false && downD == false && leftD == false && rightD == true) {
                bullets.push(new bullet(3))
            }
            bulletTime = 0; // 발사 후에는 변수를 초기화하여 다음 발사까지 시간이 필요하도록 함
        }
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
    else if (e.keyCode == 38) {
        upPressed = false;
    }
    else if (e.keyCode == 40) {
        downPressed = false;
    }
    else if (e.keyCode == 32) {
        shootPressed = false;
    }
}

var bulletTime = 0; // 총알이 연속으로 나가지 않게 하는 변수
var bulletSize = 15; // 총알 관련 변수들
var bulletImg = new Image();
bulletImg.src = "media/bullet.png";
let bullets = []; //총알 객체가 저장될 배열

class bullet { //총알 클래스
    constructor(angle) {
        this.x = canvas.width / 2 - bulletSize/2
        this.y = canvas.height / 2 - bulletSize/2
        this.w = bulletSize
        this.h = bulletSize
        this.Img = bulletImg
        this.angle = angle
        this.speed = 5
    }
    update() { //총알 애니메이션 함수
        ctx.drawImage(bulletImg, this.x, this.y, this.w, this.h);
        if(this.angle == 0) { //상
            this.y -= this.speed;
        }
        else if(this.angle == 1) { //하
            this.y += this.speed;
        }
        else if(this.angle == 2) { //좌
            this.x -= this.speed;
        }
        else if(this.angle == 3) { //우
            this.x += this.speed;
        }

        if(rightPressed) this.x -= speed; //플레이어 움직임에 대한 반응
        if(leftPressed) this.x += speed;
        if(upPressed) this.y += speed;
        if(downPressed) this.y -= speed;
    }
}

function movement() { //배경과 적을 반대 방향 움직임으로써 플레이어의 움직임 표현
    if (rightPressed) {
        map.x -= speed;
        enemies.forEach(enemy => {
            enemy.x -= speed;
        })
    }
    else if (leftPressed) {
        map.x += speed;
        enemies.forEach(enemy => {
            enemy.x += speed;
        })
    }
    else if (upPressed) {
        map.y += speed;
        enemies.forEach(enemy => {
            enemy.y += speed;
        })
    }
    else if (downPressed) {
        map.y -= speed;
        enemies.forEach(enemy => {
            enemy.y -= speed;
        })
    }
}

var enemySize = 50;
var enemyImg = new Image();
enemyImg.src = "media/enemy.png";
let enemies = [];

class Enemy {   //적 클래스
    constructor(x, y, velocity) {
        this.x = x
        this.y = y
        this.w = enemySize
        this.h = enemySize
        this.velocity = velocity
    }

    update() { // 적의 애니메이션 함수
        ctx.drawImage(enemyImg, this.x, this.y, this.w, this.h)
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        var angle = Math.atan2( // 이동하는 위치에 따라 중앙에 대한 각도 업데이트
            canvas.height / 2 - enemySize/2 - this.y,
            canvas.width / 2 - enemySize/2 - this.x
        )
        this.velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
    }
}

function spawnEnemies(spawnSpeed) { // 적 생성 함수
    setInterval(() => {
        let x
        let y

        if(Math.random() < 0.5) { // 화면 바깥 네 방향 무작위 위치에서 생성
            x = Math.random() < 0.5 ? 0 - enemySize : canvas.width + enemySize
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - enemySize : canvas.width + enemySize
        }

        const angle = Math.atan2( // 중앙과의 각도 계산
            canvas.height/2 - enemySize/2 - y,
            canvas.width/2 - enemySize/2 - x
        )

        const velocity = { // 중앙으로 움직임
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, velocity))
    }, spawnSpeed)
}

let animationId; // 현재 프레임 추적
let score = 0; // 점수 계산을 위한 변수
let highScore = 0; // 최고 점수 변수

function draw() {
    animationId = requestAnimationFrame(draw);
    bulletTime += 1000; // 총알 연속 생성 방지를 위한 변수 업데이트
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImg, map.x, map.y, map.w, map.h);
    ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

    movement(); // 배경 움직임

    enemies.forEach((enemy, index) => {
        enemy.update()

        var bound = 100;
        if(enemy.x < 0 - bound) { // 화면 밖으로 일정량 이상 나간 적은 배열에서 삭제
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }
        else if(enemy.x > canvas.width + bound) {
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }
        else if(enemy.y < 0 - bound) {
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }
        else if(enemy.y > canvas.height + bound) {
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }

        const dist = Math.hypot(canvas.width/2 - enemySize/2 - enemy.x, canvas.height/2 - enemySize/2 - enemy.y) 
        if (dist - enemySize/4 - shipSize/2 < 0) { // 플레이어와 적이 부딪힐 경우
            cancelAnimationFrame(animationId) // 애니메이션 취소 > 게임 종료
            startWindow.style.display = 'flex'; // 시작 창 다시 표시
            scoreElTwo.innerHTML = score; // 시작 창 내 점수 업데이트
            highScoreEl.innerHTML = highScore; // 최고 기록 업데이트
        }

        bullets.forEach((bullet, bulletsIndex) => {
            const dist = Math.hypot(bullet.x - enemySize/2- enemy.x, bullet.y - enemySize/2 - enemy.y) //두 점 사이의 거리 계산
    
            if(dist - enemySize/2 - bulletSize/2 < 0) { // 총알과 적이 만날 경우
                score += 100; // 점수 변수에 점수 추가
                scoreEl.innerHTML = score; // HTML 점수 요소에 점수 대입
                if(highScore < score) highScore = score; // 최고 점수 업데이트

                setTimeout(() => { // 만난 적과 총알을 배열에서 제거
                    enemies.splice(index, 1)
                    bullets.splice(bulletsIndex, 1)
                }, 0) //setTimeout은 2개 이상의 적 혹은 총알이 한꺼번에 제거되는 것을 방지
            }
        });
    })
    
    bullets.forEach((bullet, index) => {
        if (bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height) {
                setTimeout(() =>{
                    bullets.splice(index, 1) // 총알이 화면 밖을 벗어날 경우 배열에서 제거
                }, 0)
            } else {
                bullet.update(); // 총알 애니메이션
            }
    })
}

function newGame() { // 게임 시작시 총알과 적을 초기화하기 위한 함수
    bullets = [];
    enemies = [];
    score = 0;
    scoreEl.innerHTML = score;
    scoreElTwo.innerHTML = score;
}

startGame.addEventListener('click', () => {  // 게임 시작 버튼을 누르면 시작
    newGame();
    spawnEnemies(400);
    draw();
    startWindow.style.display = 'none'; // 게임 시작 창은 사라진다
})

