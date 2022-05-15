<template>
    <div class="Editor" :class="{ 'is-tiny': tiny }">
        <user-icon class="fx-no-shrink" :modifiers="tiny ? ['s'] : ['l']" v-bind="user" />

        <div class="Editor_main">
            <input-area class="Editor_input" :placeholder="placeholder" :adaptable-text="!tiny" v-model="formData.content" @focus="isFocused = true" @blur="onBlur" ref="input" />

            <transition name="fade">
                <div class="Editor_secondary" v-show="isFocused">
                    <div class="fx-grow"></div>
                    <div>
                        <link-base class="color-ft-weak mr-10" @click="onBlur">Annuler</link-base>
                        <button-base :modifiers="['s', 'light']" icon-before="paper-plane" @click="onSubmit">
                            Envoyer
                        </button-base>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Editor',
    props: {
        placeholder: { type: String },
        tiny: { type: Boolean, default: false },
    },
    computed: {  
        user () { return this.$store.getters['user/self'] },
    },
    data: () => ({
        isFocused: false,
        formData: {
            content: ''
        }
    }),
    methods: {
        focus () {
            this.$refs.input.focus()
        },
        onBlur () {
            setTimeout(() => {
                this.$emit('blur')
                this.isFocused = false
            }, 150)
        },
        reset () {
            this.formData = {
                content: ''
            }
        },
        onSubmit () {
            this.$emit('submit', this.formData)
        }
    }
}
</script>

<style lang="scss" scoped>
.Editor {
    display: flex;

    &.is-tiny {
        
        .Editor_main {
            margin-left: 10px;
        }

        .Editor_input {
            background-color: var(--color-bg);
        }

        .Editor_secondary {
            border: none;
            padding-top: 10px;
        }
    }
}

.Editor_main {
    flex-grow: 1;
    margin-left: 20px;
}

.Editor_secondary {
    display: flex;
    align-items: center;
    padding: 20px 0 0 0;
    border-top: 1px solid var(--color-border);
}
</style>