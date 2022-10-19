import { Player } from "./player";
import { $, $$ } from "./util";

export class Controller {
    Player: Player;

    constructor(player: Player) {
        this.Player = player;
        this.Init();
    }

    async Init() {
        this.InitFunction();
        this.InitAnimation();
        this.InitResizeObserver();
    }

    InitFunction() {
        const getButton = (selector: string): HTMLButtonElement => $(selector);
        const getInput = (selector: string): HTMLInputElement => $(selector);
        const webAudio = this.Player.WebAudio;

        getButton(".play-button").onclick = () =>
            webAudio.Current.Howl.playing() ? webAudio.Pause() : webAudio.Play();
        getButton(".next-button").onclick = () => webAudio.Next();
        getButton(".prev-button").onclick = () => webAudio.Prev();
        // getButton(".like-button").onclick = () => Favorite.Toggle();

        getInput(".volume-range").oninput = (event) => {
            const target = event.target as HTMLInputElement;
            webAudio.Volume = Number(target.value) / 100;
        };
    }

    InitAnimation() {
        const controller = $(".player");
        const canvas = $("canvas");

        let timer: ReturnType<typeof setTimeout> = null;

        const enter = () => {
            clearTimeout(timer);
            timer = null;
            controller.classList.add("visible");
        };

        const leave = () => {
            timer = setTimeout(() => {
                controller.classList.remove("visible");
            }, 1000);
        };

        leave();

        canvas.addEventListener("pointerenter", enter);
        canvas.addEventListener("pointerleave", leave);
        controller.addEventListener("pointerenter", enter);
        controller.addEventListener("pointerleave", leave);
    }

    InitResizeObserver() {
        const controller = $(".player") as HTMLDivElement;
        const canvas = $("canvas");

        const observer = new ResizeObserver((entries) => {
            console.log(entries);
            for (const entry of entries) {
                controller.style.width = Math.ceil(entry.contentRect.width) + 1 + "px";
                controller.style.height = Math.ceil(entry.contentRect.height) + 1 + "px";
            }
        });

        observer.observe(canvas);
    }

    UpdatePlayButton() {
        const getButton = (selector: string): HTMLSpanElement => $(selector);
        const isPlaying = this.Player.WebAudio.Current.Howl.playing();

        getButton(".play-button > .material-icons").textContent = isPlaying
            ? "pause"
            : "play_arrow";
    }
}
