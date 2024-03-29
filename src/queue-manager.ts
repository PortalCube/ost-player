import { Player } from "./player";
import { BackgroundList } from "./background-list";

import { MusicItem } from "./music-item";
import { MusicList } from "./music-list";
import { AudioPackManifest } from "./audio-pack-manifest";
import { BackgroundItem } from "./background-item";
import { AudioPack } from "./audio-pack";

export class QueueManager {
    #Player: Player;
    MusicList: MusicList;
    BackgroundList: BackgroundList;

    AudioPack: AudioPack;

    constructor(player: Player) {
        this.#Player = player;
        this.SetAudioPack(
            this.#Player.Preference.AudioPack,
            this.#Player.Preference.Playlist
        );
    }

    SetAudioPack(audioPackId: string, playlist: string[] = ["all"]) {
        if (AudioPackManifest[audioPackId] === undefined) {
            throw new Error(`오디오 팩 "${audioPackId}" 이(가) 존재하지 않습니다.`);
        }
        this.AudioPack = AudioPackManifest[audioPackId];
        this.SetMusicList(this.AudioPack.MusicList, playlist);

        this.ApplyBackgroundList();
    }

    SetMusicList(musicList: MusicItem[], tags: string[]) {
        const filteredList = musicList.filter((item) => {
            for (const tag of tags) {
                if (item.Tags.includes(tag)) {
                    return true;
                }
            }
            return false;
        });
        this.#Player.WebAudio?.Stop();
        this.MusicList = new MusicList(
            filteredList.length === 0 ? musicList : filteredList
        );
    }

    SetBackgroundList(backgroundList: BackgroundItem[], shuffle: boolean) {
        this.BackgroundList = new BackgroundList(backgroundList, shuffle);
        this.#Player.Background?.Update();
    }

    ApplyBackgroundList() {
        if (this.#Player.Preference.BackgroundMode === "shuffle") {
            this.SetBackgroundList(this.AudioPack.BackgroundList, true);
        } else {
            // 지정된 이미지가 없는 노래는 배경 목록에서 랜덤하게 뽑아오기
            const list = this.MusicList.Backgrounds.map((item) => {
                if (item.Path === "") {
                    let index = Math.floor(
                        Math.random() * this.AudioPack.BackgroundList.length
                    );
                    return new BackgroundItem(
                        this.AudioPack.BackgroundList[index].Path,
                        item.Config
                    );
                }
                return item;
            });

            this.SetBackgroundList(list, false);
            this.BackgroundList.Index = this.MusicList.Index;
            this.#Player.Background?.Update();
        }
    }
}
