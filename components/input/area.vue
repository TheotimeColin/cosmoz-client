<template>
    <div class="Area" :class="[ `is-${size}` ]">
        <div class="Area_input" contenteditable="true" :placeholder="placeholder" @input="onInput" @paste="onPaste" @focus="$emit('focus')" @blur="$emit('blur')" ref="content"></div>
    </div>
</template>

<script>
export default {
    name: 'InputArea',
    props: {
        placeholder: { type: String },
        value: { type: String }
    },
    data: () => ({
        localValue: ''
    }),
    computed: {
        size () {
            if (this.localValue.length <= 100) {
                return 'l'
            } else if (this.localValue.length <= 300) {
                return 'm'
            } else {
                return 's'
            }
        }
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

    &.is-m .Area_input {
        font: var(--ft-l);
    }

    &.is-s .Area_input {
        font: var(--ft-m);
    }
}

.Area_input {
    font: var(--ft-xl);
    padding-top: 10px;
    padding-bottom: 15px;

    &:focus {
        outline: none;
    }

    &:empty:before {
        content: attr(placeholder);
        color: var(--color-ft-weak);
        opacity: 0.5;
        font-style: italic;
        pointer-events: none;
    }
}
</style>