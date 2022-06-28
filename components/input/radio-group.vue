<template>
    <div class="InputRadioGroup">
        <label class="InputRadioGroup_choice" :class="{ 'is-disabled': option.disabled }" v-for="option in options" :key="option.value">
            <input class="InputRadioGroup_input" type="radio" :checked="option.value == localValue" @click="localValue = option.value">

            {{ option.label }}
        </label>
    </div>
</template>

<script>
export default {
    name: 'InputRadioGroup',
    props: {
        label: { type: String, default: '' },
        options: { type: Array, default: () => [] },
        value: { type: String }
    },
    data: () => ({
        localValue: null
    }),
    computed: {
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.localValue = v
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                if (this.changesMade) this.$emit('input', v)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.InputRadioGroup {

}

.InputRadioGroup_choice {
    display: flex;
    align-items: center;

    &.is-disabled {
        opacity: 0.33;
        pointer-events: none;
    }

    & + & {
        margin-top: 5px;
    }
}

.InputRadioGroup_input {
    appearance: auto;
    width: 15px;
    height: 15px;
    margin-right: 5px;
}
</style>