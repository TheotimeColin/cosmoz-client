<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'p-id', params: { id }})" class="UserProfile bgi-holo" :class="[ theme, ...$modifiers, { 'is-affinity': isAffinity } ]" :style="src ? { backgroundImage: `url(${src})` } : {}">
        <div class="UserProfile_overlay" v-if="overlay">
            {{ overlay }}
        </div>
        <div class="UserProfile_content" v-else>
            <div>
                <div class="round bg-sticky color-ft" v-if="isAffinity">
                    <i class="fal fa-sparkles"></i>
                </div>
                <div class="round bg-bg-light color-ft" v-else-if="gathering && sent">
                    <i class="fal fa-check"></i>
                </div>
            </div>
            <div>
                <div class="UserProfile_title">{{ name }}</div>
            </div>
        </div>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'UserProfile',
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String },
        id: { type: String },
        gathering: { type: String },
        name: { type: String },
        overlay: { type: String },
        mentions: { type: Array, default: () => [] },
        profileLarge: { type: String },
        isAffinity: { type: Boolean, default: false },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({
        theme: 'is-cream'
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        src ()  { return this.profileLarge },
        sent () { return this.mentions.find(m => m.user == this.user._id && m.gathering == this.gathering) ? true : false }
    },
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserProfile {
    display: block;
    background-size: cover;
    background-position: center;
    position: relative;
    background-color: var(--color-bg-weak);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;

    &::before {
        content: "";
        display: block;
        @include ratio(150);
    }
}

.UserProfile_content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    padding: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.UserProfile_title {
    font: var(--ft-m-bold);
    text-transform: uppercase;
    font-style: italic;
}

.UserProfile_overlay {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 20px;
    font: var(--ft-s-bold);
    text-transform: uppercase;
    font-style: italic;
}
</style>