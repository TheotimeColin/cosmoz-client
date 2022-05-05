<template>
    <div class="CardDefault CardTitles" :class="[ { 'is-active': isActive }, ...classes ]">
        <div>
            <div class="CardDefault_subtitle" v-html="subtitle ? $options.filters.toHTML(subtitle) : `Sélectionné pour votre groupe`"></div>
        </div>

        <div class="CardDefault_titleContainer" v-if="title || subtitle">
            <div class="CardDefault_title" v-html="$options.filters.toHTML(title)" v-if="title"></div>
        </div>

        <button-base :modifiers="['light']" @click.stop="$emit('nextStep')">
            Commencer
        </button-base>
    </div>
</template>

<script>
export default {
    name: 'CardTitles',
    props: {
        title: { type: String },
        subtitle: { type: String },
        classes: { type: Array, default: () => [] },
        currentStep: { type: Number, default: 0 },
        isActive: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>
.CardTitles {
    color: var(--color-ft-light);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    background-size: cover;
    background-position: center;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 0.5;
    }

    & > * {
        position: relative;
        z-index: 2;
    }

    .CardDefault_titleContainer {
        margin: 0;
    }

    .CardDefault_title {
        font: var(--ft-title-xl);
        letter-spacing: 0.02em;
        font-size: 38px;
        line-height: 1;
    }

    .CardDefault_subtitle {
        font: var(--ft-s);
        color: var(--color-ft-light);
        opacity: 0.5;
    }
}
</style>