import { Player } from "./player";
import { WebAudio } from "./web-audio";
import { Background } from "./background-manager";
import { $, ConvertTime } from "./util";

const fftSize = 2 ** 13;
const smoothingTimeConstant = 0.5;
const minDecibels = -140;
const maxDecibels = -20;

const boxHeight = 160;
const barWidth = 12;

// AudioContext 및 MasterGain 가져오기

export class Visualizer {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    #WebAudio: WebAudio;
    #Background: Background;
    #DataArray: Uint8Array;
    #Analyser: AnalyserNode;

    get Config() {
        return this.#WebAudio.Current.Config;
    }

    get Title() {
        return this.Config.Title;
    }
    get Description() {
        return this.Config.Description;
    }
    get ScreenWidth() {
        return this.Config.ScreenWidth;
    }
    get ScreenHeight() {
        return this.Config.ScreenHeight;
    }

    get #Image() {
        return this.#Background.Current.Image;
    }

    constructor(player: Player) {
        // 다른 컴포넌트 세팅
        this.#WebAudio = player.WebAudio;
        this.#Background = player.Background;

        const audioContext = this.#WebAudio.AudioContext;
        const masterGain = this.#WebAudio.MasterGain;

        // Canvas, CTX 세팅
        this.canvas = $("canvas");
        this.ctx = this.canvas.getContext("2d");

        // Analyser 연결
        // MasterGain -> Analyser -> FinalNode -> destination
        this.#Analyser = audioContext.createAnalyser();
        masterGain.connect(this.#Analyser);
        this.#Analyser.connect(this.#WebAudio.MasterNode);

        // Analyser 설정
        this.#Analyser.fftSize = fftSize;
        this.#Analyser.smoothingTimeConstant = smoothingTimeConstant;
        this.#Analyser.minDecibels = minDecibels;
        this.#Analyser.maxDecibels = maxDecibels;

        // DataArray 세팅
        this.#DataArray = new Uint8Array(this.#Analyser.frequencyBinCount);

        // 텍스트 베이스라인 세팅
        this.ctx.textBaseline = "middle";

        this.StartRender();
    }

    ClearCanvas() {
        this.canvas.width = this.ScreenWidth;
        this.canvas.height = this.ScreenHeight;
        this.ctx.clearRect(0, 0, this.ScreenWidth, this.ScreenHeight);
    }

    DrawImage() {
        if (this.#Image && this.#Image.complete) {
            // console.log(this.#Image.src);

            const imageScale =
                this.ScreenWidth < this.ScreenHeight
                    ? this.ScreenWidth / this.#Image.width
                    : this.ScreenHeight / this.#Image.height;
            const imageWidth = this.#Image.width * imageScale;
            const imageHeight = this.#Image.height * imageScale;
            const imageX = this.ScreenWidth / 2 - imageWidth / 2;
            const imageY = this.ScreenHeight / 2 - imageHeight / 2;
            // console.log(imageScale);

            this.ctx.drawImage(
                this.#Image,
                0,
                0,
                this.#Image.width,
                this.#Image.height,
                imageX,
                imageY,
                imageWidth,
                imageHeight
            );

            // 그라데이션 세팅
            const linearGradient = this.ctx.createLinearGradient(
                0,
                this.ScreenHeight - boxHeight,
                0,
                this.ScreenHeight
            );
            linearGradient.addColorStop(1, "#000000dd");
            linearGradient.addColorStop(0, "#00000000");

            this.ctx.fillStyle = linearGradient;
            this.ctx.fillRect(0, this.ScreenHeight, this.ScreenWidth, -boxHeight);
        }
    }

    // New Audio Visualizer
    DrawAudioVisualizer() {
        this.ctx.fillStyle = "#ffffff";

        // Data Array 갱신
        this.#Analyser.getByteFrequencyData(this.#DataArray);

        // 정제 후 새로운 배열에 넣기
        const sampleRate = 48000;
        const arrayMaxFreq = sampleRate / 2;
        const arraySize = fftSize / 2;
        let scale = [100, 300, 800, 3000, 6000, 13000, 24000].map(
            (item) => item / (arrayMaxFreq / arraySize)
        );
        let datas = new Array(scale.length).fill(0);

        this.#DataArray.forEach((item, index) => {
            for (const i in scale) {
                const scaleIndex = scale[i];
                if (index < scaleIndex) {
                    datas[i] += item;
                    break;
                }
            }
        });

        datas = datas.map((item, i) => Math.round(item / scale[i]));

        for (let i = 0; i < datas.length; i++) {
            const value = (Math.max(1, datas[i]) * 6) ** 0.6;
            const y = this.ScreenHeight - 70;
            const x = 75 + Math.floor((i + 1) / 2) * (barWidth + 3) * (-1) ** i;
            this.ctx.fillRect(x, y + value / 2, barWidth, -value);
        }
    }

    // 오디오 정보 및 시간 그리기
    DrawAudioInfo() {
        const DrawText = ((
            text: string,
            size: number,
            maxSize: number,
            x: number,
            y: number,
            bold = false
        ) => {
            let decrease = 0;
            while (size - decrease > 8) {
                this.ctx.font = `${bold ? "500 " : ""}${
                    size - decrease
                }pt Roboto, 'Noto Sans KR'`;

                let textMetrics = this.ctx.measureText(text);
                if (textMetrics.width > maxSize) {
                    decrease++;
                    continue;
                }

                // console.log(textMetrics);

                break;
            }
            this.ctx.fillText(text, x, y + decrease / 2, maxSize);
        }).bind(this);

        // let subtitle;

        // if (this.#WebAudio.Current.State === "loading") {
        //     subtitle = "Loading...";
        // } else if (this.#WebAudio.Duration === 0) {
        //     subtitle = ConvertTime(this.#WebAudio.Seek) + " / ∞";
        // } else {
        //     subtitle = `${ConvertTime(this.#WebAudio.Seek)} / ${ConvertTime(
        //         this.#WebAudio.Duration
        //     )}`;
        // }

        // Shadow 세팅
        this.ctx.fillStyle = "#ffffff";
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = "#000000dd";

        // Audio 이름 텍스트 그리기
        DrawText(
            this.#WebAudio.Current.Name,
            32,
            this.ScreenWidth - 170,
            150,
            this.ScreenHeight - 70, //64 - 10,
            true
        );

        this.ctx.fillStyle = "#cccccc";

        // Audio Seek / Duration 텍스트 그리기
        // DrawText(subtitle, 18, this.ScreenWidth - 270, 30, this.ScreenHeight - 23 - 10);
        DrawText(
            this.#WebAudio.Current.State === "loading" ? "Loading..." : this.Title,
            15,
            this.ScreenWidth - 270,
            150,
            this.ScreenHeight - 40 //30 - 10
        );

        // Audio Description 그리기
        // DrawText(DESCRIPTION, 10, this.ScreenWidth - 30, 30, 58);

        // Shadow 초기화
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "#00000000";
    }

    DrawPlaybackBar() {
        const seek = this.#WebAudio.Seek;
        const duration = this.#WebAudio.Duration;
        const rate = Math.min(
            this.#WebAudio.Current.State === "loading" ? 0 : seek / duration,
            1
        );

        const margin = 30;
        const y = this.ScreenHeight - 18;
        const height = 5;

        // Draw PlaybackBar Background
        this.ctx.fillStyle = "#ffffff2f";
        this.ctx.fillRect(margin, y, this.ScreenWidth - margin * 2, height);

        // Draw PlaybackBar Foreground
        this.ctx.fillStyle = "#ffffff";
        if (this.#WebAudio.Current.State !== "loading" && duration === 0) {
            const backWidth = this.ScreenWidth - 60;
            const barWidth = backWidth * 0.25;
            const stageLength = backWidth + barWidth;
            const cycleLength = 8;
            const cycleSeek = seek % cycleLength;
            const barElapsedLength = (cycleLength / stageLength) * barWidth;

            let x = margin;
            let width = barWidth;

            x = (cycleSeek / cycleLength) * stageLength - barWidth + margin;

            if (cycleSeek < barElapsedLength) {
                width = (cycleSeek / barElapsedLength) * barWidth;
                x = margin;
            } else if (cycleLength - cycleSeek < barElapsedLength) {
                width = ((cycleLength - cycleSeek) / barElapsedLength) * barWidth;
            }
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.fillRect(margin, y, (this.ScreenWidth - margin * 2) * rate, height);
        }
    }

    Render() {
        this.ClearCanvas();

        this.DrawImage();
        this.DrawAudioVisualizer();
        this.DrawAudioInfo();
        this.DrawPlaybackBar();

        this.StartRender();
    }

    StartRender() {
        requestAnimationFrame(this.Render.bind(this));
    }
}
