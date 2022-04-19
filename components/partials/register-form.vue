<template>
    <div>
        <component :is="noSubmit ? 'div' : 'form'" @submit.prevent="onSubmit">
            <input-base
                label="Ton adresse e-mail"
                class="mb-10"
                :attrs="{ required: true, autocomplete: 'email', }"
                v-model="formData.email" type="email"
                v-if="!aboutOnly"
            />

            <input-base
                label="Ton prénom"
                v-model="formData.name"
                class="mb-10"
                type="text"
                :attrs="{ required: true }"
                v-if="!aboutOnly"
            />

            <input-base
                label="Choisis un mot de passe"
                type="password"
                :helpers="['reveal']"
                :validator="$validator('password')"
                :attrs="{ autocomplete: 'new-password' }"
                v-model="formData.password"
                v-if="!aboutOnly"
            />

            <button-base type="submit" :icon-before="state.loading ? '' : 'party-horn'" :class="{ 'is-disabled': state.isSuccess || state.loading }" v-if="!noSubmit">
                {{ state.loading ? 'Une petite seconde...' : (state.isSuccess ? `C'est tout bon !` : `Je m'abonne`) }}
            </button-base>
        </component>
    </div>
</template>

<script>

import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'RegisterForm',
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        type: { type: String },
        noSubmit: { type: Boolean, default: false },
        aboutOnly: { type: Boolean, default: false },
        initialData: { type: Object, default: () => ({}) }
    },
    data: () => ({
        state: {
            isActive: false,
            isSuccess: false,
            isLoading: false,
            errors: []
        },
        formData: {
            email: '',
            name: '',
            password: ''
        }
    }),
    watch: {
        ['formData.email'] (v) {
            this.state.isActive = true
        },
        formData: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$emit('formChange', this.formData)
            }
        },
        initialData: {
            immediate: true,
            handler (v) {
                this.formData = {
                    ...this.formData,
                    ...v
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>