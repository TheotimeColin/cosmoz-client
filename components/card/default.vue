<template>
    <div class="CardDefault">
        <div class="Card_steps" v-if="steps && steps.length > 1">
            <div class="Card_step" :class="{ 'is-active': currentStep == step - 1 }" v-for="step in steps.length" :key="step"></div>
        </div>

        {{ title }} <span class="color-current" v-if="subtitle">{{ subtitle }}</span>
    </div>
</template>

<script>
export default {
    name: 'CardDefault',
    props: {
        title: { type: String },
        subtitle: { type: String },
        currentStep: { type: Number, default: 0 },
        steps: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
.CardDefault {
    font: var(--ft-title-m);
    padding: 20px;
}

.Card_steps {
    display: flex;
    margin-bottom: 20px;
    width: 80%;
}

.Card_step {
    flex-grow: 1;
    height: 4px;
    border-radius: 5px;
    margin-left: 5px;
    background-color: var(--color-current);
    max-width: 33%;

    &:first-child {
        margin-left: 0;
    }

    &.is-active {
        background-color: var(--color-current-strong);
    }
}
</style>