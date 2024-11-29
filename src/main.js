import {Game} from "./Game.js";
import data, {CONSTANT} from "./data.js";
import {Timer} from "./Timer.js";

game = new Game();

let timer = new Timer();

timer.update = (fps) => {
    data.state === "start" && !data.pause && (data.time += fps);
    data.state === "start" && checkAll();
}
timer.start();

function checkAll() {
    let cells = $(".cell[data-err='true']");
    if (!cells.length && game.checkSudoku()) {
        data.state = "ready";
        if (game._level + 1 > CONSTANT.LEVEL.length - 1) $(".next-level").hide();
        openModal("win");
    }
    cells.each((index, item) => {
        let row = $(item).attr("data-row") * 1, col = $(item).attr("data-col") * 1, val = $(item).attr("data-value");
        let has_repeat = false;
        //     check row
        for (let c = 0; c < 9; c++) {
            if (c === col) {
                continue;
            }
            let value = $(`.cell[data-row=${row}][data-col=${c}]`).attr("data-value");
            if (value === val) {
                has_repeat = true;
                break;
            }
        }

        if (!has_repeat) {
            //     check col
            for (let r = 0; r < 9; r++) {
                if (r === row) continue;
                let value = $(`.cell[data-row=${r}][data-col=${col}]`).attr("data-value");
                if (value === val) {
                    has_repeat = true;
                    break;
                }
            }
        }

        //     check current box
        let box_row = row - row % 3;
        let box_col = col - col % 3;
        if (!has_repeat) {
            out: for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (r + box_row === row && c + box_col === col) continue;
                    let value = $(`.cell[data-row=${r + box_row}][data-col=${c + box_col}]`).attr("data-value");
                    if (value === val) {
                        has_repeat = true;
                        break out;
                    }
                }
            }
        }

        !has_repeat && $(item).removeAttr("data-err");
    })
}
