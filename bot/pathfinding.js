function getPath(grid, start, end) {    //A* algorithm
    let rows = grid[0].length;
    let cols = grid.length;
    let map = new Array(rows);
    //console.log(start);
    //console.log("pathFinding: ", end)

    let path = [];

    let openList = [];
    let closedList = [];

    function Spot(i, j) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
    
        this.i = i;
        this.j = j;
    
        this.obstacle = false;

        this.neighbors = [];
        this.previous = undefined;
    
        this.addNeighbors = function(grid) {
            let i = this.i;
            let j = this.j;
    
            if (j < cols - 1) { //if on right edge
                this.neighbors.push(grid[i][j+1]);
            }
            if (j > 0) { //if on right edge
                this.neighbors.push(grid[i][j-1]);
            }
            if (i < rows- 1) { //if on top
                this.neighbors.push(grid[i+1][j]);
            }
            if (i > 0) { //if on botoom
                this.neighbors.push(grid[i-1][j]);
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        map[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            map[i][j] = new Spot(i, j);
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            map[i][j].addNeighbors(map);
        }
    }

    let startSpot = map[start[0]][start[1]];
    let endSpot = map[end[0]][end[1]];

    //Debug 
   /* 
    this.graphics = game.add.graphics(0, 0);
    this.graphics.beginFill(0x32a852);
    this.graphics.drawRect(start[0] * 32,start[1] * 32,32,32);

    this.graphics = game.add.graphics(0, 0);
    this.graphics.beginFill(0x32a852);
    this.graphics.drawRect(end[0] * 32, end[1] * 32,32,32);
    this.graphics = game.add.graphics(0, 0);*/
    //this.graphics.beginFill(0xff00fb); //begin fill to show obstacles on the map
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j].index != -1) {
                map[j][i].obstacle = true;
                //this.graphics.drawRect(j * 32,i * 32, 32,32); //Debug obstacles
            }
        }        
    }
    

    //Adding obstacles because some collisions are custom-made
    /*map[19][10].obstacle = true;
    map[19][9].obstacle = true;
    map[19][12].obstacle = true;
    map[19][13].obstacle = true;
    map[19][14].obstacle = true;*/

    openList.push(startSpot);

    while (openList.length > 0) {    
        let best = 0;

        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[best].f) { //if cost to get there is lower than current best
                best = i;
            }
        }

        let current = openList[best];

        if (current == endSpot) {   //we found a path
            let tmp = current;
            path.push(tmp);
            while (tmp.previous) {
                path.push(tmp.previous);
                tmp = tmp.previous;
            }
            break;
        }

        remove(openList, current);
        closedList.push(current);

        startSpot.obstacle = false;
        endSpot.obstacle = false;

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedList.includes(neighbor) && !neighbor.obstacle) {
                let tempG = neighbor.g + 1;
                if (openList.includes(neighbor)) {  //if we've already visited the spot
                    if (tempG < neighbor.g) {   //if we've found a better way to get there, we replace its cost
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g  = tempG;
                    openList.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, endSpot);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
    }
    return getDirections(path);
}

function remove(array, element) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}

function heuristic (a,b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function getDirections(path) {
    let directions = [];
    let dir;
    for (let i = path.length - 1; i > 0; i--) {
        let previous = path[i];
        let next = path[i-1];
        if (previous.i == next.i - 1) {
            dir = Directions.RIGHT;
        }
        if (previous.i == next.i + 1) {
            dir = Directions.LEFT;
        }
        if (previous.j == next.j - 1) {
            dir = Directions.BOTTOM;
        }
        if (previous.j == next.j + 1) {
            dir = Directions.TOP;
        }
        directions.push(dir);
    }
    return directions;
}

const Directions = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3
}