<template>
    <div class="CardDefault CardRandom" :class="{ 'is-active': isActive, 'is-steps': steps && steps.length > 1 }">
        <div>
            <card-steps :steps="steps" :current-step="currentStep" />

            <div class="CardDefault_titleContainer" v-if="title || subtitle">
                <div class="CardDefault_title" v-html="$options.filters.toHTML(title)" v-if="title"></div>
                <div class="CardDefault_subtitle" v-html="$options.filters.toHTML(subtitle)" v-if="subtitle"></div>
            </div>
        </div>

        
        <div>
            {{ currentChoice.title|specials }}
        </div>

        <div class="fx-center width-100">
            <button-base :modifiers="['round', 'current']"  icon-before="rotate-right" @click.stop="randomize" />

            <button-base class="fx-grow ml-5" :modifiers="['current']" icon-before="check" @click.stop="$emit('nextStep')">
                A répondu
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardDefault',
    props: {
        title: { type: String },
        subtitle: { type: String },
        currentStep: { type: Number, default: 0 },
        isActive: { type: Boolean, default: false },
        choices: { type: Array, default: () => [] },
        maxResets: { type: [Boolean, Number], default: 3 },
        steps: { type: Array, default: () => [] }
    },
    data: () => ({
        choicesLeft: [],
        resets: 0
    }),
    computed: {
        currentChoice () {
            return this.choicesLeft[0]
        }
    },
    created () {
        this.choicesLeft = this.$shuffle(this.choices)
    },
    methods: {
        randomize () {
            this.resets += 1
            this.choicesLeft = this.choicesLeft.slice(1)
        }
    }
}
</script>

<style lang="scss" scoped>
.CardRandom {
    font: var(--ft-title-l);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;

    .CardDefault_titleContainer {
        margin: 0;
    }
}
</style>