import { LANG_CHANGE, THEME_CHANGE, ADS_CHANGE } from './constants';

// Initially we will have a dark mode
const initialState = {
    mode: 'dark',
    lang: 'en-us',
    ads: '1'
};

// Handle our action of changing the theme
const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case THEME_CHANGE:
            return {
                ...state,
                mode: action.payload
            }
        
        case LANG_CHANGE:
            return {
                ...state,
                lang: action.payload
            }

        case ADS_CHANGE:
            return {
                ...state,
                ads: action.payload
            }
        default:
            return state;
    }
}

export default themeReducer;
