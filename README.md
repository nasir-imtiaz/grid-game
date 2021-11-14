# grid-game
A vanilla HTML, CSS and JavaScript based grid game.

Supported browsers: **Chrome**, **Firefox** and **Edge**. (not tested on **Safari**)
### Features
- The grid size can be changed with the help of the input component provided on the page.
- The grid has a responsive design.
- The project uses plain vanilla **HTML**, **CSS** and **JavaScript**.
- Clicking on a cell in the grid highlights and increments the cell value by `1` for all the cells in the same row and column with respect to the clicked cell.
- If 5 consecutive cells match with a sequence of 5 consecutive fibonnaci numbers (in a row or column), then those cells are cleared and highlighted with green color.
### How to run:
- clone this project into your local directory
```bash
git clone https://github.com/nasir-imtiaz/grid-game.git
```
- change directory to `grid-game` and open the `index.html` file in your favorite browser.
### How to use:
- The application page displays an input field to specify the size of the grid (initially set to `50`) and a grid underneath.
- The input field is an HTML input of type number and using the built-in controls, the user can increase or reduce the size of the grid (Min: 5, Max: 50).
- Clicking a cell in the grid,  
  - increments the value of the cell and all the cells in the same row and column by `1`. If no value is present in the cell then the cell displays a value `1`.
  - the above follows with all the impacted cells highlighted in yellow for a brief period.
  - if 5 consecutive cells in the grid match with a sequence of 5 consecutive fibonnaci numbers (in a row or column), then those cells are cleared and highlighted with green color.
