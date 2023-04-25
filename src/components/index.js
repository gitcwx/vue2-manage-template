const components = []
const uiFiles = require.context('@/components', true, /\/ui-[^/]+\/index.vue$/)

uiFiles.keys().forEach((key, index) => {
    components.push(uiFiles(key).default || uiFiles(key))
})

export default {
    install: (app) => {
        components.forEach((component) => {
            app.component(component.name, component)
        })
    }
}
