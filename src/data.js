let data = new Proxy({
    nick: ",",
    diff: null,
    time: 0,
    pause: 0,
    state: "ready"
}, {
    set(target, key, value) {
        ({
            nick() {
                $(".nick-value").html(value);
            },
            time() {
                let m = Math.floor(value / 60);
                let s = Math.floor(value % 60);
                $(".time-value").html(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
            },
            pause() {
                value ? $(".pause-btn").css({
                    background: "#ff3f3f",
                    color: "#fff"
                }) : $(".pause-btn").css({background: "", color: ""});
            },
            diff() {
                $(".change-dif").html(CONSTANT.LEVEL_NAME[value]).attr("data-dif", value);
                $(".dif-value").html(`${CONSTANT.LEVEL_NAME[value]}`);
            }

        })?.[key]?.();


        Reflect.set(target, key, value);
        return true;
    }
});


export const CONSTANT = {
    cell_size: 9,
    box_size: 3,
    number: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: [
        "Easy",
        "Medium",
        "Hard",
        "Very Hard",
        "Insane",
        "Inhuman",
    ],
    LEVEL: [29, 38, 47, 56, 65, 75],
}


export default data;