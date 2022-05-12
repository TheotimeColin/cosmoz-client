<template>
    <div class="Editor">
        <user-icon class="fx-no-shrink" :modifiers="['l']" v-bind="user" />

        <div class="Editor_main">
            <input-area :placeholder="placeholder" v-model="formData.content" @focus="isFocused = true" @blur="() => setTimeout(() => isFocused = false, 100)" />

            <transition name="fade">
                <div class="Editor_secondary" v-show="isFocused">
                    <div class="fx-grow"></div>
                    <div>
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
        placeholder: { type: String }
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