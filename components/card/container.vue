<template>
    <div class="Card" :class="{ 'is-left': clickDirection, 'is-active': isActive }" v-if="currentCard" @click="onClick">
        <component
            :is="cardType"
            v-bind="currentCard"
            :is-active="isActive"
            :current-step="currentStep"
            :steps="steps" 
            @nextStep="nextStep"
        />
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        isActive: { type: Boolean, default: false },
        steps: { type: Array, default: () => [] }
    },
    data: () => ({
        currentStep: 0,
        clickDirection: false
    }),
    computed: {
        currentCard () {
            return this.steps[this.currentStep] ? this.steps[this.currentStep] : null
        },
        cardType () {
            let type = 'card-default'

            if (this.currentCard.type == 'random') type = 'card-random'
            if (this.currentCard.type == 'titles') type = 'card-titles'

            return type
        }
    },
    methods: {
        prevStep () {
            this.currentStep = this.currentStep - 1 <= 0 ? 0 : this.currentStep - 1
        },
        nextStep (isClickDirection) {
            // if (this.currentCard.choices && this.currentCard.choices.length > 0) return

            if (this.currentStep == this.steps.length - 1 && !isClickDirection) this.$emit('cardLast')

            this.currentStep = this.currentStep >= this.steps.length - 1 ? this.steps.length - 1 : this.currentStep + 1
        },
        onClick (e) {
            this.clickDirection = e.offsetX > this.$el.offsetWidth / 2

            if (this.clickDirection) {
                this.nextStep(true) 
            } else {
                this.prevStep()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Card {
    font: var(--ft-title-m);
    border-radius: 10px;
    color: var(--color-current);
    background-color: var(--color-current-weak);
    height: 70vh;
    max-height: 450px;
    user-select: none;
    transition: all 250ms ease;
    overflow: hidden;

    &:active {
        transform: perspective(50px) rotateY(-0.25deg);

        &.is-left {
            transform: perspective(50px) rotateY(0.25deg);
        }
    }

    &.is-active {
        color: var(--color-current-xstrong);
    }
}

.Card.is-strong {
    color: var(--color-ft-light);
    background-color: var(--color-bg-strong);

    .CardDefault_step {
        background-color: var(--color-bg-weak);
    
        &.is-active {
            background-color: var(--color-bg-light);
        }
    }
}

</style>