import { BackgroundItem } from "./background-item";
import { SettingItem } from "./definitions/schema-setting";
import { MusicData, MusicItem } from "./music-item";
import { GetCleanTimeText } from "./util";

export type AudioPackConfig = {
    id: string;
    info: {
        title: string;
        short_title: string;
        description: string;
    };
    screen: {
        width: number;
        height: number;
    };
    image: {
        default: string;
        album: string;
    };
    playlist: SettingItem[];
    musicBaseUrl: string;
    imageBaseUrl: string;
};

export class AudioPack {
    Config: AudioPackConfig = null;
    MusicList: MusicItem[] = null;
    Playlist: Playlist[] = null;
    BackgroundList: BackgroundItem[] = null;

    get ID() {
        return this.Config.id;
    }

    get Title() {
        return this.Config.info.title;
    }

    get ShortTitle() {
        return this.Config.info.short_title;
    }

    get Description() {
        return this.Config.info.description;
    }

    get DetailDescription() {
        const musicCount = this.MusicList.length;
        const musicLength = this.MusicList.reduce((total, item) => {
            return total + item.DataDuration;
        }, 0);
        return `${musicCount}개 아이템, ${GetCleanTimeText(musicLength)}`;
    }

    get DefaultPlaylist() {
        return this.Playlist.filter(item => item.IsDefault)[0];
    }

    get ScreenWidth() {
        return this.Config.screen.width;
    }

    get ScreenHeight() {
        return this.Config.screen.height;
    }

    get DefaultImage() {
        return this.Config.image.default;
    }

    get CoverImage() {
        return this.Config.image.album;
    }

    get MusicBaseURL() {
        return this.Config.musicBaseUrl;
    }

    get ImageBaseURL() {
        return this.Config.imageBaseUrl;
    }

    constructor(
        config: AudioPackConfig,
        musicList: MusicData[],
        backgroundList: string[]
    ) {
        this.Config = config;
        this.MusicList = musicList.map((item) => new MusicItem(item, this));
        this.Playlist = this.Config.playlist.map(item => new Playlist(this, item));
        this.BackgroundList = backgroundList.map(
            (item) => new BackgroundItem(item, this)
        );
    }
}

export class Playlist {
    AudioPack: AudioPack = null;
    Config: SettingItem = null;

    get MusicList() {
        const list = this.AudioPack.MusicList;
        if (this.ID === "all") {
            return list.slice(0);
        } else {
            return list.filter(item => item.Tags.includes(this.ID));
        }
    }

    get ID() {
        return this.Config.id;
    }

    get Title() {
        return this.Config.name;
    }

    get Description() {
        return this.Config.description;
    }

    get DetailDescription() {
        const musicCount = this.MusicList.length;
        const musicLength = this.MusicList.reduce((total, item) => {
            return total + item.DataDuration;
        }, 0);
        return `${musicCount}개 아이템, ${GetCleanTimeText(musicLength)}`;
    }

    get IsDefault() {
        return this.Config.isSelect;
    }

    constructor(
        audioPack: AudioPack,
        config: SettingItem
    ) {
        this.AudioPack = audioPack;
        this.Config = config;
    }
}