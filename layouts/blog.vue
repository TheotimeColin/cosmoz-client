<template>
    <div class="Layout LayoutBlog" :class="[ classes ]">

        <blog-header :banner="banner" />

        <div class="LayoutBlog_content">
            <Nuxt />
        </div>

        <default-footer />
    </div>
</template>

<script>
export default {
    name: 'LayoutBlog',
    computed: {
        banner () { return this.$store.state.page.banner },
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
.LayoutBlog {
    color: var(--color-ft);
    background: var(--color-bg-light);
}

.LayoutBlog_content {

}
</style>