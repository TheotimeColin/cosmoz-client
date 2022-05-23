<template>
    <div class="Layout LayoutDefault" :class="[ classes ]">
        <div class="LayoutDefault_content">
            <Nuxt />
        </div>
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager },
    computed: {
        classes () { return this.$store.state.page.body.classes }
    },
    data: () => ({

    }),
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e);
        }

        if (process.server) return
        
        window.addEventListener('beforeinstallprompt', e => e.preventDefault())
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>

<style lang="scss" scoped>
</style>