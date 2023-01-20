import { THEME_CHANGE, LANG_CHANGE, ADS_CHANGE } from "./constants";

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

export const switchAdsMode = (ads) => {
    return {
        type : ADS_CHANGE,
        payload: ads
    }
}