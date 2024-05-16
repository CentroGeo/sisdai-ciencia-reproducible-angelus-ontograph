//Here we set very specific functions for the program to use
export function getShortUrl ( uri ) { 
    if(!uri) return ""
    let str = uri
    if (str[0] === '<' && str[str.length - 1] === '>')
        str = str.slice(1, -1)

    if (str.includes('https://') || str.includes('http://')) {

        if (str.includes('https://'))
            str = str.slice(str.indexOf('https://') + 'https://'.length)
        else if (str.includes('http://'))
            str = str.slice(str.indexOf('http://') + 'http://')

        str = str.slice(str.indexOf('/'))
    }

    return str
} 

export function getDocumentShortUrl(uri) {
    let str = uri

    if (str[0] === '<' && str[str.length - 1] === '>')
        str = str.slice(1, -1)

    let array = str.split('/')

    return '/' + array[array.length - 2] + '/' + array[array.length - 1]
} 

export function getPropertyPredicateLabel(predicate, list){

    // If predicate is not in the list given
    if(!Object.keys(list).includes(predicate))
        return predicate

    let item_buffer = list[predicate]

    // Return defualt label if exists
    if(Object.keys(item_buffer).includes('default_label'))
        return item_buffer['default_label']

    // Just grabbing the first one
    if(item_buffer.label.length > 0)
        return langLiteralParse(item_buffer.label[0])
    else 
        return predicate
}

export function processUriAsID(iri_string) {
    return iri_string.replace(/\.|\:|\;|\//gi, "_").replace(/^[^a-z]+|[^\w:.-]+/gi, "");
}

export function langLiteralGetLang(literal){
    return literal.substring( literal.lastIndexOf('@') + 1, literal.length )
}

const regex__literal_w_lang = new RegExp('\".+\"@[a-zA-Z]{2}');

export function langLiteralParse(literal){
    if( regex__literal_w_lang.test(literal) )
        return literal.substring(1, literal.lastIndexOf('"'))
    return literal
}

export function uriToLink(uri) {
    return uri.substring(1, uri.lastIndexOf('>'))
}