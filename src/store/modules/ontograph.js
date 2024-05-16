import * as types from '../mutation-types'

// state
export const state = {
    OLoaded: null,
    OClasses: null,
    OCatalogs: null,
    ORelations: null,
    OProperties: null,
    OSubClassesKeys: null,
    OParentClassesKeys: null,
    OIgnoredClassesUris: [
        "<https://ontologias.pruebas.org/v1.0/ThingsAngelus>",
        "<https://ontologias.pruebas.org/v1.0/ThingsReality>"
    ],
}

// getters
export const getters = {
    OClasses: state => state.OClasses,
    OParentClasses: state => state.OParentClasses,
    OSubClasses: state => state.OSubClasses,
    OCatalogs: state => state.OCatalogs,
    ORelations: state => state.ORelations,
    OProperties: state => state.OProperties
}

// mutations
export const mutations = {
    [types.UPDATE_ONTOLOGY](state, data) {
        state.OClasses = data.classes
        state.OCatalogs = data.catalogs
        state.OProperties = data.properties
        state.ORelations = data.relations

        //Deleting ignored classes from the array
        for( let key of state.OIgnoredClassesUris)
        this._vm.$delete(state.OClasses, key)

        //Getting once and for all parent and subclasses
        if (Object.keys(data.classes).length){
            let subClassesKeys = []
            state.OSubClassesKeys = []
            state.OParentClassesKeys = []

            // Getting all subclasses in all classes
            for (let [key, entry] of Object.entries(data.classes))
                state.OSubClassesKeys.push(...entry.subclasses)

            state.OParentClassesKeys = Object.keys(state.OClasses).filter(d => !state.OSubClassesKeys.includes(d))

        }

        state.OLoaded = new Date()

    },
}

// actions
export const actions = {
    async fetchOntology(context, component ) {
        await component.$AngelusApi
            .get('/static_schemas')
            .then(r => {
                context.commit(types.UPDATE_ONTOLOGY, r)
            })
            .catch(e => {
                component.$toast(e.status)
            })
        return true        
    },

    getShortUrl(context, uri = "") {
        if(!!uri && uri.length)
            return uri.substring(uri.lastIndexOf('/') + 1, uri.length - 1)
        else
            return ""
    },

    getPropertyPredicateLabel(context, predicate, list = 'OClasses') {
        let lang_buffer = undefined
        let label_buffer = undefined

        switch(list){
            case 'OProperties':
                list = context.state.OProperties
                break;
            case 'ORelations':
                list = context.state.ORelations
                break;
            case 'OCatalogs':
                list = context.state.OCatalogs
                break;
            case 'OClasses':
            default:
                list = context.state.OClasses
                break;

        }

        if (Object.keys(list).includes(predicate))
            for (let label of list[predicate].label) {
                lang_buffer = label.substring(label.length - 2, label.length)
                label_buffer = label.substring(1, label.lastIndexOf('@') - 1)

                if (lang_buffer === process.env.MIX_ANGELUS_DEFAULT_LANG)
                    break;
            }

        return label_buffer || predicate
    },

    processUriAsID(context, iri_string) {
        return iri_string.replace(/\.|\:|\;|\//gi, "_").replace(/^[^a-z]+|[^\w:.-]+/gi, "");
    },

    langLiteralGetLang(context, literal) {
        return literal.substring(literal.lastIndexOf('@') + 1, literal.length)
    },

    langLiteralParse(context, literal) {
        return literal.substring(1, literal.lastIndexOf('@') - 1)
    }

}
