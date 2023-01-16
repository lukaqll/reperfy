import { useSelector } from "react-redux";

function getLang (lang) {
    
    switch (lang) {
        case 'en-us':
            return require('./../assets/langs/en-us')
        case 'pt-br':
            return require('./../assets/langs/pt-br')
        default:
            return require('./../assets/langs/en-us')
    }

}

function useLang () {

    const theme = useSelector(state => state.theme)
    const lang = getLang(theme.lang)

    const get = (text) => {
        const langJson = lang.default
        return langJson[text] || text
    }
    return get
}

export default useLang