import { AudioPack } from "./audio-pack";

export class BackgroundItem {
    Path: string;
    Image: HTMLImageElement;
    Config: AudioPack;

    constructor(path: string, config: AudioPack) {
        this.Path = path;
        this.Config = config;
        this.#CreateImage();
    }

    get URL() {
        return this.Config.ImageBaseURL + this.Path;
    }

    #CreateImage() {
        this.Image = new Image();
        // this.Image.onload = () => {
        //     resolve(image);
        // };
        // this.Image.onerror = (err) => {
        //     reject(err);
        // };
    }

    Load() {
        if (this.Image.src === "") {
            this.Image.src = this.URL;
        }
    }

    Unload() {
        if (this.Image.src !== "") {
            this.Image.remove();
            this.#CreateImage();
        }
    }
}
