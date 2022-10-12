import { ShuffleArray } from "./util";

export default class List<T> {
    #Index: number = 0;
    Array: T[] = [];

    constructor(arr: T[] = [], isShuffle: boolean = false) {
        this.Array = isShuffle ? ShuffleArray(arr) : arr;
    }

    get Index() {
        return this.#Index;
    }

    set Index(value) {
        this.#Index = value;
    }

    get Current(): T {
        return this.Array[this.#Index];
    }

    get NextIndex() {
        let index = this.#Index;
        return ++index >= this.Array.length ? 0 : index;
    }

    get PrevIndex() {
        let index = this.#Index;
        return --index < 0 ? this.Array.length - 1 : index;
    }

    get NextItem() {
        return this.Array[this.NextIndex];
    }

    get PrevItem() {
        return this.Array[this.PrevIndex];
    }

    Next() {
        this.#Index = this.NextIndex;
        return this.Current;
    }

    Prev() {
        this.#Index = this.PrevIndex;
        return this.Current;
    }
}
