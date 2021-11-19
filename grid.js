let gridSize = 50;
const INIT_FIBONACCI_SIZE = 10;
const FIBONACCI_RANGE = 5;
/**
 * initialize `fibonacciSequence` array with a sequence of first 10 fibonacci numbers.
 * this will later be used to check if any 5 consecutive cells in a row or a column are fibonacci numbers. 
 */
const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const CELL_HIGHLIGHT_PERIOD_MILLIS = 750;
  
document.addEventListener("DOMContentLoaded", function() {
    addChangeListenerToGridSize();
    initGrid();
  });

/**
 * initialize grid with rows and columns based on `gridSize`
 */
function initGrid() {
  const container = document.querySelector(".container");
  // iteration for adding rows
  for (let rowIdx = 0; rowIdx < gridSize; rowIdx++) {
    // add a row
    const row = addRow(container);
    // iteration for adding columns
    for (let colIdx = 0; colIdx < gridSize; colIdx++) {
      // add a cell for each column of a given row
      addColumn(row, rowIdx, colIdx);
    }
  }
}

/**
 * add a row in a given `container` div
 */
function addRow(container) {
  // create a new div element
  const rowDiv = document.createElement("div");
  // assign `row` css class
  rowDiv.className = 'row';
  // add the new div element to `container` div
  container.append(rowDiv);
  return rowDiv;
}

/**
 * add a column cell in a given `row` div.
 * the `rowIdx` and `colIdx` params will used as the data attributes and identifiers for the selection of this cell.  
 */
function addColumn(rowDiv, rowIdx, colIdx) {
  // create a new div element
  const colDiv = document.createElement("div");
  // assign `column` css class
  colDiv.className = 'column';
  // below we set the given `rowIdx` and `colIdx` params as data attributes for this cell
  colDiv.dataset.row = rowIdx;
  colDiv.dataset.col = colIdx;
  // register click listener for this cell
  colDiv.addEventListener('click', onCellClick);
  // add the new div element to `rowDiv` div
  rowDiv.append(colDiv);
}

/**
 * listener for click on a cell
 */ 
function onCellClick(event) {
    const targetElement = event.target || event.srcElement;
    // increment all cells of a row where the user clicked and highlight them with yellow color 
    incrementRow(targetElement.dataset.row);
    // increment all cells of a column where the user clicked and highlight them with yellow color 
    incrementColumn(targetElement.dataset.row, targetElement.dataset.col);
    // timeout to clear the highlighted yellow cells 
    setTimeout(function() {
      document.querySelectorAll('.highlight-yellow').forEach((element) => element.classList.remove('highlight-yellow'));
    }, CELL_HIGHLIGHT_PERIOD_MILLIS);
    // check entire grid (row-wise and column-wise) for any 5 consecutive fibonnaci sequence numbers and clear them and highlight them with green color
    checkFibonacciSequence();
    // timeout to clear the highlighted green cells     
    setTimeout(function() {
      document.querySelectorAll('.highlight-green').forEach((element) => element.classList.remove('highlight-green'));
    }, CELL_HIGHLIGHT_PERIOD_MILLIS);  
}

/**
 * increment value of all cells in a given `rowIdx` row and highlight them with yellow color.
 */ 
function incrementRow(rowIdx) {
  document.querySelectorAll("[data-row='" + rowIdx + "']").forEach((element) => {
    // assign `highlight-yellow` css class 
    element.classList.add('highlight-yellow');
    // increment cell value by 1
    element.innerHTML++;
  });
}

/**
 * increment value of all cells in a given `colIdx` column and highlight them with yellow color.
 * the `rowIdx` param in addition to the `colIdx` param help avoid duplicate increment of clicked cell.
 */ 
function incrementColumn(rowIdx, colIdx) {
  document.querySelectorAll("[data-col='" + colIdx + "']").forEach((element) => {
    /** 
     * check if this cell was clicked based on the `rowIdx` and `colIdx` params.
     * if yes, then skip this cell as it was already incremented in `incrementRow` call. 
     */ 
    if (element.dataset.row === rowIdx && element.dataset.col === colIdx) return;
    // assign `highlight-yellow` css class 
    element.classList.add('highlight-yellow');
    // increment cell value by 1
    element.innerHTML++;
  });
}

/**
 * check the entire grid for any consecutive fibonacci sequence of 5 cells in a row and column.
 * if found, clear the cells and highlight them with green color.
 */ 
function checkFibonacciSequence() {
  // select all cells
  const cells = document.querySelectorAll(".column");
  // iteration over entire grid cells to check for matching consecutive sequence of 5 fibonnaci numbers
  for (const cell of cells) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellVal = cell.innerHTML;
    // call to get a consecutive sequence of 5 fibonacci sequence numbers starting with the given cell value i.e. `cellVal`
    const consecutiveFibonacciSequence = getConsecutiveFibonnaciSequence( parseInt(cellVal) );
    
    // skip the iteration if the cell value i.e. `cellVal` does not exist in fibonnaci series
    if (consecutiveFibonacciSequence.length === 0) 
      continue;

    const matchingConsecutiveFibonnaciSequenceCells = [];
    
    // check if a sequence of 5 consecutive fibonacci numbers is found in a row starting from `cell`
    if (col + FIBONACCI_RANGE <= gridSize) {
      matchingConsecutiveFibonnaciSequenceCells.push(...checkFibonacciSequenceInRow(row, col, consecutiveFibonacciSequence));
    }

    // check if a sequence of 5 consecutive fibonacci numbers is found in a column starting from `cell`    
    if (row + FIBONACCI_RANGE <= gridSize) {
      matchingConsecutiveFibonnaciSequenceCells.push(...checkFibonacciSequenceInCol(row, col, consecutiveFibonacciSequence));
    }
    
    // clearing and highlighting the identified cells with green color
    if (matchingConsecutiveFibonnaciSequenceCells.length > 0) {
      matchingConsecutiveFibonnaciSequenceCells.forEach((element) => {
        element.classList.add('highlight-green');
        element.innerHTML = '';
      });
    }
  }
}

/**
 * since the initial `fibonacciSequence` array contains only a sequence of first 10 fibonacci numbers,
 * this method checks if there are 5 consectuive fibonnaci numbers present in `fibonacciSequence` array, starting from the given cell value.
 * if not, then add 5 more elements to the `fibonacciSequence` array.
 */ 
function getConsecutiveFibonnaciSequence(val) {
  const consecutiveFibonacciSequence = [];
  /** 
   * check if the `val` of the cell is less than the last 5th element of the `fibonacciSequence` array 
   * if not, then increase the fibonacci sequence by adding 5 more numbers in the `fibonacciSequence` array for the purpose of matching consecutive fibonnaci sequence
   */
  if (fibonacciSequence[fibonacciSequence.length - FIBONACCI_RANGE] < val) {
    updateFibonacciSequence(val);
  }

  // iteration to select a sequence of 5 fibonnaci numbers from `fibonacciSequence` array, starting with the given `val` 
  for (let seqIdx = 0; seqIdx < fibonacciSequence.length; seqIdx++) {
    // if the fibonnaci value at `fibonacciSequence[seqIdx]` is greater than the `val`, then stop and return empty array. 
    if (fibonacciSequence[seqIdx] > val) {
      return [];
    }

    // once a match is found for the `val` inside the `fibonacciSequence` array, then collect 5 subsequent numbers from the `fibonacciSequence` array 
    if (fibonacciSequence[seqIdx] == val) {
      let counterIdx = 0;
      while (counterIdx < FIBONACCI_RANGE) {
        consecutiveFibonacciSequence.push(fibonacciSequence[seqIdx + counterIdx]);
        counterIdx++;
      }
      break;
    }
  }
  return consecutiveFibonacciSequence;
}

/**
 * this function adds 5 more consecutive fibonacci numbers to `fibonacciSequence` array
 */ 
function updateFibonacciSequence() {
  for (let seqIdx = 0; seqIdx < FIBONACCI_RANGE; seqIdx++) {
    fibonacciSequence.push(fibonacciSequence[fibonacciSequence.length - 1] + fibonacciSequence[fibonacciSequence.length - 2]);
  }
}

/**
 * check if a sequence of 5 consecutive fibonnaci numbers exists in 5 adjacent cells in row begining from (`row`, `col`)
 * if a match is found then return array of matching cells
 */ 
function checkFibonacciSequenceInRow(row, col, consecutiveFibonacciSequence) {
  let consecutiveFibonacciSequenceCells = [];

  // iteration to find a matching fibonacci numbers sequence in 5 consecutive cells (row-wise)
  for (let colIdx = 0; colIdx < FIBONACCI_RANGE; colIdx++) {
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col+colIdx}']`);
    if (consecutiveFibonacciSequence[colIdx] !== parseInt(cell.innerHTML)) {
      consecutiveFibonacciSequenceCells = [];
      break;
    }
    consecutiveFibonacciSequenceCells.push(cell);
  }

  // this condition handles an exceptional case where the sequence is [1, 1, 2, 3, 5]
  if (consecutiveFibonacciSequenceCells.length === 0 && consecutiveFibonacciSequence[0] === 1) {
    // This is a special case of [1, 1, 2, 3, 5]
    let consecutiveFibonacciSequence = [1, 1, 2, 3, 5];

    // iteration to find a matching fibonacci numbers sequence in 5 consecutive cells (row-wise)
    for (let colIdx = 0; colIdx < FIBONACCI_RANGE; colIdx++) {
      let cell = document.querySelector(`[data-row='${row}'][data-col='${col+colIdx}']`);
      if (consecutiveFibonacciSequence[colIdx] !== parseInt(cell.innerHTML)) {
        consecutiveFibonacciSequenceCells = [];
        break;
      }
      consecutiveFibonacciSequenceCells.push(cell);
    }
  }
  return consecutiveFibonacciSequenceCells;
}

/**
 * check if a sequence of 5 consecutive fibonnaci numbers exists in 5 adjacent cells in column begining from (`row`, `col`)
 * if a match is found then return array of matching cells
 */ 
function checkFibonacciSequenceInCol(row, col, consecutiveFibonacciSequence) {
  let consecutiveFibonacciSequenceCells = [];

  // iteration to find a matching fibonacci numbers sequence in 5 consecutive cells (column-wise)
  for (let rowIdx = 0; rowIdx < FIBONACCI_RANGE; rowIdx++) {
    let cell = document.querySelector(`[data-row='${row+rowIdx}'][data-col='${col}']`);
    if (consecutiveFibonacciSequence[rowIdx] !== parseInt(cell.innerHTML)) {
      consecutiveFibonacciSequenceCells = [];
      break;
    }
    consecutiveFibonacciSequenceCells.push(cell);
  }

  // this condition handles an exceptional case where the sequence is [1, 1, 2, 3, 5]
  if (consecutiveFibonacciSequenceCells.length === 0 && consecutiveFibonacciSequence[0] === 1) {
    // This is a special case of [1, 1, 2, 3, 5]
    let consecutiveFibonacciSequence = [1, 1, 2, 3, 5];

    // iteration to find a matching fibonacci numbers sequence in 5 consecutive cells (row-wise)
    for (let rowIdx = 0; rowIdx < FIBONACCI_RANGE; rowIdx++) {
      let cell = document.querySelector(`[data-row='${row+rowIdx}'][data-col='${col}']`);
      if (consecutiveFibonacciSequence[rowIdx] !== parseInt(cell.innerHTML)) {
        consecutiveFibonacciSequenceCells = [];
        break;
      }
      consecutiveFibonacciSequenceCells.push(cell);
    }
  }
  return consecutiveFibonacciSequenceCells;
}

/**
 * listener for grid size input field
 */ 
function addChangeListenerToGridSize() {
    document.querySelector('input[type="number"]').addEventListener('change', function(e) {
      redrawGrid(e.target.value);
    });
}

/**
 * redraws grid based on the given `size`
 */ 
function redrawGrid(size) {
  const container = document.querySelector(".container");
  container.innerHTML = '';
  gridSize = size;
  initGrid();
}