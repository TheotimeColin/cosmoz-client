<template>
    <div class="ImageCheck" :class="{ 'is-active': value }" :style="{ '--background': `url(${background})` }" @click="$emit('input', !value)">
        <div class="ImageCheck_content">
            <span class="tape tape-strong n-ml-3">
                {{ label }} <fa icon="far fa-check" class="ml-3" v-show="value"></fa>
            </span>
            <p class="ft-s-medium line-2 mt-5">{{ description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputImageCheck',
    components: {},
    props: {
        label: { type: String },
        description: { type: String },
        background: { type: String },
        value: { type: Boolean, default: false }
    },
    data: () => ({

    })
}
</script>

<style lang="scss" scoped>
    .ImageCheck {
        font: var(--ft-title-2xs);
        padding: 10px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        transition: all 150ms ease;
        cursor: pointer;

        &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.25;
            background-size: cover;
            background-position: center;
            background-image: var(--background);
        }

        &:hover {

            &::before {
                opacity: 0.35;
            }

            .ImageCheck_content {
                color: var(--color-ft-light);
            }
        }

        &.is-active {

            &::before {
                opacity: 0.75;
            }

            .ImageCheck_content {
                color: var(--color-ft-light);
            }
        }
    }

    .ImageCheck_content {
        position: relative;
        color: var(--color-ft-weak);
        transition: all 150ms ease;

        .tape {
            color: inherit;
        }

        p {
            text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        }
    }
</style>