const scaleSus = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const scaleBem = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export default function (cifraHTML = '', to = 1) {

    const regex = /<\s*span data-chord.*?>(.*?)<\s*\/\s*span>/gm
    let strHtml = cifraHTML
    let newTags = []
    while ((match = regex.exec(strHtml)) != null) {

        let tag     = match[0]
        let chord   = match[1]

        let chordTones = chord.match(/[A-G](#|b)|[A-G]/gm)
        if (!chordTones) 
            continue

        let newChord = chord
        
        for (let chordTone of chordTones) {

            let scale = scaleSus
            if (chordTone.match(/.*?b/g))
                scale = scaleBem

            let index = scale.indexOf(chordTone)

            index += (1*to)

            if (index < 0)
                index = scale.length-1

            if (index >= scale.length)
                index = 0

            let newChordTone = scale[index]
            let regexReplace = new RegExp(`${chordTone}`, 'g');
            newChord = newChord.replace(regexReplace, newChordTone)
        }

        let newTag = tag.replace(/>(.*?)<\//gm, `>${newChord}</`)
        newTags.push({tag, newTag})
    }

    // replace chord tags
    let replacedTags = []
    for (tag of newTags) {

        if (!replacedTags.includes(tag.tag)) {
            strHtml = strHtml.replaceAll(tag.tag, tag.newTag)
            replacedTags.push(tag.tag)
        }
    }

    return strHtml
}