<template>
    <div class="CardDefault" :class="[{ 'is-active': isActive, 'is-sections': sections.length > 0, 'is-steps': steps && steps.length > 1, 'CardDefault--bg': background }, ...classes]" :style="background ? { backgroundImage: `url(${$bg[background] ? $bg[background] : background})` } : {}">
        <card-steps :steps="steps" :current-step="currentStep" />

        <div class="CardDefault_titleContainer" v-if="title || subtitle">
            <div class="CardDefault_title" v-html="$options.filters.toHTML(title)"></div>
            <div class="CardDefault_subtitle" v-html="$options.filters.toHTML(subtitle)" v-if="subtitle"></div>
        </div>

        <div v-if="choices">
            <button-base
                v-for="(choice, i) in choices"
                :modifiers="['current', 'full']"
                @click.native.stop
                class="mb-5"
                :key="i"
            >
                {{ choice.title|specials }}
            </button-base>
        </div>
        
        <div class="CardDefault_sections" v-if="sections">
            <div class="CardDefault_section" v-for="(section, i) in sections" :key="i">
                <p>{{ section.title|specials }} <span class="color-current-strong" v-if="section.subtitle">{{ section.subtitle|specials }}</span></p>
            </div>
        </div>

        <button-base :modifiers="['current']" @click.stop="$emit('nextStep')" v-if="nextCta">
            {{ nextCta }}
        </button-base>
        <div class="text-right" v-else>
            <button-base :modifiers="['round', 'current']" icon-before="long-arrow-right" @click.stop="$emit('nextStep')" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardDefault',
    props: {
        title: { type: String },
        subtitle: { type: String },
        classes: { type: Array, default: () => [] },
        background: { type: String, default: '' },
        currentStep: { type: Number, default: 0 },
        isActive: { type: Boolean, default: false },
        choices: { type: Array, default: () => [] },
        steps: { type: Array, default: () => [] },
        sections: { type: Array, default: () => [] },
        nextCta: { type: String }
    }
}
</script>

<style lang="scss" scoped>
.CardDefault_sections {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}

.CardDefault_section {
    font: var(--ft-title-s);
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 10px;
    border-bottom: 2px dotted var(--color-current);

    &:last-child {
        border: none;
    }
}

.CardDefault.is-sections {

    .CardDefault_titleContainer {
        font: var(--ft-m-medium);
        text-align: center;
        margin: 0;
    }

    .CardDefault_subtitle {
        font: var(--ft-s-medium);
    }
}
</style>