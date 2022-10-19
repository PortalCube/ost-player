import { Howl } from "howler";
import { AudioPack } from "./audio-pack";

export type MusicData = {
    url: string;
    title: string;
    bg: string;
    loopEnd: number;
    loopStart: number;
    type: string[];
    duration: number;
    replayGain?: number;
};

export class MusicItem {
    Howl: Howl;
    Config: AudioPack;
    Data: MusicData;

    constructor(data: MusicData, config: AudioPack) {
        this.Data = data;
        this.Config = config;
        this.#CreateHowl();
    }

    #CreateHowl() {
        const [duration, loopStart, loopEnd, fadeTime] = [
            this.Data.duration,
            this.Data.loopStart,
            this.Data.loopEnd,
            10
        ].map((item) => item * 1000);
        const url = window.encodeURI(this.Config.MusicBaseURL + this.Data.url);
        this.Howl = new Howl({
            src: [url],
            sprite: {
                intro: [0, loopStart],
                loop: [loopStart, duration - loopStart - loopEnd],
                finalLoop: [loopStart, duration - loopStart - fadeTime],
                outro: [duration - fadeTime, fadeTime],
            },
            volume: Math.pow(10, this.ReplayGain / 20) || 1,
            preload: false
        });
    }

    Load() {
        if (this.State === "unloaded") {
            this.Howl.load();
        }
    }

    Unload() {
        if (this.State !== "unloaded") {
            this.Howl.unload();
            this.#CreateHowl();
        }
    }

    get State() {
        return this.Howl.state();
    }

    get Duration() {
        return this.Howl.duration();
    }

    get DataDuration() {
        return this.Data.duration;
    }

    get Volume() {
        return this.Howl.volume();
    }

    set Volume(value: number) {
        this.Howl.volume(value);
    }

    get Seek() {
        return this.Howl.seek();
    }

    set Seek(value) {
        this.Howl.seek(value);
    }

    get URL() {
        return this.Data.url;
    }

    get Name() {
        return this.Data.title;
    }

    get BackgroundImage() {
        return this.Data.bg;
    }

    get LoopStart() {
        return this.Data.loopStart;
    }

    get LoopEnd() {
        return this.Data.loopEnd;
    }

    get ReplayGain() {
        return this.Data.replayGain;
    }

    get Tags() {
        return this.Data.type;
    }
}
