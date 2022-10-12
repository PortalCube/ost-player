// import SettingJSON from "../ui/setting.json";

// const playlist = ConfigJSON.playlist;

export type SettingItem = {
    id: string;
    name: string;
    description: string;
    value?: any;
    isSelect?: boolean;
    isDisable?: boolean;
};

export type SettingGroup = {
    id: "loop" | "playlist" | "background";
    name: string;
    description: string;
    list: SettingItem[];
};

// export const DefaultSetting = SettingJSON as SettingGroup[];
// DefaultSetting[1].list = playlist || DefaultSetting[1].list;