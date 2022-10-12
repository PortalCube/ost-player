export const $: typeof document.querySelector = document.querySelector.bind(document);
export const $$: typeof document.querySelectorAll =
    document.querySelectorAll.bind(document);

export const MakeSelect = (prefix = "") => {
    return (selector: string): ReturnType<typeof $> => $(prefix + selector);
};
export const MakeSelectAll = (prefix = "") => {
    return (selector: string): ReturnType<typeof $$> => $$(prefix + selector);
};

export function ShuffleArray<T>(arr: T[]): T[] {
    for (let index = arr.length - 1; index > 0; index--) {
        const randomPosition = Math.floor(Math.random() * (index + 1));
        const temp = arr[index];
        arr[index] = arr[randomPosition];
        arr[randomPosition] = temp;
    }
    return arr;
}

export function Lerp(a: number, b: number, t: number) {
    return (b - a) * t + a;
}

export function ConvertTime(second: number) {
    const toString = (value: number) => Math.floor(value).toString().padStart(2, "0");
    if (typeof second !== "number" || second === NaN) {
        return "00:00";
    } else {
        return `${toString(second / 60)}:${toString(second % 60)}`;
    }
}

export function GetCleanTimeText(second: number) {
    let minute = Math.floor(second / 60);

    if (minute > 75) {
        let hour = Math.floor(minute / 60);
        minute -= hour * 60;
        return `${hour}시간 ${minute}분`;
    } else if (minute > 3) {
        second -= minute * 60;
        return `${minute}분 ${Math.round(second)}초`;
    } else {
        return `${Math.floor(second)}초`;
    }
}

// export function GainToDecibels(value: number) {
//     if (value == null) return 0;
//     return 10 * (0.43429 * Math.log(value));
// }

// export function DecibelsToGain(value: number) {
//     return Math.exp(value / 4.3429);
// }
