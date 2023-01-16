import { THEME_CHANGE, LANG_CHANGE } from "./constants";

// switch mode according to what is specified...
export const switchMode = (mode) => {
    return {
        type: THEME_CHANGE,
        payload: mode,
    };
};

export const switchLang = (lang) => {
    return {
        type: LANG_CHANGE,
        payload: lang,
    };
};