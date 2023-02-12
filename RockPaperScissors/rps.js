const CELL_ROCK = 0;
const CELL_PAPER = 1;
const CELL_SCISSORS = 2;

const CELL_ROCK_COLOR_STR = "#ff0000"; // rock, red
const CELL_PAPER_COLOR_STR = "#00ff00"; // paper, green
const CELL_SCISSORS_COLOR_STR = "#0000ff"; // scissors, blue
const CELL_UNKNOWN_COLOR_STR = "#000000"; // unknown/error, black

const CELL_DEPENDENCY = {};
CELL_DEPENDENCY[CELL_ROCK] = CELL_PAPER;
CELL_DEPENDENCY[CELL_PAPER] = CELL_SCISSORS;
CELL_DEPENDENCY[CELL_SCISSORS] = CELL_ROCK;

const CELL_THRESHOLD = 3;

function makeGrid(rowCount, colCount, fInit) {
    fInit = fInit || function() { return Math.floor(Math.random() * 3); }
    let totalCells = rowCount * colCount;
    var arr = new Array(totalCells);
    for (let i = 0; i < totalCells; i++) {
        arr[i] = fInit();
    }
    return arr;
}

function iCell(xCell, yCell, maxCol) {
    return Math.floor(yCell * maxCol + xCell);
}

function xyCell(iCell, maxCol) {
    return { 
        x: Math.floor(iCell % maxCol),
        y: Math.floor(iCell / maxCol)
    }
}

function xCell(iCell, maxCol) {
    return Math.floor(iCell % maxCol);
}

function yCell(iCell, maxCol) {
    return Math.floor(iCell / maxCol);
}

function coordinateWrap(min, v, max) {
    if (v < min) { return max - 1; }
    if (v >= max) { return min; }
    return v;
}

function iAdjacent(icell, maxCol, maxRow) {
    var neighbors = new Array();
    let xcell = xCell(icell, maxCol);
    let ycell = yCell(icell, maxCol);
    for (let dy = -1; dy < 2; dy++) {
        let yAdj = coordinateWrap(0, (ycell + dy), maxRow);
        for (let dx = -1; dx < 2; dx++) {
            let xAdj = coordinateWrap(0, (xcell + dx), maxCol);
            let iAdj = iCell(xAdj, yAdj, maxCol);
            if (iAdj != icell) {
                neighbors.push(iAdj);
            }
        }
    }
    return neighbors;
}

function cellCategories(cells, grid) {
    var categories = new Array();
    for (let i = 0; i < cells.length; i++) {
        categories.push(grid[cells[i]]);
    }
    return categories;
}

function cellCensus(cellCategories) {
    var counts = {}
    counts[CELL_ROCK] = 0;
    counts[CELL_PAPER] = 0;
    counts[CELL_SCISSORS] = 0;
    for (let i = 0; i < cellCategories.length; i++) {
        counts[cellCategories[i]] = counts[cellCategories[i]] + 1;
    }
    //console.log(`CELL COUNT TOTAL=${counts.length} ROCK=${counts[CELL_ROCK]} PAPER=${counts[CELL_PAPER]} SCISSORS=${counts[CELL_SCISSORS]}`);
    return counts;
}

function censusInnerHtml(counts) {
    return `ROCK=${counts[CELL_ROCK]} PAPER=${counts[CELL_PAPER]} SCISSORS=${counts[CELL_SCISSORS]}`;
}

function getColor(cellVal) {
    if (cellVal == CELL_ROCK) {
        return CELL_ROCK_COLOR_STR;
    } else if (cellVal == CELL_PAPER) {
        return CELL_PAPER_COLOR_STR;
    } else if (cellVal == CELL_SCISSORS) {
        return CELL_SCISSORS_COLOR_STR;
    } else {
        return CELL_UNKNOWN_COLOR_STR;
    }
}

function updateCell(icell, grid, maxCol, maxRow) {
    let neighbors = iAdjacent(icell, maxCol, maxRow);
    let adjCount = cellCensus(cellCategories(neighbors, grid));
    let countTarget = CELL_DEPENDENCY[grid[icell]];
    if (adjCount[countTarget] >= CELL_THRESHOLD) {
        return countTarget;
    }
    return grid[icell];  
}

function nextGrid(currentGrid, maxCol, maxRow) {
    var grid = new Array();
    for (let i = 0; i < (maxCol * maxRow); i++) {
        let newCat = updateCell(i, currentGrid, maxCol, maxRow);
        grid.push(newCat);
    }
    return grid;
}

function drawGrid(ctx, grid, maxRows, maxCols, cellPxSize) {
    ctx.save();
    for (let irow = 0; irow < maxRows; irow++) {
        for (let icol = 0; icol < maxCols; icol++) {
            let px = icol * cellPxSize;
            let py = irow * cellPxSize;
            ctx.beginPath();
            ctx.rect(px, py, cellPxSize, cellPxSize);
            ctx.fillStyle = getColor(grid[iCell(icol, irow, maxCols)]);
            ctx.fill();
        }
    }
    ctx.restore();
}

// g = (() => {
//     var arr = new Array(4);
//     let val = 0;
//     for (let irow = 0; irow < 4; irow++) {
//         arr[irow] = new Array(5);
//         for (let icol = 0; icol < 5; icol++) {
//             arr[irow][icol] = val;
//             val += 1;
//         }
//     }
//     return arr;
// })();