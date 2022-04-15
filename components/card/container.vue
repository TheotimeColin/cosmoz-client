<template>
    <div class="Card is-cream" :class="{ 'is-left': clickDirection }" v-if="currentCard" @click="onClick">
        <card-default v-bind="currentCard" :current-step="currentStep" :steps="steps" />
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        steps: { type: Array, default: () => [] }
    },
    data: () => ({
        currentStep: 0,
        clickDirection: false
    }),
    computed: {
        currentCard () {
            return this.steps[this.currentStep] ? this.steps[this.currentStep] : null
        }
    },
    methods: {
        onClick (e) {
            this.clickDirection = e.offsetX > this.$el.offsetWidth / 2

            if (this.clickDirection) {
                this.currentStep = this.currentStep >= this.steps.length - 1 ? this.steps.length - 1 : this.currentStep + 1
            } else {
                this.currentStep = this.currentStep - 1 <= 0 ? 0 : this.currentStep - 1
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Card {
    font: var(--ft-title-m);
    border-radius: 15px;
    color: var(--color-cream-xstrong);
    background-color: var(--color-cream-weak);
    height: 70vh;
    user-select: none;
    transition: all 250ms ease;

    &:active {
        transform: perspective(50px) rotateY(-1deg);

        &.is-left {
            transform: perspective(50px) rotateY(1deg);
        }
    }
}
</style>