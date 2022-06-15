<template>
    <div class="AppHeader" :class="{ 'is-scrolled': $store.state.page.isScrolled, 'is-hidden': !$appMeta }" v-if="$appMeta">
        <div class="AppHeader_wrapper">
            <div class="AppHeader_left">
                <div class="AppHeader_icon" @click="onIconClick">
                    <fa :icon="`far fa-${$appMeta.isPanel ? 'arrow-left' : $appMeta.fa}`" fixed-width />
                </div>

                <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                    {{ $appMeta.title }}
                </h1>
            </div>

            <div class="AppHeader_right" v-if="user">
                <!-- <button-base :modifiers="['round', 's', 'weak']" class="AppHeader_button" icon-before="paper-plane" />

                <button-base :modifiers="['round', 's', 'weak']" class="AppHeader_button" icon-before="bell" /> -->
            </div>
        </div>
    </div>
</template>

<script>
import { getMeta } from '@/utils/meta'

export default {
    name: 'AppHeader',
    data: () => ({
        nav: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        $appMeta () { return getMeta(this.$route, this.$store) }
    },
    watch: {
        $appMeta (v) {
            if (v) {
                document.documentElement.style.removeProperty('--app-height', '0px')
            } else {
                document.documentElement.style.setProperty('--app-height', '0px')
            }
        }
    },
    mounted () {
        this.nav = [
           
        ]
    },
    methods: {
        onIconClick () {
            if (this.$appMeta && this.$appMeta.back) {
                this.$router.push(this.localePath(this.$appMeta.back))
            }
        }
    }
}
</script>

<style lang="scss">
    :root {
        --app-height: 50px;
    }

    @include breakpoint-s {

        :root {
            --app-height: 60px;
        }
    }
</style>

<style lang="scss" scoped>
.AppHeader {
    position: fixed;
    top: var(--header-height);
    left: var(--nav-width);
    width: 100%;
    z-index: 90;
    background-color: var(--color-bg-strong);
    transition: all 100ms ease;
}

.AppHeader_icon {
    padding: 0 10px 0 15px;
    flex-shrink: 0;
    height: var(--app-height);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.AppHeader_button {

    & + & {
        margin-left: 3px;
    }
}

.AppHeader_left {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 30;
}

.AppHeader_wrapper {
    height: var(--app-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.AppHeader_right {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

@include breakpoint-s {
    .AppHeader {
        left: 0;
        top: 0;
    }
}
</style>