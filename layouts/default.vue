<template>
    <div class="Layout LayoutDefault" :class="[ classes ]">
        <default-header @navOpen="onNavOpen" />

        <div
            class="LayoutDefault_content"
            v-hammer:panstart="onPanStart"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend="onPanEnd"
        >
            <Nuxt />
        </div>

        <default-nav :pan="pan" :is-panning="isPanning" ref="nav" />

        <popin-register />
        <tooltip-manager />
        
        <default-footer class="Footer" v-if="!isDisableFooter && !user" />
    </div>
</template>

<script>
import Debounce from 'lodash.debounce'

export default {
    name: 'LayoutDefault',
    computed: {
        user () { return this.$store.getters['user/self'] },
        classes () { return this.$store.state.page.body.classes },
        isDisableFooter () { return this.$store.state.page.isDisableFooter }
    },
    data: () => ({
        pan: 0,
        isPanning: false,
        isPanCancelled: false,
    }),
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
        onNavOpen () {
            if (this.$refs.nav) this.$refs.nav.open()
        },
        windowResize () {
            this.$store.commit('page/setBreakpoint', window.innerWidth)
        },
        onPan (v) {
            if (this.isPanCancelled) return

            this.isPanning = true
            this.pan = Math.min(300, v.deltaX)
        },
        onPanStart (v) {
            if (this.$isFixedPosition(v.target) || this.$biggerThan('s')) this.isPanCancelled = true
        },
        onPanEnd () {
            this.isPanCancelled = false
            this.isPanning = false
            this.$nextTick(() => this.pan = 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.LayoutDefault_content {
    min-height: calc(100vh - var(--header-height));
    touch-action: pan-y !important;
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

@include breakpoint-s {

    .Footer {
        display: none;
    }
}
</style>