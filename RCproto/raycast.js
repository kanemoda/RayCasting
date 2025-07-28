const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

let useMouseLook = false;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
    
    render() {
        for (var i = 0; i < MAP_NUM_ROWS; i++)
        {
            for (var j = 0; j < MAP_NUM_COLS; j++)
            {
                var tileX = j * TILE_SIZE;
                var tileY = i * TILE_SIZE;
                var tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
                stroke("#222");
                fill(tileColor);
                rect(tileX,tileY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0; // -1 if left +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180); 
    }
    update(map){
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        const nextX = this.x + (Math.cos(this.rotationAngle) * this.moveSpeed) * this.walkDirection;
        const nextY = this.y + (Math.sin(this.rotationAngle) * this.moveSpeed) * this.walkDirection;

        if (!this.checkCollision(nextX,nextY,map))
        {
            this.x = nextX;
            this.y = nextY;
        } 
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius)
        stroke("red");
        line(this.x,
             this.y,
             this.x + Math.cos(this.rotationAngle) * 30,
             this.y + Math.sin(this.rotationAngle) * 30
            );
    }
    checkCollision(x,y,map)
    {
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);

        if (gridX < 0 || gridX >= MAP_NUM_COLS || gridY < 0 || gridY >= MAP_NUM_ROWS)
        {
            return true;
        }

        return map.grid[gridY][gridX] === 1;
            
    }
}

var grid = new Map();
var player = new Player();

function keyPressed() {
    let k = key.toLowerCase();  

    if (k === "m")
    {
        useMouseLook = !useMouseLook;

        if (useMouseLook)
        {
            let canvas = document.querySelector("canvas");
            canvas.requestPointerLock();
        }
        else
        {
            document.exitPointerLock();
        }
    }

    if (!useMouseLook)
    {
        if (keyCode === UP_ARROW || k === 'w') {
            player.walkDirection = +1;
        } else if (keyCode === DOWN_ARROW || k === 's') {
            player.walkDirection = -1;
        } else if (keyCode === RIGHT_ARROW || k === 'd') {
            player.turnDirection = +1;
        } else if (keyCode === LEFT_ARROW || k === 'a') {
            player.turnDirection = -1;
        }
    }
}

function keyReleased(){
    let k = key.toLowerCase(); 

    if (!useMouseLook)
    {
        if (keyCode === UP_ARROW || k === 'w') {
            player.walkDirection = 0;
        } else if (keyCode === DOWN_ARROW || k === 's') {
            player.walkDirection = 0;
        } else if (keyCode === RIGHT_ARROW || k === 'd') {
            player.turnDirection = 0;
        } else if (keyCode === LEFT_ARROW || k === 'a') {
            player.turnDirection = 0;
        }
    }
}

function mousePressed() {
    if (useMouseLook) {
        let canvas = document.querySelector("canvas");
        canvas.requestPointerLock();
    }
}

document.addEventListener("mousemove", (e) => {
    if (useMouseLook && document.pointerLockElement === document.querySelector("canvas")) {
        player.rotationAngle += e.movementX * 0.002; // adjust sensitivity as needed
    }
});




function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update(grid);
}

function renderMouseLookStatus()
{
    textSize(12);
    noStroke();

    if(useMouseLook)
    {
        fill("green");
    }
    else
    {
        fill("red");
    }

    text("Mouse Look: " + (useMouseLook ? "ON" : "OFF") + "(Press M)" , 10,15);
}

function draw() {
    update()
    grid.render();
    player.render();
    renderMouseLookStatus();

}

