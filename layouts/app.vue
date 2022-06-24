<template>
    <div class="Layout LayoutApp" :class="[ classes, { 'is-open-nav': isOpenNav, 'is-transition': isTransition } ]">
        <app-header @navOpen="onNavOpen" />
        <app-head />
        <app-notifications v-if="user" />

        <div
            class="LayoutApp_content"
            v-hammer:panstart="onPanStart"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend="onPanEnd"
        >
            <Nuxt />
        </div>

        <app-nav :pan="pan" :is-panning="isPanning" ref="nav" />

        <popin-register />
        <popin-constellation-create />
        <popin-confirm />
        
        <tooltip-manager />
    </div>
</template>

<script>
import Debounce from 'lodash.debounce'

export default {
    name: 'LayoutApp',
    computed: {
        user () { return this.$store.getters['user/self'] },
        classes () { return this.$store.state.page.body.classes },
    },
    data: () => ({
        pan: 0,
        isPanning: false,
        isPanCancelled: false,
        isTransition: false,
        isOpenNav: true,
        prevRoute: ''
    }),
    watch: {
        $route: {
            deep: true,
            handler (v) {
                let name = v.name + JSON.stringify(v.params)

                if (this.prevRoute && this.prevRoute != name) {
                    this.isTransition = true
                    setTimeout(() => this.isTransition = false, 600)
                }

                this.prevRoute = name
            }
        }
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
        onNavOpen () {
            if (this.$refs.nav) this.$refs.nav.open()
        },
        windowResize () {
            this.$store.commit('page/setBreakpoint', window.innerWidth)
        },
        onPan (v) {
            if (this.isPanCancelled || v.deltaX <= 0) {
                this.isPanning = true
                return
            }

            this.isPanning = true
            this.pan = Math.min(300, v.deltaX)
        },
        onPanStart (v) {
            this.isPanCancelled = false
            
            if (this.$isFixedPosition(v.target) || this.$biggerThan('s')) {
                this.isPanCancelled = true
                this.isPanning = false
            }
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
.LayoutApp {

    &.is-transition {
        
        .LayoutApp_content {
            contain: paint;
        }
    }
}

.LayoutApp_content {
    min-height: calc(100vh - var(--header-height));
    touch-action: pan-y !important;
    user-select: auto !important;
    margin-left: var(--nav-width);
    margin-top: calc(var(--header-height, 0px) + var(--app-height, 0px));
    position: relative;
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
    .LayoutApp_content {
        user-select: none !important;
        margin-left: 0;
    }
    
    .Footer {
        display: none;
    }
}
</style>