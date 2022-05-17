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
export default {
    name: 'LayoutApp',
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
.LayoutApp {
    display: flex;
    background-color: var(--color-bg-strong);
}

.LayoutApp_content {
    flex-grow: 1;
    margin-left: 300px;
}

.page-enter-active,
.page-leave-active {
  transition: all 101ms;
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