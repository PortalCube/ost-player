import { BackgroundList } from "./background-list";
import { Player } from "./player";
import { $ } from "./util";

type BackgroundMode = "song" | "random" | "fixed";

export class Background {
    #Player: Player;

    get List() {
        return this.#Player.QueueManager.BackgroundList;
    }

    Mode: BackgroundMode = "song";

    constructor(player: Player) {
        this.#Player = player;
        this.Update();
    }

    get Current() {
        return this.List.Current;
    }

    get Index() {
        return this.List.Index;
    }

    set Index(value: number) {
        this.List.Index = value;
        this.Update();
    }

    Next() {
        this.List.Next();
        this.Update();
    }

    Prev() {
        this.List.Prev();
        this.Update();
    }

    Update() {
        const element = $(".background") as HTMLDivElement;
        element.style.backgroundImage = `url(${this.Current.URL})`;
    }
}
