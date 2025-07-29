const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const MOUSE_SENSITIVITY = 0.002;
let useMouseLook = false;

const FOV_ANGLE = 60 * (Math.PI / 180)

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;


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
        for (let i = 0; i < MAP_NUM_ROWS; i++)
        {
            for (let j = 0; j < MAP_NUM_COLS; j++)
            {
                let tileX = j * TILE_SIZE;
                let tileY = i * TILE_SIZE;
                let tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
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
        this.rotationSpeed = 3 * (Math.PI / 180); 
    }
    update(map){
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        let nextX = this.x + (Math.cos(this.rotationAngle) * this.moveSpeed) * this.walkDirection;
        let nextY = this.y + (Math.sin(this.rotationAngle) * this.moveSpeed) * this.walkDirection;

        if(!this.checkCollision(nextX,this.y,map)) {
            this.x = nextX;
        }

        if(!this.checkCollision(this.x,nextY,map))
        {
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
        const buffer = this.radius;
        const left = x - buffer;
        const right = x + buffer;
        const top = y - buffer;
        const bottom = y + buffer;

        const gridLeft = Math.floor(left / TILE_SIZE);
        const gridRight = Math.floor(right / TILE_SIZE);
        const gridTop = Math.floor(top / TILE_SIZE);
        const gridBottom = Math.floor(bottom / TILE_SIZE);

        if(
        map.grid[gridTop][gridLeft] === 1 ||
        map.grid[gridTop][gridRight] === 1 ||
        map.grid[gridBottom][gridLeft] === 1 ||
        map.grid[gridBottom][gridRight] === 1
        ) {
            return true;      
        }
        return false;

    }   
}
class Ray {
    constructor(rayAngle) {
        this.rayAngle = rayAngle;
    }
    render() {
        stroke(255,0,0,5);
        line(player.x, 
            player.y, 
            player.x + Math.cos(this.rayAngle) * 30,
            player.y + Math.sin(this.rayAngle) * 30
        )
    }
}

let grid = new Map();
let player = new Player();
let rays = [];

function keyPressed() {
    let k = key.toLowerCase();  

    if (k === "m")
    {
        useMouseLook = !useMouseLook;
        player.turnDirection = 0;

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

        if (keyCode === UP_ARROW || k === 'w') {
            player.walkDirection = +1;
        } else if (keyCode === DOWN_ARROW || k === 's') {
            player.walkDirection = -1;
        }

    if (!useMouseLook)
    {
        if (keyCode === RIGHT_ARROW || k === 'd') {
            player.turnDirection = +1;
        } else if (keyCode === LEFT_ARROW || k === 'a') {
            player.turnDirection = -1;
        }
    }
}

function keyReleased() {
    let k = key.toLowerCase();

    if (keyCode === UP_ARROW || k === 'w') {
        player.walkDirection = 0;
    } else if (keyCode === DOWN_ARROW || k === 's') {
        player.walkDirection = 0;
    }

    if (!useMouseLook) {
        if (keyCode === RIGHT_ARROW || k === 'd') {
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
        player.rotationAngle += e.movementX * MOUSE_SENSITIVITY; // adjust sensitivity as needed
    }
});


function castAllRays() {
    let columnID = 0;
    
    // start first ray substracting half of the POV
    let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

    rays = []

    // loop all columns casting the rays
    for (let i = 0; i < NUM_RAYS ; i++) {
        let ray = new Ray(rayAngle);
        // ray.cast();
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnID++;
    }
}


function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update(grid);
    castAllRays();
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
    for (ray of rays) {
        ray.render();
    }
    player.render();
    renderMouseLookStatus();

}

