<template>
    <div class="AppHeader"
        :class="{ 'is-scrolled': $store.state.page.isScrolled, 'is-hidden': !$appMeta, 'is-back': $appMeta.back, 'is-init': !changed }"
        v-if="$appMeta">
        <div class="AppHeader_wrapper">
            <div class="AppHeader_left AppHeader_left--prev" v-if="prev">
                <div class="AppHeader_iconContainer">
                    <button-base :modifiers="['round', 'transparent', 'ripples']" icon-before="arrow-left"
                        v-if="prev.isPanel" />
                    <fa class="AppHeader_icon" :icon="`far fa-${prev.fa}`" fixed-width v-else-if="prev.fa" />
                </div>

                <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                    {{ prev.title }}
                </h1>
            </div>

            <div class="AppHeader_left">
                <div class="AppHeader_iconContainer">
                    <button-base :modifiers="['round', 'transparent', 'ripples']" icon-before="arrow-left"
                        @click="onIconClick" v-if="$appMeta.isPanel" />
                    <fa class="AppHeader_icon" :icon="`far fa-${$appMeta.fa}`" fixed-width v-else-if="$appMeta.fa" />
                </div>

                <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                    {{ $appMeta.title }}
                </h1>
            </div>

            <div class="AppHeader_right" v-if="user">
                <button-icon class="AppHeader_button" fa="paper-plane" />

                <button-icon class="AppHeader_button" fa="bell" @click="() => $store.commit('page/toggleNotifs', true)"
                    :notification="notifications.length" />
            </div>
        </div>
    </div>
</template>

<script>
import { getMeta } from '@/utils/meta'

export default {
    name: 'AppHeader',
    data: () => ({
        prev: {},
        changed: false,
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        $appMeta() { return getMeta(this.$route, this.$store) },
        notifications() {
            return this.$store.getters['notification/find']({
                owner: this.user._id,
                state: 'unread'
            })
        }
    },
    watch: {
        $appMeta (v) {
            if (v) {
                document.documentElement.style.removeProperty('--app-height', '0px')
            } else {
                document.documentElement.style.setProperty('--app-height', '0px')
            }

            if (v.isPanel) {
                setTimeout(() => {
                    document.documentElement.style.setProperty('--sticky-height', '0px')
                }, 300)
            } else {
                document.documentElement.style.removeProperty('--sticky-height', '0px')
            }

            if (this.prev?.title !== v?.title && !this.changed) {
                this.changed = true

                setTimeout(() => {
                    this.changed = false
                }, 0)
                
                setTimeout(() => {
                    
                    this.prev = v
                }, 200)
            }
        },
    },
    mounted () {
        this.prev = this.$appMeta
    },
    methods: {
        onIconClick () {
            if (this.$appMeta && this.$appMeta.back) {
                this.$router.push(this.localePath(this.$appMeta.back))
            } else {
                this.$router.back()
            }
        }
    }
}
</script>

<style lang="scss">
    :root {
        --app-height: 60px;
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
    overflow: hidden;
    box-shadow: 0 0 10px 0 color-opacity('bg-xstrong', -50%);

    &.is-init {

        .AppHeader_left {
            transform: translateY(0%);
            opacity: 1;
            transition: all 200ms ease;
        }
        
        .AppHeader_left--prev {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
}

.AppHeader_iconContainer {
    flex-shrink: 0;
    height: var(--app-height);
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    position: relative;
    font-size: 15px;
}


.AppHeader_button {
    padding: 0 10px;
}

.AppHeader_left {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 30;
    transform: translateY(100%);
    opacity: 0;
}

.AppHeader_left--prev {
    position: absolute;
    left: 0;
    transform: translateY(0%);
    opacity: 1;
}

.AppHeader_wrapper {
    height: var(--app-height);
    display: flex;
    justify-content: space-between;
    position: relative;
}

.AppHeader_right {
    display: flex;
    margin-left: 20px;
    padding-right: 10px;
}

@include breakpoint-s {
    .AppHeader {
        left: 0;
        top: 0;
    }
}
</style>