const components = []
const uiFiles = require.context('@/components', true, /\/ui-[^/]+\/index.vue$/)

uiFiles.keys().forEach(key => {
    components.push(uiFiles(key).default || uiFiles(key))
})

export default {
    install: (Vue, Option) => {
        components.forEach(component => {
            Vue.component(component.name, component)
        })
    }
}
