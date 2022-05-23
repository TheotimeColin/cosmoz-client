<template>
    <label class="Toggle" v-bind="attrs">
        <input class="Toggle_checkbox" type="checkbox" :checked="transformedValue" @click="onInput(!transformedValue)">
        <div class="Toggle_container"></div>

        <p class="Toggle_label" v-if="label">{{ label }}</p>
    </label>
</template>

<script>
export default {
    name: 'ToggleBase',
    props: {
        value: { type: [Boolean, String], default: false },
        label: { type: String, default: '' },
        transformer: { type: [Object, Boolean], default: false },
        attrs: { type: Object, default: () => {} }
    },
    computed: {
        transformedValue () {
            return this.$props.transformer ? this.$props.transformer.get(this.$props.value) : this.$props.value
        }
    },
    methods: {
        onInput (value) {
            this.$emit('input', this.$props.transformer ? this.$props.transformer.set(value) : value)
        }
    }
}
</script>

<style lang="scss" scoped>
.Toggle {
    display: flex;
    align-items: center;
    cursor: pointer;

    --height: 25px;
    --padding: 3px;
}

.Toggle_label {
    margin-left: 10px;
}

.Toggle_container {
    --toggle-size: calc(var(--height) - calc(var(--padding) * 2));

    width: calc(var(--toggle-size) * 2 + calc(var(--toggle-size) / 2));
    height: var(--height);
    background-color: var(--color-border);
    border-radius: 60px;
    display: flex;
    align-items: center;
    padding: var(--padding);
    flex-shrink: 0;
    transition: all 150ms ease;

    &::after {
        content: "";
        display: block;
        width: var(--toggle-size);
        height: var(--toggle-size);
        background-color: var(--color-bg-light);
        border-radius: 50%;
        transition: transform 150ms ease;
    }
}

.Toggle_checkbox:checked + .Toggle_container {
    background-color: var(--color-cosmoz);

    &::after {
        transform: translateX(calc(var(--toggle-size) + calc(var(--toggle-size) / 2) - calc(var(--padding) * 2)));
    }
}

.Toggle_checkbox {
    position: absolute;
    pointer-events: none;
    opacity: 0;
}
</style>