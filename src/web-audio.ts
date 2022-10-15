import { Howl, Howler, HowlOptions } from "howler";
import { MusicItem } from "./music-item";
import { MusicList } from "./music-list";
import EventEmitter from "events";
import { Lerp } from "./util";
import { Player } from "./player";

export type WebAudioSprite = "intro" | "loop" | "finalLoop" | "outro";

export class WebAudio {
    #Player: Player = null;
    #EventEmitter: EventEmitter = null;
    MasterNode: GainNode = this.AudioContext.createGain();
    State: WebAudioSprite = "intro";
    ID: number = null;
    PlayCount = 0;
    BlankTime = 300;
    #BlankTimer = 0;

    get Volume() {
        return this.MasterNode.gain.value;
    }

    set Volume(value) {
        this.MasterNode.gain.value = value;
    }

    get AudioContext() {
        //@ts-ignore
        return Howler.ctx;
    }

    get MasterGain() {
        //@ts-ignore
        return Howler.masterGain;
    }

    get List() {
        return this.#Player.QueueManager.MusicList;
    }

    get LoopTime() {
        return this.#Player.Preference.RepeatTime;
    }

    get Current() {
        return this.List.Current;
    }

    get Duration() {
        return this.LoopCount === -1 ? 0 : this.Current.Duration * this.LoopCount;
    }

    get Seek() {
        return this.Current.Duration * this.PlayCount + this.Current.Seek;
    }

    set Seek(value) {
        this.PlayCount = Math.floor(value / this.Current.Duration);
        this.Current.Seek = value - this.PlayCount * this.Current.Duration;
    }

    get LoopCount() {
        if (this.LoopTime === -1) {
            return 0;
        } else {
            return Math.max(1, Math.ceil((this.LoopTime - 45) / this.Current.Duration));
        }
    }

    constructor(player: Player) {
        this.#Player = player;

        // 비어있는 Howl를 호출하여 AudioContext와 MasterGain 가져오기.
        new Howl({ src: [""] });

        this.Volume = 0.5;
        this.#EventEmitter = new EventEmitter();

        // MasterGain의 역할을 FinalNode에게 이관
        this.MasterNode.connect(this.AudioContext.destination);
        this.MasterGain.disconnect(this.AudioContext.destination);
    }

    PlaySprite(state: WebAudioSprite) {
        this.ID = this.Current.Howl.play(state);
        this.State = state;
    }

    Play() {
        if (this.Seek === 0) {
            const controller = this.#Player.Controller;
            this.Current.Howl.on("end", this.#OnSpriteEnd.bind(this));
            this.Current.Howl.on("stop", controller.UpdatePlayButton.bind(controller));
            this.Current.Howl.on("play", controller.UpdatePlayButton.bind(controller));
            this.Current.Howl.on("pause", controller.UpdatePlayButton.bind(controller));
            if (this.Current.LoopStart < 0.2) {
                if (this.LoopCount > 1) {
                    this.PlaySprite("loop");
                } else {
                    this.PlaySprite("finalLoop");
                }
            } else {
                this.PlaySprite("intro");
            }
        } else {
            this.Current.Howl.play(this.ID);
            if (this.State === "outro" && this.PlayCount >= this.LoopCount) {
                const duration = this.Current.DataDuration - this.Current.Howl.seek();
                const startVolume = this.Current.ReplayGain;
                const from = Lerp(startVolume, 0, (10 - duration) / 10);
                this.Current.Howl.fade(from, 0, duration * 1000, this.ID);
            }
        }
    }

    Pause() {
        this.Current.Howl.pause();
    }

    Stop() {
        this.Current.Unload();
        this.State = "intro";
        this.PlayCount = 0;
    }

    Next() {
        this.Stop();
        this.List.Next();
        this.#EventEmitter.emit("next", this.Current);
        window.clearTimeout(this.#BlankTimer);
        this.#BlankTimer = window.setTimeout(this.Play.bind(this), this.BlankTime);
    }

    Prev() {
        this.Stop();
        this.List.Prev();
        this.#EventEmitter.emit("prev", this.Current);
        window.clearTimeout(this.#BlankTimer);
        this.#BlankTimer = window.setTimeout(this.Play.bind(this), this.BlankTime);
    }

    OnNext(value: (item?: MusicItem) => any) {
        this.#EventEmitter.on("next", value);
    }

    OnPrev(value: (item?: MusicItem) => any) {
        this.#EventEmitter.on("prev", value);
    }

    OnLoop(value: () => any) {
        this.#EventEmitter.on("loop", value);
    }

    #OnSpriteEnd() {
        console.log(this.State, "Ended");
        if (this.State === "intro") {
            if (this.LoopCount > 1) {
                this.PlaySprite("loop");
            } else {
                this.PlaySprite("finalLoop");
            }
        } else if (this.State === "loop") {
            this.PlayCount++;
            if (this.PlayCount >= this.LoopCount - 1) {
                this.PlaySprite("finalLoop");
            } else {
                this.PlaySprite("loop");
            }
        } else if (this.State === "finalLoop") {
            const startVolume = this.Current.ReplayGain;
            this.Current.Howl.fade(startVolume, 0, 10 * 1000, this.ID);
            this.PlaySprite("outro");
        } else {
            this.Next();
        }
    }
}
