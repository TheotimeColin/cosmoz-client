<template>
    <div class="UserProfile bgi-holo" :class="[ theme, ...$modifiers, { 'is-affinity': isAffinity } ]" :style="src ? { backgroundImage: `url(${src})` } : {}">
        <div class="UserProfile_content">
            <div></div>
            <div>
                {{ name }}
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'UserProfile',
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String },
        name: { type: String },
        profileLarge: { type: String },
        isAffinity: { type: Boolean, default: false },
    },
    data: () => ({
        theme: 'is-cream'
    }),
    computed: {
        src ()  {
            return this.profileLarge
        }
    },
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserProfile {
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

    font: var(--ft-m-bold);
    text-transform: uppercase;
    font-style: italic;
}
</style>