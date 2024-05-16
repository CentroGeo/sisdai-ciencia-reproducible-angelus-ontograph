import Vue from 'vue'


Vue.directive('onto-label', {
    // When the bound element is inserted into the DOM...
    bind: function (el, binding, vnode) {

        let lang_buffer = undefined
        let label_buffer = undefined

        for(let label of binding.value){
            lang_buffer = label.substring(label.length - 2, label.length)
            label_buffer = label.substring(1, label.lastIndexOf('@') -1)

            if (lang_buffer === process.env.MIX_ANGELUS_DEFAULT_LANG)
                break;
        }

        el.innerHTML = label_buffer
    }
})