<template>
    <div class="CardDefault" :class="{ 'is-active': isActive, 'is-sections': sections.length > 0, 'is-steps': steps && steps.length > 1 }">
        <div class="Card_steps" v-if="steps && steps.length > 1">
            <div class="Card_step" :class="{ 'is-active': currentStep == step - 1 }" v-for="step in steps.length" :key="step"></div>
        </div>

        <div class="Card_titleContainer" v-if="title || subtitle">
            <div class="Card_title" v-html="$options.filters.toHTML(title)"></div>
            <div class="Card_subtitle" v-html="$options.filters.toHTML(subtitle)" v-if="subtitle"></div>
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
        
        <div class="Card_sections" v-if="sections">
            <div class="Card_section" v-for="(section, i) in sections" :key="i">
                <p>{{ section.title|specials }} <span class="color-current-strong" v-if="section.subtitle">{{ section.subtitle|specials }}</span></p>
            </div>
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
        steps: { type: Array, default: () => [] },
        sections: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
.CardDefault {
    display: flex;
    flex-direction: column;
    font: var(--ft-title-m);
    padding: 20px;
    height: 100%;
    position: relative;

    &.is-active {

        .Card_subtitle {
            color: var(--color-current-strong);
        }
    }

    &.is-steps {
        
        .Card_titleContainer {
            margin-top: 30px;
        }
    }
}

.Card_titleContainer {
    margin: 0 0 20px;
}

.Card_title ::v-deep .secondary {
    color: var(--color-current-strong);
}

.Card_subtitle {
    font: var(--ft-m-medium);
    margin-top: 10px;
}

.Card_steps {
    display: flex;
    margin-bottom: 20px;
    width: 60%;
    position: absolute;
    top: 20px;
    left: 20px;
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

.Card_sections {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}

.Card_section {
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

    .Card_titleContainer {
        font: var(--ft-m-medium);
        text-align: center;
        margin: 0;
    }

    .Card_subtitle {
        font: var(--ft-s-medium);
    }
}
</style>