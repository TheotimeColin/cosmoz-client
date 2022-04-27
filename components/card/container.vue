<template>
    <div class="Card" :class="{ 'is-left': clickDirection, 'is-active': isActive }" v-if="currentCard" @click="onClick">
        <card-default
            v-bind="currentCard"
            :is-active="isActive"
            :current-step="currentStep"
            :steps="steps" 
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
        }
    },
    methods: {
        onClick (e) {
            this.clickDirection = e.offsetX > this.$el.offsetWidth / 2

            if (this.clickDirection) {
                if (this.currentCard.choices && this.currentCard.choices.length > 0) return

                if (this.currentStep == this.steps.length - 1) this.$emit('cardLast')

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
    color: var(--color-current);
    background-color: var(--color-current-weak);
    height: 70vh;
    user-select: none;
    transition: all 250ms ease;

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
</style>