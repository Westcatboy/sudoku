let game = null;

function openModal(which) {
    which = `.${which}-modal`
    $(which).show();
}

function closeModal() {
    $(".modal").slideUp(300);
}

function shuffle(arr) {
    let curr_len = arr.length;

    while (curr_len !== 0) {
        let ran_index = Math.floor(Math.random() * curr_len);
        curr_len -= 1;
        let temp = arr[curr_len];
        arr[curr_len] = arr[ran_index];
        arr[ran_index] = temp;
    }
    return arr;
}

function rand() {
    return Math.floor(Math.random() * 9);
}