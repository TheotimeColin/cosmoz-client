<template>
    <div class="Layout LayoutDefault" :class="[ classes ]">
        <!-- <div class="bg-ocean-xstrong pv-15">
            <div class="Wrapper fx-center">
                <div class="d-flex fx-align-center">
                    <div class="ft-title-s fx-no-shrink timer">{{ countdown }}</div>
                    <div class="fx-grow ml-10">
                        <p class="ft-title-xs">
                            On se lance bientôt.
                        </p>
                        <p>Soyez dans les premiers à réserver votre expérience (surprises à prévoir)</p>
                    </div>
                </div>
                <button-base class="ml-20">
                    Me prévenir
                </button-base>
            </div>
        </div> -->

        <default-header />
        
        <div class="LayoutDefault_content">
            <Nuxt />
        </div>

        <default-footer />
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
    margin-top: 65px;
}
</style>