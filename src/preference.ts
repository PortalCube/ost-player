import { Player } from "./player";
import { get, set } from "idb-keyval";

export type PreferenceData = {
    preference_version: number;
    repeat_time: number;
    background_mode: BackgroundPreferenceData;
    audio_pack: string;
    playlist: string[];
};

export type BackgroundPreferenceData = "normal" | "shuffle";

const PREFERENCE_DEFAULT_DATA: PreferenceData = {
    preference_version: 1,
    repeat_time: 300,
    background_mode: "normal",
    audio_pack: "TSPUD",
    playlist: ["all"]
};

export class Preference {
    #Player: Player = null;
    Data: PreferenceData = PREFERENCE_DEFAULT_DATA;

    get Version() {
        return this.Data.preference_version;
    }

    get RepeatTime() {
        return this.Data.repeat_time;
    }

    set RepeatTime(value: number) {
        this.Data.repeat_time = value;
    }

    get BackgroundMode() {
        return this.Data.background_mode;
    }

    set BackgroundMode(value: BackgroundPreferenceData) {
        this.Data.background_mode = value;
    }

    get AudioPack() {
        return this.Data.audio_pack;
    }

    set AudioPack(value: string) {
        this.Data.audio_pack = value;
    }

    get Playlist() {
        return this.Data.playlist;
    }

    set Playlist(value: string[]) {
        this.Data.playlist = value;
    }

    constructor(player: Player) {
        this.#Player = player;
    }

    async Load() {
        for (const key of Object.keys(this.Data) as Array<keyof PreferenceData>) {
            if (key === "preference_version") {
                const version = await get(key);
                if (this.Data.preference_version !== version) {
                    await this.Save();
                }
            } else {
                this.Data[key] = (await get(key)) ?? this.Data[key];
            }
           
        }
        console.log(this.Data);
    }

    async Save() {
        for (const key of Object.keys(this.Data) as Array<keyof PreferenceData>) {
            await set(key, this.Data[key]);
        }
        console.log("[Preference] Data saved!");
    }

    async Clear() {
        this.Data = PREFERENCE_DEFAULT_DATA;
        await this.Save();
    }
}
