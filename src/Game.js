import data, {CONSTANT} from "./data.js";

export class Game {
    constructor() {
        this.select_cell = null;
        this._level = 0;
        this.level = CONSTANT.LEVEL[this._level];
        this.init();
        this.eventCenter();
    }

    newGame() {
        this.select_cell = null;
        data.pause = 0;
        this.level = CONSTANT.LEVEL[this._level];
        data.state = "start";
        data.time = 0;
        data.diff = this._level;
        $(".cell").html("").attr("data-value", '').removeClass("filled").removeClass("selected").removeClass("hover").removeAttr("data-err");
        this.initSudoku();

    }

    eventCenter() {
        $(".start-btn").click((e) => {
            let dom = $(e.currentTarget), from = dom.attr("data-from"), to = dom.attr("data-to");
            let nick_val = $("#nick-val");
            if (nick_val.val().trim() === "") {
                nick_val.addClass("input-err").one("animationend", function () {
                    $(this).removeClass("input-err");
                })
            } else {
                data.nick = nick_val.val();
                this.newGame();
                this.pageChange(from, to);
            }
        });

        $(".change-dif").click((e) => {
            this._level = this._level + 1 > CONSTANT.LEVEL_NAME.length - 1 ? 0 : ++this._level;
            data.diff = this._level;
        });

        $(document).on("click", ".cell", (e) => {
            let dom = $(e.currentTarget);
            if (dom.is(".filled")) return;
            this.select_cell = dom;
            let row = this.select_cell.attr("data-row"), col = this.select_cell.attr("data-col");
            $(".cell").removeClass('selected');
            this.select_cell.addClass("selected");
            this.hoverBg(row, col);
        }).on("click", ".number", (e) => {
            let dom = $(e.currentTarget), val = dom.attr("data-value");
            if (this.select_cell === null) return;
            this.input(val);

        }).on("keyup", (e) => {
            if (this.select_cell === null) return;
            if (e.key === "Backspace") this.remove();
            const keyMap = ['1', "2", '3', '4', "5", '6', "7", "8", "9"];
            if (keyMap.includes(e.key)) this.input(e.key);

        });

        $(".remove").click((e) => {
            this.remove();
        });


        $(".to-main").click(e => {
            let dom = $(e.currentTarget), from = dom.attr("data-from");
            this.pageChange(from, 'main');
        })

        $(".pause-btn").click(() => {
            data.pause = 1;
            openModal("pause");
        });

        $(".resume-btn").click(() => {
            data.pause = 0;
            closeModal();
        });


        $(".next-level").click(e => {
            this._level++;
            this.newGame();
            closeModal();
        })
    }


    input(val) {
        this.select_cell.html(val);
        this.select_cell.attr("data-value", val);
        let row = this.select_cell.attr("data-row"), col = this.select_cell.attr("data-col");
        this.play_arr[row][col] = val;
        this.checkErr(row, col, val);
    }

    remove() {
        if (this.select_cell === null) return;
        this.select_cell.removeClass("selected").removeClass("hover").removeAttr("data-err");
        let row = this.select_cell.attr("data-row"), col = this.select_cell.attr("data-col");
        this.select_cell.attr('data-value', 0).html('');
        this.play_arr[row][col] = 0;
        this.checkErr(row, col, this.play_arr[row][col]);
    }

    checkSudoku() {
        let zero_pos = {
            row: -1,
            col: -1,
        };
        if (!this.findZero(this.play_arr, zero_pos) && !$(".cell[data-err]").length) return true;
        let {row, col} = zero_pos;
        this.play_arr.forEach((row) => {
            row.forEach((num, j) => {
                if (this.checkBoard(this.play_arr, row, j, num)) {
                    if (this.isFull(this.play_arr)) {
                        return true;
                    } else {
                        if (this.checkSudoku()) {
                            return true;
                        }
                    }
                }
            })
        });
        return this.isFull(this.play_arr);
    }

    hoverBg(row, col) {
        $(".cell").removeClass("hover");
        //     add current row
        for (let c = 0; c < CONSTANT.cell_size; c++) {
            $(`.cell[data-row=${row}][data-col=${c}]`).addClass("hover");
        }
        // add current col
        for (let r = 0; r < CONSTANT.cell_size; r++) {
            $(`.cell[data-row=${r}][data-col=${col}]`).addClass("hover");
        }
        //     add current box
        let box_row = row - row % 3;
        let box_col = col - col % 3;
        for (let r = 0; r < CONSTANT.box_size; r++) {
            for (let c = 0; c < CONSTANT.box_size; c++) {
                $(`.cell[data-row=${r + box_row}][data-col=${c + box_col}]`).addClass("hover");
            }
        }
    }

    checkErr(row, col, value, ani = true) {
        const addErr = (cell) => {
            if (cell.attr("data-value") === value) {
                cell.attr("data-err", "true");
                this.select_cell.attr("data-err", "true");
                if (ani) {
                    cell.addClass("zoom-in").one("animationend", () => {
                        cell.removeClass('zoom-in');
                    });
                    cell.addClass("cell-err").one("animationend", () => {
                        cell.removeClass("cell-err");
                    });
                }
            }
        }
        //     add current row
        for (let c = 0; c < CONSTANT.cell_size; c++) {
            let cell = $(`.cell[data-row=${row}][data-col=${c}]`);
            if (!cell.is(".selected")) addErr(cell);
        }
        // add current col
        for (let r = 0; r < CONSTANT.cell_size; r++) {
            let cell = $(`.cell[data-row=${r}][data-col=${col}]`);
            if (!cell.is(".selected")) addErr(cell);
        }
        //     add current box
        let box_row = row - row % 3;
        let box_col = col - col % 3;
        for (let r = 0; r < CONSTANT.box_size; r++) {
            for (let c = 0; c < CONSTANT.box_size; c++) {
                let cell = $(`.cell[data-row=${r + box_row}][data-col=${c + box_col}]`);
                if (!cell.is(".selected")) addErr(cell);
            }
        }
    }

    initSudoku() {
        // 初始化所有格子为0
        let arr = Array.from({length: CONSTANT.cell_size}, () => Array(CONSTANT.cell_size).fill(0));
        // 将所有格子都填写为数字,并且不为0
        let check = this.fillNumber(arr);
        //如果都不为0
        if (check) {
            // 将玩家可交互的格子进行提取
            this.play_arr = this.removeCell(arr);
            //设置上初始数组
            this.original = arr;
            for (let row = 0; row < CONSTANT.cell_size; row++) {
                for (let col = 0; col < CONSTANT.cell_size; col++) {
                    if (this.play_arr[row][col] !== 0) {
                        $(`.cell[data-row=${row}][data-col=${col}]`).html(this.play_arr[row][col]).addClass("filled").attr("data-value", this.play_arr[row][col]);
                    }
                }
            }
        }
    }

    fillNumber(arr) {
        let zero_pos = {
            row: -1,
            col: -1,
        }
        // 如果没有找到0,说明所有的格子都被填写
        if (!this.findZero(arr, zero_pos)) return true;
        let number_list = shuffle([...CONSTANT.number]);
        let {row, col} = zero_pos;
        number_list.forEach(num => {
            if (this.checkBoard(arr, row, col, num)) {
                arr[row][col] = num;

                if (this.isFull(arr)) {
                    return true;
                } else {
                    if (this.fillNumber(arr)) {
                        return true;
                    }
                }

                arr[row][col] = 0;
            }
        });

        return this.isFull(arr);
    }

    removeCell(arr) {
        let res = [...arr];
        let need_remove = this.level;
        while (need_remove > 0) {
            let row = rand();
            let col = rand();
            while (res[row][col] === 0) {
                row = rand();
                col = rand();
            }
            res[row][col] = 0;
            need_remove--;
        }
        return res;
    }

    isFull(arr) {
        return arr.every((row, i) => {
            return row.every((num, j) => {
                return num !== 0;
            })
        })
    }

    checkBoard(board, row, col, val) {
        return this.checkRow(board, row, val) && this.checkCol(board, col, val) && this.checkBox(board, row - row % 3, col - col % 3, val) && val !== 0;
    }

    checkRow(board, row, val) {
        for (let col = 0; col < CONSTANT.cell_size; col++) {
            if (board[row]?.[col] === val) return false;
        }
        return true;
    }

    checkCol(board, col, val) {
        for (let row = 0; row < CONSTANT.cell_size; row++) {
            if (board[row]?.[col] === val) return false;
        }
        return true;
    }


    checkBox(board, box_row, box_col, val) {
        for (let row = 0; row < CONSTANT.box_size; row++) {
            for (let col = 0; col < CONSTANT.box_size; col++) {
                if (board[row + box_row][col + box_col] === val) return false;
            }
        }
        return true;
    }

    findZero(arr, zero_pos) {
        for (let row = 0; row < CONSTANT.cell_size; row++) {
            for (let col = 0; col < CONSTANT.cell_size; col++) {
                if (arr[row][col] === 0) {
                    zero_pos.row = row;
                    zero_pos.col = col;
                    return true;
                }
            }
        }
        return false;
    }

    init() {
        if (localStorage.game) $(".continue-btn").show();
        this.initCell();
        this.initNumber();
    }


    initCell() {
        for (let row = 0; row < CONSTANT.cell_size; row++) {
            for (let col = 0; col < CONSTANT.cell_size; col++) {
                let cell = $(`<div class="cell" data-row="${row}" data-col="${col}"></div>`).appendTo(".game-board");
                if (row === 2 || row === 5) cell.css({margin: `0 0 10px 0`});
                if (col === 2 || col === 5) cell.css({margin: `0 10px 0 0`});
            }
        }
    }

    initNumber() {
        for (let i = 0; i < CONSTANT.number.length; i++) {
            $(`<div class="number grid" data-value="${i + 1}">${i + 1}</div>`).insertBefore(".remove");
        }
    }


    pageChange(from, to) {
        closeModal();
        if (to === "main") {
            data.state = "ready";
        }
        from = `.${from}-page`
        to = `.${to}-page`
        $(from).slideUp(300, function () {
            $(to).fadeIn(300);
        })
    }

}