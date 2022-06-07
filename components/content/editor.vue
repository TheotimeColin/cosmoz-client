<template>
    <div class="Editor" :class="{ 'is-tiny': tiny }">
        <user-icon class="Editor_icon fx-no-shrink" :modifiers="tiny || $smallerThan('s') ? ['s'] : ['m']" :no-link="true" :display-name="$smallerThan('xs')" v-bind="user" />

        <form @submit.prevent="onSubmit" class="Editor_main">
            <input-area class="Editor_input" :placeholder="placeholder" :adaptable-text="!tiny" v-model="formData.content" @focus="isFocused = true" @blur="onBlur" ref="input" />

            <transition name="fade">
                <div class="mt-10 ft-s color-ft-weak line-2 b-bottom pb-10" v-if="read && isFocused">
                    <fa :icon="$t(`permissions.${read}.icon`)" class="mr-5" /> {{ $t(`permissions.${read}.subtitle`) }}.
                </div>
            </transition>

            <div class="Editor_secondary">
                <div class="fx-grow pr-10 text-right">
                    <button-base :modifiers="['round', 'xs', 'xweak']" type="button" icon-before="image" />
                    <button-base :modifiers="['round', 'xs', 'xweak']" type="button" icon-before="gif" />
                </div>
                <div class="fx-no-shrink">
                    <button-base :modifiers="['s', 'light']" icon-before="paper-plane" type="submit" :loading="isLoading">
                        Envoyer
                    </button-base>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Editor',
    props: {
        isLoading: { type: Boolean, default: false },
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
    margin-left: 15px;
}

.Editor_secondary {
    display: flex;
    align-items: center;
    padding: 15px 0 0 0;
}

.Editor_input {
    background-color: var(--color-bg);
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
                background-color: var(--color-bg-strong);
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