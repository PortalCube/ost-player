import { Preference } from "./preference";
import { PreferenceUI } from "./preference-ui";
import { QueueManager } from "./queue-manager";
import { Controller } from "./controller";
import { Background } from "./background-manager";
import { WebAudio } from "./web-audio";
import { Visualizer } from "./visualizer";
import { AudioPackManifest } from "./audio-pack-manifest";

export class Player {
    Background: Background;
    Controller: Controller;
    WebAudio: WebAudio;
    Visualizer: Visualizer;
    QueueManager: QueueManager;
    PreferenceUI: PreferenceUI;
    Preference: Preference;
    AudioPackManifest = AudioPackManifest;

    constructor() {
        this.Init();
    }

    async Init() {
        this.Preference = new Preference(this);

        // 계속하기 전에 Preference의 저장된 데이터를 미리 불러오기
        await this.Preference.Load();

        this.QueueManager = new QueueManager(this);
        this.Background = new Background(this);
        this.WebAudio = new WebAudio(this);
        this.Controller = new Controller(this);
        this.Visualizer = new Visualizer(this);
        this.PreferenceUI = new PreferenceUI(this);

        const background = this.Background;

        this.WebAudio.OnNext(() => {background.Next();});
        this.WebAudio.OnPrev(() => {background.Prev();});

        // ####################
        // Debug code
        // ####################

        // @ts-ignore
        window.Kiriko = this;

        // if (window.location.hostname.endsWith("dev")) {
        //     const value = 15;
        //     this.WebAudio.Volume = value / 100;
        //     const volumeRange: HTMLInputElement = $(".volume-range");
        //     volumeRange.value = value.toString();
        // }
    }
}
