<template>
    <div
        class="LayoutAdmin"
        :class="[ ...pageClasses, { 'is-scroll-layout': scroll > 20, 'is-scroll-disabled': disableScroll } ]"
    >
        <admin-header class="LayoutAdmin_header" />

        <admin-nav
            class="LayoutAdmin_nav"
        />

        <div class="LayoutAdmin_body">
            <div class="LayoutAdmin_background">
                <div class="LayoutAdmin_title">
                    {{ title }}
                </div>
            </div>
            
            <div class="LayoutAdmin_content">
                <Nuxt />
            </div>
        </div>

        <tooltip-manager />
        <flashbag />
        <popin-confirm />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutAdmin',
    components: { TooltipManager },
    middleware: 'admin',
    data: () => ({
        scroll: 0
    }),
    computed: {
        user () { return this.$store.state.user.info },
        title () { return this.$store.state.page.meta.title },
        disableScroll () { return !this.$store.state.utils.window.scroll },
        pageClasses () { return this.$store.state.page.body.classes }
    },
    watch: {
        disableScroll: {
            immediate: true,
            handler (v) {
                if (process.client) document.body.classList.toggle('is-scroll-disabled', v)
            }
        }
    },
    mounted () {
        this.$data.scroll = window.scrollY
        window.addEventListener('scroll', () => this.$data.scroll = window.scrollY)
    }
}
</script>