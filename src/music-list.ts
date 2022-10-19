import { MusicItem } from "./music-item";
import { BackgroundItem } from "./background-item";
import List from "./list";

export class MusicList extends List<MusicItem> {
    get Backgrounds() {
        return this.Array.map(
            (item) => new BackgroundItem(item.BackgroundImage, item.Config)
        );
    }

    constructor(datas: MusicItem[] = []) {
        super(datas, true);
        this.#Preload();
    }

    #Preload() {
        this.Array.forEach(
            ((item: MusicItem, index: number) => {
                if ([this.PrevIndex, this.Index, this.NextIndex].includes(index)) {
                    item.Load();
                } else {
                    item.Unload();
                }
            }).bind(this)
        );
    }

    Next() {
        const item = super.Next();
        this.#Preload();
        return item;
    }

    Prev() {
        const item = super.Prev();
        this.#Preload();
        return item;
    }

    Destroy() {
        this.Array.forEach((item) => item.Unload());
        this.Array = [];
    }
}
