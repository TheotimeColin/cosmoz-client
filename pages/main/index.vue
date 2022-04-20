<template>
    <div class="Homepage">
        <div class="Wrapper">
            <div class="Homepage_week mt-60">
                <div class="Homepage_weekTitle" :style="{ '--background': `url(https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
                    <span>cette semaine <b>02 - 09 avril</b></span>
                </div>
                <div class="Homepage_row">
                    <div class="row-s">
                        <div class="col-4 col-6@s mb-40" v-for="gathering in gatherings" :key="gathering._id">
                            <block-gathering
                                v-bind="gathering"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="Homepage_week mt-60">
                <div class="Homepage_weekTitle" :style="{ '--background': `url(https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
                    <span>semaine dernière <b>24 - 31 mars</b></span>
                </div>
                <div class="Homepage_row">
                    <div class="row-s">
                        <div class="col-4 col-6@s" v-for="gathering in gatherings" :key="gathering._id">
                            <block-gathering
                                v-bind="gathering"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    computed: {
        gatherings () { return this.$store.getters['gathering/find']() },
    }
}
</script>

<style lang="scss" scoped>
.Homepage_row {
    border-left: 1px solid var(--color-border);
    padding: 0 0 0 40px;
}

.Homepage_weekTitle {
    font: var(--ft-title-l);
    line-height: 1;
    margin-bottom: 40px;
    position: relative;

    span {
        position: relative;
        z-index: 2;
    }

    b {
        font: var(--ft-s-medium);
        text-transform: uppercase;
        margin-left: 3px;
        color: var(--color-ft-weak);
    }

    &::before {
        content: "";
        display: block;
        position: absolute;
        left: -35px;
        top: -18px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-image: var(--background);
        background-size: cover;
        background-position: center;
    }
}
</style>