<template>
    <div>
        <nav
            class="AppNav"
            :class="{ 'is-active': isActive, 'is-panning': isPanning, 'is-closing': isClosePanning, 'is-const': isOpenNav && $biggerThan('s'), 'is-desktop': $biggerThan('s'), 'is-mounted': isMounted }"
            :style="{
                transform: isClosePanning ? `translateX(calc(0% + ${closePan}px))` : `translateX(calc(-100% + ${pan}px))`
            }"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend="onPanEnd"
            v-hammer:pancancel="onPanEnd"
        >
            <div class="AppNav_content">
                <div class="AppNav_primary">
                    <div class="+mt-10 p-relative">
                        <div class="Att_ripples" v-if="!$store.getters['user/notif']('home-menu', 'onboarding')"></div>
                        
                        <button-base class="AppNav_icon AppNav_icon--home" :class="{ 'is-active': !isExplore && !selectConst }" 
                        @mouseenter.native="(e) => $tOpen('Mon espace', e, { delay: 400, pos: 'right' })" @mouseleave.native="$tClose"
                        :modifiers="['round', 'weak', 'm']" :to="{ name: 'feed' }" icon-before="home" />
                    </div>

                    <hr class="+mt-10 Separator bg-bg" v-if="constellations.length > 0 || selectConst">

                    <div class="+mt-10 AppNav_constellations" v-if="constellations.length > 0 || selectConst">
                        <const-icon class="AppNav_const AppNav_icon" :class="{ 'is-active': $route.params.slug == constellation.slug }" :modifiers="['m']" :feed="true" v-for="constellation in constellations" @mouseenter.native="(e) => $tOpen(constellation.name, e, { delay: 400, pos: 'right' })" @mouseleave.native="$tClose" v-bind="constellation" :key="constellation._id" />

                        <const-icon class="AppNav_const AppNav_icon" :class="{ 'is-active': $route.params.slug == selectConst.slug }" :modifiers="['m']" :feed="true"  @mouseenter.native="(e) => $tOpen(selectConst.name, e, { delay: 400, pos: 'right' })" @mouseleave.native="$tClose" v-bind="selectConst" :key="selectConst._id" v-if="selectConst && !constellations.find(c => c._id == selectConst._id)" />
                    </div>

                    <hr class="+mt-10 Separator bg-bg">
                    
                    <div class="+mt-10 p-relative" @click="$store.dispatch('user/updateNotification', { id: 'explore-menu', type: 'onboarding' })">
                        <div class="Att_ripples" v-if="!$store.getters['user/notif']('explore-menu', 'onboarding')"></div>
                    
                        <button-base class="AppNav_icon AppNav_icon--explore" :attention="true" :modifiers="['round', 'weak', 'm']" :to="{ name: 'explore' }" icon-before="compass" @mouseenter.native="(e) => $tOpen('Explorer', e, { delay: 400, pos: 'right' })" @mouseleave.native="$tClose" />
                    </div>
                    
                    <button-base class="+mt-10 AppNav_icon AppNav_icon--create" :modifiers="['round', 'weak', 'm']" @click="$store.commit('page/popin', { constellationCreate: true })" icon-before="plus" @mouseenter.native="(e) => $tOpen('Créer une constellation', e, { delay: 400, pos: 'right' })" @mouseleave.native="$tClose"  v-if="user" />
                </div>
                <div class="AppNav_sub">
                    <div class="AppNav_subContent" v-if="!selected && !isExplore" key="selected">
                        <div class="AppNav_header bg-cover bg-night" v-if="user">
                            <user-icon v-bind="user" :modifiers="['m']" :display-name="true" />

                            <quick-menu
                                :button="{ modifiers: ['xweak'] }"
                                :items="[
                                    { fa: 'gear', to: { name: 'compte' }, label: `Mon compte` },
                                    { fa: 'arrow-right-from-bracket', to: { name: 'compte-logout'}, label: `Se déconnecter` }
                                ]"
                            />
                        </div>
                        
                        <div class="AppNav_menu">
                            <nav-list :items="nav" />
                        </div>

                        <div class="AppNav_footer">
                            <div class="mt-10 p-20 b text-center br-xs">
                                Une question ? Besoin d'aide ?
                                <link-base :to="{ name: 'faq' }">Centre d'aide</link-base>
                            </div>
                        </div>
                    </div>
                    <div class="AppNav_subContent" v-else-if="!selected && isExplore" key="explore">
                        <div class="AppNav_header AppNav_header--explore bg-cover bg-ice-cream text-center">
                            <p class="ft-title-xs">
                                <fa icon="far fa-compass" class="mr-5" /> Explorer
                            </p>
                        </div>
                        <div class="AppNav_menu">
                            <nav-list :items="exploreNav" />
                        </div>
                    </div>
                    <page-const-nav
                        v-bind="selectConst"
                        v-else-if="selected && selectConst" :key="selectConst._id"
                    />
                </div>
            </div>

            <div class="AppNav_hider" :style="{ opacity: translate }" @click="isActive = false"></div>
        </nav>

        
        <div class="AppNav_swipe Att_swipe" v-if="!$store.getters['user/notif']('left-menu', 'onboarding')">
            Glisse vers la droite
        </div>

        <app-sticky
            :translate="translate"
            :is-active="isActive"
            :is-panning="isPanning || isClosePanning"
            @open="() => { isActive = true; $emit('open') }"
        />
    </div>
</template>

<script>
export default {
    async fetch () {
        if (this.user) {
            await this.$store.dispatch('constellation/softFetch', [
                ...this.user.followedConstellations,
                ...this.user.constellations,
                ...this.user.createdConstellations
            ])
        }
    },
    name: 'AppNav',
    props: {
        pan: { type: Number, default: 0 },
        isPanning: { type: Boolean, default: false },
    },
    data: () => ({
        isActive: false,
        exploreNav: [],
        isClosePanning: false,
        closePan: 0
    }),
    watch: {
        $route () {
            this.isActive = false
        },
        isPanning (v) {
            if (!v && this.pan > 100) {
                if (this.user && !this.$store.getters['user/notif']('left-menu', 'onboarding')) this.$store.dispatch('user/updateNotification', { id: 'left-menu', type: 'onboarding' })
                this.isActive = true
            }
        },
        isClosePanning (v) {
            if (!v && this.closePan < -25) this.isActive = false
        },
        isActive (v) {
            this.$store.commit('page/toggleOverflow', !v)
        }
    },
    computed: {
        constellations () {
            return this.user ? this.$store.getters['constellation/find']({
                $or: {
                    members: { $contains: this.user._id },
                    followers: { $contains: this.user._id },
                    organizers: { $contains: this.user._id },
                    admins: { $contains: this.user._id },
                }
            }) : []
        },
        selected () {
            return this.$route.params.slug ? this.$route.params.slug : false
        },
        selectConst () {
            return this.selected ? this.$store.getters['constellation/findOne']({ slug: this.$route.params.slug }) : null
        },
        currentConst () { return this.$store.state.page.currentConst },
        isOpenNav () { return true; },
        isExplore () { return this.$route.name.includes('explore') },
        translate () {
            return Math.max(this.isClosePanning ? 1 + (this.closePan / 340) : (this.pan / 340), 0)
        },
        nav () {
            return [
                { label: `Mon activité`, fa: 'home', to: { name: 'feed' } },
                { label: `Mon agenda`, fa: 'calendar', to: { name: 'agenda' }, isParent: true, number: this.$store.getters['gathering/find']({
                    status: 'active', isPast: false, isAttending: true
                }).length },
                { label: `Mes constellations`, fa: 'sparkles', to: { name: 'constellation' } },
            ]
        },
    },
    created () {
        this.exploreNav = [
            { label: `Suggestions`, fa: 'wand-magic-sparkles', to: { name: 'explore' } },
            { label: `Événements à venir`, fa: 'calendar-star', to: { name: 'explore-events' } }
        ]
    },
    methods: {
        open () {
            this.isActive = true
            this.isClosePanning = false
            this.closePan = 0
        },
        onPan (v) {
            this.isClosePanning = true
            this.$nextTick(() => this.closePan = Math.min(0, v.deltaX))
        },
        onPanEnd () {
            this.isClosePanning = false
            
            this.$nextTick(() => this.closePan = 0)
        }
    }
}
</script>

<style lang="scss">
    :root {
        --nav-width: 340px;
    }
</style>

<style lang="scss" scoped>
.AppNav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    transform: translateX(-100%);
    transition: all 200ms ease;
    z-index: 100;
    height: calc(100% - var(--header-height));
    
    &.is-desktop:hover,
    &.is-const,
    &.is-active:not(.is-panning):not(.is-closing) {
        transform: translateX(0%) !important;

        .AppNav_hider {
            opacity: 1 !important;
        }
    }

    &.is-panning {
        transition: none;

        .AppNav_hider {
            opacity: calc(var(--opacity, 1) - 1);
        }

        .AppNav_sub {
            overflow: hidden;
        }
    }

    &.is-closing {
        transition: none;

        .AppNav_sub {
            overflow: hidden;
        }
    }

    &.is-const {
        top: var(--header-height);
        
        .AppNav_hider {
            display: none;
        }
    }
    
    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: -5px;
        height: 100%;
        width: 5px;
    }
}

.AppNav_icon--home {

    &:hover,
    &.is-active {
        background-color: var(--color-cosmoz);
        color: var(--color-ft-light);
    }
}

.AppNav_content {
    display: flex;
    width: var(--nav-width);
    height: 100%;
    background-color: var(--color-bg-strong);
    box-shadow: 0 0 10px 0 color-opacity('bg-xstrong', -50%);
}

.AppNav_primary {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: var(--color-bg-xstrong);
}

.AppNav_icon {
    cursor: pointer;
    transition: all 100ms ease-out;
    opacity: 0.5;

    &:hover {
        transform: scale(0.95);
        opacity: 1;
    }

    &:active {
        transform: scale(0.90);
    }

    &.is-active {
        opacity: 1;
        pointer-events: none;
        transform: scale(0.95);
    }
}

.AppNav_const {
    
    & + & {
        margin-top: 7px;
    }
}

.AppNav_constellations {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    padding: 0;
    @include hide-scrollbars;
}

.AppNav_icon--explore {

    &:hover,
    &.is-active {
        background-color: var(--color-emerald);
        color: var(--color-ft-light);
    }
}

.AppNav_icon--create {

    &:hover,
    &.is-active {
        background-color: var(--color-cosmoz);
        color: var(--color-ft-light);
    }
}

.AppNav_sub {
    overflow: auto;
    touch-action: pan-y !important;
    @include mini-scrollbar;
}

.AppNav_subContent {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.AppNav_hider {
    position: fixed;
    top: 0;
    left: var(--nav-width);
    width: 120vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    opacity: 0;
    transition: opacity 150ms ease;
}

.AppNav_logo {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30;
}

.AppNav_header {
    background-size: cover;
    background-position: center;
    background-color: var(--color-bg-xstrong);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px;
    min-height: 100px;
}

.AppNav_header--explore {
    justify-content: center;
}

.AppNav_sub {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.AppNav_menu {
    flex-grow: 1;
    padding: 15px;
}

.AppNav_menuItem {

    & + & {
        margin-top: 20px;
    }
}

.AppNav_menuSubitem  {
    font: var(--ft-title-2xs);
    line-height: 1;
    cursor: pointer;
    color: var(--color-ft-light);
    text-decoration-color: var(--color-ft-xweak);
    border-radius: 5px;
    transition: all 100ms ease;

    display: block;
    padding: 12px 10px;

    svg {
        margin-right: 8px;
    }

    &:hover,
    &.is-active {
        background-color: var(--color-bg);
    }
}

.AppNav_footer {
    padding: 15px;
}

.AppNav_navBar {
    display: none;
}

.AppNav_swipe {
    position: fixed;
    z-index: 20;
    left: 10px;
    bottom: calc(var(--sticky-height) + 10px);
}

@include breakpoint-s {
    .AppNav {
        top: 0;
        display: none;
        transition: none;

        &.is-mounted {
            display: block;
            transition: all 200ms ease;
        }

        &.is-panning,
        &.is-closing {
            transition: none;
        }

        &::before {
            display: none;
        }
        
        &.is-active:not(.is-panning):not(.is-closing) {

            .AppNav_hider {
                pointer-events: all;
            }
        }

        &.is-closing {

            .AppNav_hider {
                pointer-events: all;
            }
        }
    }

    .AppNav_hider {
        transition: none;
    }
    
    .AppNav_navBar {
        background-color: var(--color-bg-xstrong);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 6px;
    }

    .AppNav_content {
        height: 100%;
    }

    .AppNav_barLabel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        text-align: center;

        &.is-active {
            color: var(--cosmoz-weak);
        }

        & > div {
            font: var(--ft-2xs);
        }

        .icon {
            font-size: 18px;
            margin: 0 auto 5px;
        }
    }
}

@include breakpoint-xs {

    .AppNav {
        width: 100vw;
    }
    
    .AppNav_content {
        width: calc(100% - 50px);
    }

    .AppNav_hider {
        left: calc(100% - 50px);
    }
}
</style>