<template>
    <div class="Editor" :class="{ 'is-tiny': tiny }">
        <user-icon class="Editor_icon fx-no-shrink" :modifiers="tiny || $smallerThan('s') ? ['s'] : ['m']" :no-link="true" v-bind="user" />

        <form @submit.prevent="onSubmit" class="Editor_main">
            <input-area class="Editor_input" :placeholder="placeholder" :adaptable-text="!tiny" v-model="formData.content" @focus="isFocused = true" @blur="onBlur" ref="input" />

            <transition name="fade">
                <div class="Editor_secondary" v-show="isFocused">
                    <div class="fx-grow pr-20">
                        <p class="ft-s color-ft-weak line-2" v-if="read">
                            <fa :icon="$t(`permissions.${read}.icon`)" class="mr-5" /> {{ $t(`permissions.${read}.subtitle`) }}.
                        </p>
                    </div>
                    <div class="fx-no-shrink">
                        <link-base class="color-ft-weak mr-10" @click="onBlur">Annuler</link-base>
                        <button-base :modifiers="['s', 'light']" icon-before="paper-plane" type="submit">
                            Envoyer
                        </button-base>
                    </div>
                </div>
            </transition>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Editor',
    props: {
        placeholder: { type: String },
        tiny: { type: Boolean, default: false },
        read: { type: String }
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
    align-items: flex-start;

    &.is-tiny {
        
        .Editor_main {
            margin-left: 10px;
        }

        .Editor_input {
            background-color: var(--color-bg-strong);
        }

        .Editor_secondary {
            border: none;
            padding-top: 10px;
        }
    }
}

.Editor_main {
    flex-grow: 1;
    margin-left: 15px;
}

.Editor_secondary {
    display: flex;
    align-items: center;
    padding: 15px 0 0 0;
}

.Editor_input {
    background-color: var(--color-bg-strong);
}

@include breakpoint-xs {

    .Editor {
        display: block;

        &.is-tiny {

            .Editor_icon {
                display: none;
            }
            
            .Editor_main {
                margin: 0;
            }

            .Editor_input {
                background-color: var(--color-bg-xstrong);
            }
        }
    }

    .Editor_main {
        margin: 15px 0 0 0;
    }

    .Editor_secondary {
        background-color: transparent;
    }
}
</style>