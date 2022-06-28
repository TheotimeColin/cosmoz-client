<template>
    <div class="Layout LayoutDefault" :class="[ classes, { 'is-transparent': $store.state.page.header.transparent } ]">
        <default-header />

        <div
            class="LayoutDefault_content"
        >
            <Nuxt />
        </div>
        
        <popin-register />
        <tooltip-manager />
        
        <default-footer class="Footer" v-if="!isDisableFooter" />
    </div>
</template>

<script>
import Debounce from 'lodash.debounce'

export default {
    name: 'LayoutDefault',
    computed: {
        
        classes () { return this.$store.state.page.body.classes },
        isDisableFooter () { return this.$store.state.page.isDisableFooter },
    },
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e)
        }

        if (process.server) return

        this.windowResize()

        this.onWindowResize = Debounce(this.windowResize, 500)
        window.addEventListener('resize', this.onWindowResize)

        this.$store.commit('page/setScrolled', window.scrollY > 5)
        window.addEventListener('scroll', () => {
            let action = window.scrollY > 5
            
            if (this.$store.state.page.isScrolled != action) this.$store.commit('page/setScrolled', action)
        })

        window.addEventListener('beforeinstallprompt', e => e.preventDefault())
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
       window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {
        windowResize () {
            this.$store.commit('page/setBreakpoint', window.innerWidth)
        }
    }
}
</script>

<style lang="scss" scoped>
.LayoutDefault {

    &.is-transparent {
        
        .LayoutDefault_content {
            margin-top: 0;
            min-height: 100vh;
        }
    }
}

.LayoutDefault_content {
    margin-top: var(--default-header-height);
    min-height: calc(100vh - var(--default-header-height));
    contain: paint;
}

.page-enter-active,
.page-leave-active {
  transition: all 100ms;
  overflow: hidden;
}

.page-enter {
  opacity: 0;
  transform: translateY(3px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.layout-enter-active, .layout-leave-active {
  transition: all 100ms;
}

.layout-enter, .layout-leave-active {
  opacity: 0;
  transform: translateY(3px);
}
</style>