<template>
    <div class="InputMedia">
        <div class="InputMedia_cover" :style="{ backgroundImage: `url(${thumbnail})` }">
            <button-base @click="state.active = true">
                Sélectionner
            </button-base>
        </div>

        <media-library
            :is-active="state.active"
            :max="1"
            @input="onInput"
            @close="state.active = false"
        />
    </div>
</template>

<script>
export default {
    name: 'InputMedia',
    props: {
        value: { type: Object }
    },
    data: () => ({
        state: {
            active: false
        }
    }),
    computed: {
        thumbnail () {
            let thumbnail = this.value && this.value.medias.find(m => m.size == 'm')
            return thumbnail ? thumbnail.src : ''
        }
    },
    methods: {
        onInput (media) {
            this.$emit('input', media)
        }
    }
}
</script>

<style lang="scss" scoped>
.InputMedia {
    
}

.InputMedia_cover {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-weak);
    background-size: cover;
    background-position: center;

    & > * {
        opacity: 0;
    }

    &:hover > * {
        opacity: 1;
    }

    &::before {
        @include ratio(50);
    }
}
</style>