import { $, $$, MakeSelect, MakeSelectAll } from "./util";
import { AudioPackManifest } from "./audio-pack-manifest";
import { Player } from "./player";
import { BackgroundPreferenceData } from "./preference";

type AudioPackItem = {
    id: string;
    title: string;
    description: string;
    icon: string;
    select: string;
};

const repeatRange = [0, 180, 300, 600, 1800, 3600, -1];

export class PreferenceUI {
    #Player: Player;

    constructor(player: Player) {
        this.#Player = player;

        this.Init();
    }

    // ############################
    // Init 섹션
    // ############################

    Init() {
        this.InitMenuSection();
        this.InitAudioPackSection();
        this.InitPlaylistSection();
        this.InitRepeatSection();
        this.InitBackgroundSection();
        this.InitFooterSection();

        const settingButton = $(".setting-button") as HTMLButtonElement;
        settingButton.addEventListener("click", this.ShowWindow.bind(this));
    }

    InitMenuSection() {
        const select = MakeSelect(
            ".wrapper.setting > .menu.container > .content > #menu-"
        );

        select("audio-pack")!.addEventListener(
            "click",
            this.MoveSection.bind(this, "audio-pack")
        );
        select("playlist")!.addEventListener(
            "click",
            this.MoveSection.bind(this, "playlist")
        );
        select("repeat")!.addEventListener(
            "click",
            this.MoveSection.bind(this, "repeat")
        );
        select("background")!.addEventListener(
            "click",
            this.MoveSection.bind(this, "background")
        );
    }

    InitAudioPackSection() {
        const select = MakeSelect(".wrapper.setting > .audio-pack.container > ");

        const list = Object.entries(AudioPackManifest).map(([id, item]) => ({
            id,
            title: item.Title,
            description: item.DetailDescription,
            icon: id,
            select: "" // this.#Player.Preference.AudioPack === id ? "check" : "" // "texture", "check", ""
        }));

        const contentElement = select(".content") as HTMLDivElement;

        list.forEach((item) => {
            contentElement.appendChild(this.BuildPlaylistItemElement(item));
        });

        this.UpdateAudioPackSection();
        this.RegisterAudioPackEvent();
    }

    InitPlaylistSection() {
        const select = MakeSelect(".wrapper.setting > .playlist.container > ");

        const list = Object.entries(AudioPackManifest)
            .map(([id, item]) =>
                item.Playlist.map((playlist) => ({
                    audioPackId: id,
                    id: `${id}_${playlist.ID}`,
                    title: `${playlist.AudioPack.ShortTitle}: ${playlist.Title}`,
                    description: `${playlist.Description}\n${playlist.DetailDescription}`,
                    icon: playlist.ID,
                    select: ""
                }))
            )
            .flat();

        const contentElement = select(".content") as HTMLDivElement;

        list.forEach((item) => {
            contentElement.appendChild(this.BuildPlaylistItemElement(item));
        });

        this.UpdatePlaylistSection();
        this.RegisterPlaylistEvent();
    }

    InitRepeatSection() {
        const select = MakeSelect(".wrapper.setting > .repeat.container > ");

        const rangeElement = select(".range") as HTMLInputElement;
        const repeatTime = this.#Player.Preference.RepeatTime;

        if (repeatRange.includes(repeatTime)) {
            rangeElement.value = repeatRange
                .findIndex((item) => item === repeatTime)
                .toString();
        }

        this.UpdateRepeatSection();
        this.RegisterRepeatEvent();
    }

    InitBackgroundSection() {
        this.UpdateBackgroundSection();
        this.RegisterBackgroundEvent();
    }

    InitFooterSection() {
        const selectAll = MakeSelectAll(".wrapper.setting #");

        selectAll("back").forEach((item) =>
            item.addEventListener("click", this.MoveSection.bind(this, "menu"))
        );
        selectAll("close").forEach((item) =>
            item.addEventListener("click", this.HideWindow.bind(this, "menu"))
        );
    }

    // ############################
    // Update 섹션
    // ############################

    UpdateAudioPackSection() {
        const selectAll = MakeSelectAll(".wrapper.setting > .audio-pack.container > ");

        // this.#Player.Preference.AudioPack === id ? "check" : "" // "texture", "check", ""

        const contentElement = selectAll(".content > .item");
        const selectedAudioPack = this.#Player.Preference.AudioPack;

        contentElement.forEach((item) => {
            if (item.id === selectedAudioPack) {
                item.classList.add("select");
                item.querySelector(".material-icons")!.textContent = "check";
            } else {
                item.classList.remove("select");
                item.querySelector(".material-icons")!.textContent = "";
            }
        });
        console.log("[Preference-UI] AudioPack section updated");
    }

    UpdatePlaylistSection() {
        const selectAll = MakeSelectAll(".wrapper.setting > .playlist.container > ");

        // this.#Player.Preference.AudioPack === id ? "check" : "" // "texture", "check", ""

        const contentElement = selectAll(".content > .item");
        const selectedAudioPack = this.#Player.Preference.AudioPack;
        const selectedPlaylist = this.#Player.Preference.Playlist[0];

        contentElement.forEach((item) => {
            if (item.id.includes(selectedAudioPack)) {
                item.classList.remove("hide");

                if (item.id.includes(selectedPlaylist)) {
                    item.classList.add("select");
                } else {
                    item.classList.remove("select");
                }
            } else {
                item.classList.remove("select");
                item.classList.add("hide");
            }
        });
        console.log("[Preference-UI] Playlist section updated");
    }

    UpdateRepeatSection() {
        const select = MakeSelect(".wrapper.setting > .repeat.container > ");

        const valueElement = select(".description > .value") as HTMLSpanElement;
        const textElement = select(".description > .text") as HTMLSpanElement;
        const rangeElement = select(".range") as HTMLInputElement;

        const repeatTime = this.#Player.Preference.RepeatTime;

        textElement.textContent = "";

        if (repeatTime === 0) {
            valueElement.textContent = "무반복";
            // valueElement.textContent = "";
            // textElement.textContent = "노래를 반복하지 않습니다";
        } else if (repeatTime === -1) {
            valueElement.textContent = "∞";
            // textElement.textContent = " 동안 반복합니다";
        } else {
            valueElement.textContent = Math.round(repeatTime / 60).toString() + "분";
            // textElement.textContent = " 분 동안 반복합니다";
        }

        if (repeatRange.includes(repeatTime)) {
            rangeElement.value = repeatRange
                .findIndex((item) => item === repeatTime)
                .toString();
        }
        console.log("[Preference-UI] Repeat section updated");
    }

    UpdateBackgroundSection() {
        const selectAll = MakeSelectAll(".wrapper.setting > .background.container > ");
        const backgroundMode = this.#Player.Preference.BackgroundMode;

        selectAll(".button").forEach((item) => {
            if (item.id === backgroundMode) {
                item.classList.add("select");
            } else {
                item.classList.remove("select");
            }
        });
        console.log("[Preference-UI] Background section updated");
    }

    // ############################
    // Event 섹션
    // ############################

    RegisterAudioPackEvent() {
        const selectAll = MakeSelectAll(
            ".wrapper.setting > .audio-pack.container > .content > "
        );
        selectAll(".item").forEach((item) => {
            item.addEventListener("click", (event) => {
                const element = event.currentTarget as HTMLElement;
                console.log(element);
                this.#Player.Preference.AudioPack = element.id;
                this.#Player.Preference.Playlist = [
                    AudioPackManifest[element.id].DefaultPlaylist.ID
                ];
                this.#Player.Preference.Save();

                this.#Player.QueueManager.SetAudioPack(
                    this.#Player.Preference.AudioPack,
                    this.#Player.Preference.Playlist
                );

                console.log(
                    `[Preference-UI] AudioPack "${this.#Player.Preference.AudioPack}(${
                        this.#Player.Preference.Playlist
                    })" has been selected`
                );

                this.UpdateAudioPackSection();
                this.UpdatePlaylistSection();
            });
        });
    }

    RegisterPlaylistEvent() {
        const selectAll = MakeSelectAll(
            ".wrapper.setting > .playlist.container > .content > "
        );
        selectAll(".item").forEach((item) => {
            item.addEventListener("click", (event) => {
                const element = event.currentTarget as HTMLElement;

                const [audioPackId, playlistId] = element.id.split("_");

                this.#Player.Preference.AudioPack = audioPackId;
                this.#Player.Preference.Playlist = [playlistId];
                this.#Player.Preference.Save();

                this.#Player.QueueManager.SetAudioPack(
                    this.#Player.Preference.AudioPack,
                    this.#Player.Preference.Playlist
                );

                console.log(
                    `[Preference-UI] AudioPack "${this.#Player.Preference.AudioPack}(${
                        this.#Player.Preference.Playlist
                    })" has been selected`
                );

                this.UpdatePlaylistSection();
            });
        });
    }

    RegisterRepeatEvent() {
        const select = MakeSelect(".wrapper.setting > .repeat.container > ");
        const rangeElement = select(".range") as HTMLInputElement;

        rangeElement.addEventListener("input", (event) => {
            const element = event.currentTarget as HTMLInputElement;
            this.#Player.Preference.RepeatTime = repeatRange[element.valueAsNumber];
            this.#Player.Preference.Save();

            console.log(
                '[Preference-UI] Repeat "' +
                    this.#Player.Preference.RepeatTime +
                    '" has been selected'
            );

            this.#Player.WebAudio?.Stop();
            this.#Player.WebAudio?.Current.Load();

            this.UpdateRepeatSection();
        });
    }

    RegisterBackgroundEvent() {
        const selectAll = MakeSelectAll(".wrapper.setting > .background.container > ");
        selectAll(".button").forEach((item) => {
            item.addEventListener("click", (event) => {
                const element = event.currentTarget as HTMLElement;
                this.#Player.Preference.BackgroundMode =
                    element.id as BackgroundPreferenceData;
                this.#Player.Preference.Save();

                this.#Player.QueueManager.ApplyBackgroundList();

                console.log(
                    '[Preference-UI] Background "' + element.id + '" has been selected'
                );

                this.UpdateBackgroundSection();
            });
        });
    }

    // ############################
    // Transition 섹션
    // ############################

    ShowWindow() {
        this.MoveSection("menu");
        $(".wrapper.setting")!.classList.add("visible");
    }

    HideWindow() {
        $(".wrapper.setting")!.classList.remove("visible");
    }

    MoveSection(id: string) {
        $$(".wrapper.setting > .container.visible").forEach((item) =>
            item.classList.remove("visible")
        );
        $(".wrapper.setting > .container." + id)!.classList.add("visible");
    }

    // ############################
    // Build 섹션
    // ############################

    BuildPlaylistItemElement(item: AudioPackItem) {
        // "PlaylistItem" Structure:
        // <PlaylistItem>
        //     <Icon/>
        //     <Info>
        //         <Title/>
        //         <Description/>
        //     </Info>
        //     <Select>
        //         <SelectIcon/>
        //     </Select>
        // </PlaylistItem>

        const itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.id = item.id;

        const imageElement = document.createElement("img");
        imageElement.src =
            "https://dummyimage.com/128/fff/333.png&text=+" + item.icon + "+";
        imageElement.alt = item.icon;

        const infoElement = document.createElement("div");
        infoElement.classList.add("info");

        const infoTitleElement = document.createElement("p");
        infoTitleElement.classList.add("title");
        infoTitleElement.textContent = item.title;

        const infoDescriptionElement = document.createElement("p");
        infoDescriptionElement.classList.add("description");
        infoDescriptionElement.textContent = item.description;

        infoElement.appendChild(infoTitleElement);
        infoElement.appendChild(infoDescriptionElement);

        const selectElement = document.createElement("div");
        selectElement.classList.add("select");

        const selectIconElement = document.createElement("span");
        selectIconElement.classList.add("material-icons");
        selectIconElement.textContent = item.select;

        selectElement.appendChild(selectIconElement);

        itemElement.appendChild(imageElement);
        itemElement.appendChild(infoElement);
        itemElement.appendChild(selectElement);

        return itemElement;
    }
}
