// app.js
const grid = []; // Create a 2D array for the maze
const openList = [];
const closedList = [];
const rows = 10;
const cols = 10;
let startNode, endNode;

function initMaze() {
    const mazeContainer = document.getElementById('mazeContainer');
    mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${row}-${col}`;
            cell.addEventListener('click', () => toggleObstacle(row, col));
            mazeContainer.appendChild(cell);
            grid[row][col] = { row, col, g: 0, h: 0, f: 0, parent: null, isObstacle: false };
        }
    }

    // Define start and end points
    startNode = grid[0][0];
    endNode = grid[rows - 1][cols - 1];
    document.getElementById(`cell-${startNode.row}-${startNode.col}`).classList.add('start');
    document.getElementById(`cell-${endNode.row}-${endNode.col}`).classList.add('end');
}

function toggleObstacle(row, col) {
    const cell = grid[row][col];
    cell.isObstacle = !cell.isObstacle;
    document.getElementById(`cell-${row}-${col}`).classList.toggle('obstacle');
}

function startPathfinding() {
    openList.push(startNode);

    while (openList.length > 0) {
        let currentNode = openList.reduce((a, b) => (a.f < b.f ? a : b));
        if (currentNode === endNode) {
            return reconstructPath(currentNode);
        }

        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);

        for (let neighbor of getNeighbors(currentNode)) {
            if (closedList.includes(neighbor) || neighbor.isObstacle) continue;

            let tentativeG = currentNode.g + 1;
            if (!openList.includes(neighbor)) openList.push(neighbor);
            else if (tentativeG >= neighbor.g) continue;

            neighbor.g = tentativeG;
            neighbor.h = heuristic(neighbor, endNode);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = currentNode;
        }
    }
}

function getNeighbors(node) {
    const neighbors = [];
    const directions = [[0,1], [1,0], [0,-1], [-1,0]];
    for (let [dx, dy] of directions) {
        let newRow = node.row + dx, newCol = node.col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function reconstructPath(node) {
    while (node) {
        document.getElementById(`cell-${node.row}-${node.col}`).classList.add('path');
        node = node.parent;
    }
}

initMaze();
