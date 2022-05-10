<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'p-id', params: { id: _id }})" class="UserIcon" :class="[ theme, ...$modifiers ]" :style="src ? { backgroundImage: `url(${src})` } : {}">
        <template v-if="!src">
            {{ name.slice(0, 1) }}
        </template>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String },
        name: { type: String },
        profileLarge: { type: String },
        pictureSrc: { type: String },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({
        theme: 'is-cream'
    }),
    computed: {
        src ()  {
            return this.pictureSrc ? this.pictureSrc : this.profileLarge
        }
    },
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserIcon {
    width: 35px;
    height: 35px;
    display: inline-flex;
    vertical-align: top;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    font: var(--ft-title-s);
    text-transform: lowercase;
    background-color: var(--color-current-weak);
    color: var(--color-current-strong);
    background-size: cover;
    background-position: center;
}

.UserIcon--xl {
    width: 75px;
    height: 75px;
    font-size: 40px;
}

.UserIcon--2xl {
    width: 125px;
    height: 125px;
    font-size: 60px;
}
</style>