<template>
    <div class="Layout LayoutDefault LayoutApp" :class="[ classes ]">
        <app-nav />

        <div class="LayoutApp_content">
            <!-- <app-header /> -->
            <Nuxt />
            
            <tooltip-manager />
        </div>
    </div>
</template>

<script>
import Debounce from 'lodash.debounce'

export default {
    name: 'LayoutApp',
    computed: {
        classes () { return this.$store.state.page.body.classes }
    },
    data: () => ({
        onWindowResize: null,
    }),
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e);
        }

        if (process.server) return

        this.windowResize()

        this.onWindowResize = Debounce(this.windowResize, 500)
        window.addEventListener('resize', this.onWindowResize)
        
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
.LayoutApp {
    display: flex;
    background-color: var(--color-bg-strong);
}

.LayoutApp_content {
    flex-grow: 1;
    min-height: 100vh;
    margin-left: 300px;
    box-shadow: 0 0 10px 0 rgba(20, 20, 20, 1);
    position: relative;
    z-index: 20;
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
    margin-left: 0;
    z-index: 5;
    padding-top: 70px;
  }
}

@include breakpoint-xs {
  
  .LayoutApp_content {
    padding-bottom: 70px;
    width: 100%;
  }
}
</style>