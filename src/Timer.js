export class Timer {
    constructor(fps = 1 / 60) {
        let accTime = 0;
        let lastTime = 0;
        this.updateProxy = (time) => {
            accTime += (time - lastTime) / 1000;
            while (accTime > fps) {
                accTime -= fps;
                this.update(fps);
            }
            lastTime = time;
            this.enqueue();
        }
    }


    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.enqueue();
    }
}