const mode = 'dark'

const defColors = {

    primary: '#851DE0',
    secondary: '#F21170',
    warning: '#FA9905',
    success: '#00AF91',
    danger: '#FF0000',

    // dark
    primaryDark: '#6500BE',
    fontColor: '#333',

    mode
}

/**
 * light mode colors
 */
const light = {
    ...defColors,

    bgLight: '#dfeffa',
    bgDark: '#a5d8fc',
    fontColor: '#2f2f2f',

    // input
    bgInput: '#FFF',
    labelColor: '#444'
}


/**
 * dark mode colors
 */
const dark = {
    ...defColors,

    bgLight: '#1e1e1e',
    bgDark: '#333',
    fontColor: '#DDD',

    // input
    bgInput: '#FFF',
    labelColor: '#fff'
}

function getPallet () {
    if (mode == 'dark') {
        return  dark
    }

    return light
}

export default getPallet()