<template>
    <div class="Editor" :class="{ 'is-tiny': tiny }">
        <div class="Editor_first">
            <user-icon class="Editor_icon fx-no-shrink" :modifiers="tiny || $smallerThan('s') ? ['s'] : ['m']" :no-link="true" v-bind="user" />

            <form @submit.prevent="onSubmit" class="Editor_main">
                <input-area class="Editor_input" :placeholder="placeholder" :adaptable-text="!tiny" v-model="formData.content" @focus="() => { $emit('focus'); isFocused = true }" ref="input" />
            </form>
        </div>

        <div>
            <div class="mt-15 p-20 bg-bg-strong br-xs" v-if="images.length > 0">
                <content-type-images :images="images" :is-editor="true" @delete="onImageDelete" />
            </div>

            <transition name="fade">
                <div v-show="!isTrigger && (isFocused || images.length > 0)">
                    <div class="mt-10 ft-s color-ft-weak line-2 b-bottom pb-10" v-if="read">
                        <fa :icon="$t(`permissions.${read}.icon`)" class="mr-5" /> {{ $t(`permissions.${read}.subtitle`) }}.
                    </div>
                    
                    <form-errors class="mt-15" :items="errors" />

                    <div class="Editor_secondary">
                        <div class="d-flex fx-grow pr-10 fxj-end">
                            <input-file icon="image" :multiple="true" @input="addImages" :disabled="images.length > 3" />
                        </div>
                        <div class="fx-no-shrink">
                            <button-base :modifiers="['s', 'light']" icon-before="paper-plane" type="submit" @click="onSubmit" :loading="isLoading">
                                Envoyer
                            </button-base>
                        </div>
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
        isTrigger: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false },
        placeholder: { type: String },
        tiny: { type: Boolean, default: false },
        read: { type: String },
        errors: { type: Array, default: () => [] }
    },
    computed: {  
        
        images () {
            return this.formData.images ? this.formData.images.map(image => URL.createObjectURL(image)) : []
        }
    },
    data: () => ({
        isFocused: false,
        formData: {
            content: '',
            images: []
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
                content: '',
                images: []
            }
        },
        onSubmit () {
            this.$emit('submit', this.formData)
        },
        addImages (v) {
            this.formData.images = [
                ...this.formData.images,
                ...v
            ].slice(0, 4)
        },
        onImageDelete (index) {
            this.formData.images = this.formData.images.filter((c, i) => i != index)
        }
    }
}
</script>

<style lang="scss" scoped>
.Editor {

}

.Editor_first {
    display: flex;
    align-items: flex-start;
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
        }
    }

    .Editor_main {
        margin: 0 0 0 15px;
    }

    .Editor_secondary {
        background-color: transparent;
    }
}
</style>