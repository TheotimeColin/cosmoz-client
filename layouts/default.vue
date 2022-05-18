<template>
    <div class="Layout LayoutDefault" :class="[ classes ]">
        <default-header />
        
        <div class="LayoutDefault_content">
            <Nuxt />
        </div>

        <default-footer />
    </div>
</template>

<script>
export default {
    name: 'LayoutDefault',
    computed: {
        classes () { return this.$store.state.page.body.classes }
    },
    data: () => ({
        countdown: ''
    }),
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e);
        }

        // setInterval(() => {
        //     let m = this.$moment.duration(this.$moment('18-05-2022 18:00', 'DD-MM-YYYY HH:mm').diff(this.$moment()))
            
        //     this.countdown = `${this.$options.filters.fixed(m.days())}j ${this.$options.filters.fixed(m.hours())}h ${this.$options.filters.fixed(m.minutes())}m ${this.$options.filters.fixed(m.seconds())}s`
        // }, 500)
        
        if (process.server) return

        window.addEventListener('scroll', () => {
            let action = window.scrollY > 5
            
            if (this.$store.state.page.isScrolled != action) this.$store.commit('page/setScrolled', action)
        })

        window.addEventListener('beforeinstallprompt', e => e.preventDefault())
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>

<style lang="scss" scoped>
.timer {
    width: 180px;
}

.LayoutDefault_content {
    min-height: calc(100vh - 65px);
    padding-top: 65px;
}
</style>