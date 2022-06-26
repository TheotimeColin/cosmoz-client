<template>
    <div class="Editor" :class="{ 'is-focused': isFocused }">
        <div class="Editor_left d-none@xs">
            <user-icon class="fx-no-shrink mr-10" :modifiers="['s']" v-bind="user" />
        </div>

        <form class="Editor_main" @submit.prevent="onSubmit">
            <div class="Editor_first">
                <input-area class="Editor_input" :placeholder="placeholder" :adaptable-text="!tiny" v-model="formData.content" @focus="() => { $emit('focus'); isFocused = true }" ref="input" />
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
                            <link-base @click="() => { isFocused = false; $emit('cancel') }">Annuler</link-base>
                            <div class="d-flex fx-grow pr-10 fxj-end">
                                <input-file icon="image" :multiple="true" @input="addImages" :disabled="images.length > 3" />
                            </div>
                            <div class="fx-no-shrink">
                                <button-base :modifiers="['s', 'light']" icon-before="paper-plane" type="submit" :loading="isLoading">
                                    Envoyer
                                </button-base>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </form>
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
        user () { return this.$store.getters['user/self'] },
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
            this.isFocused = false
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
    display: flex;

    &.is-focused {
        
        .Editor_main {
            padding: 5px 15px;
            background: var(--color-bg-weak);
            @include shadow-xs;
        }
    }
}

.Editor_first {
    display: flex;
    align-items: flex-start;
}

.Editor_main {
    padding: 0px 15px;
    background: var(--color-bg-strong);
    border-radius: 5px;
    flex-grow: 1;
}

.Editor_secondary {
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 10px 0 5px 0;
}

.Editor_input {
    background-color: transparent;
    flex-grow: 1;
    margin-left: -10px;
}

@include breakpoint-xs {

}
</style>