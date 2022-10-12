import { BackgroundItem } from "./background-item";
import List from "./list";

export class BackgroundList extends List<BackgroundItem> {

    get Index() {
        return super.Index;
    }

    set Index(value: number) {
        super.Index = value;
        this.#Preload();
    }

    constructor(datas: BackgroundItem[] = [], isShuffle: boolean = false) {
        super(datas, isShuffle);
        this.#Preload();
    }

    #Preload() {
        this.Array.forEach(
            ((item: BackgroundItem, index: number) => {
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
        delete this.Array;
        this.Array = [];
    }
}
