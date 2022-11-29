
function makeGrid(rowCount, colCount, fInit) {
    fInit = fInit || function() { return Math.floor(Math.random() * 3); }
    var arr = new Array(rowCount);
    for (let irow = 0; irow < rowCount; irow++) {
        arr[irow] = new Array(colCount);
        for (let icol = 0; icol < colCount; icol++) {
            arr[irow][icol] = fInit();
        }
    }
    return arr;
}

function getColor(cellVal) {
    if (cellVal == 0) {
        return "#ff0000"; // rock, red
    } else if (cellVal == 1) {
        return "#00ff00"; // paper, green
    } else if (cellVal == 2) {
        return "#0000ff"; // scissors, blue
    } else {
        return "#000000"; // unknown/error, black
    }
}

function drawGrid(ctx, grid, maxRows, maxCols, cellPxSize) {
    ctx.save();
    for (let irow = 0; irow < maxRows; irow++) {
        for (let icol = 0; icol < maxCols; icol++) {
            let px = icol * cellPxSize;
            let py = irow * cellPxSize;
            ctx.beginPath();
            ctx.rect(px, py, cellPxSize, cellPxSize);
            ctx.fillStyle = getColor(grid[irow][icol]);
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