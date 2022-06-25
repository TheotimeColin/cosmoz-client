<template>
    <div class="Area" :class="[ { 'is-tiny': !adaptableText } ]">
        <div class="Area_input" contenteditable="true" :placeholder="$options.filters.specials(placeholder)" @input="onInput" @paste="onPaste" @focus="$emit('focus')" @blur="$emit('blur')" ref="content"></div>
    </div>
</template>

<script>
export default {
    name: 'InputArea',
    props: {
        placeholder: { type: String },
        value: { type: String },
        adaptableText: { type: Boolean, default: false }
    },
    data: () => ({
        localValue: ''
    }),
    mounted () {
        if (this.$refs.content) this.$refs.content.innerText = this.value
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                if (this.$refs.content && this.localValue != v) this.$refs.content.innerText = v

                this.localValue = v
            }
        }
    },
    methods: {
        focus () {
            this.$refs.content.focus()
        },
        onPaste (e) {
            e.preventDefault()
            
            document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
        },
        onInput (e) {
            this.localValue = e.target.innerText
            this.$emit('input', this.localValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.Area {
    border-radius: 6px;

    &.is-tiny {

        .Area_input {
            padding: 8px 10px;
        }
    }
}

.Area_input {
    font: var(--ft-m);
    height: 100%;
    padding: 10px;

    &:focus {
        outline: none;
    }

    &:empty:before {
        content: attr(placeholder);
        font: var(--ft-m);
        color: var(--color-ft-weak);
        opacity: 0.35;
        pointer-events: none;
    }
}
</style>