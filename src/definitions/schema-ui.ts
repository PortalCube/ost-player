import Data from "../ui/ui.json";

export type Button = {
    name: string;
    description: string;
};

export type Header = {
    title: string;
    subtitle: string;
}


export const UiJSON = Data as {
    setting: {
        header: Header;
        button: {
            close: Button;
            back: Button;
        }
    }
}
