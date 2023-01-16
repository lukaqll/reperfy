
export function formatCipher(html) {

    // get only teg <pre>
    let htmlCipherOnly = html.match(/<\s*pre[^>]*>[\s\S]*<\s*\/\s*pre>/g)

    if (!htmlCipherOnly) {
        Alert.alert('Falha ao obter conteúdo')
        return null
    }

    // remove buttons and replace line breakes
    htmlCipherOnly = htmlCipherOnly[0].replace(/<\s*button[^>]*>(.|\n)*?<\s*\/\s*button>/g, '')
                                      .replace(/(?:\r\n|\r|\n)/g, '<br>')

    htmlCipherOnly = `<main>${htmlCipherOnly}</main>`
    return htmlCipherOnly
}