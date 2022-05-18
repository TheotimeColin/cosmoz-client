<template>
    <div>
        <form class="strong" @submit.prevent="onSubmit">
            <input-base
                label="Ton prénom"
                class="mb-10"
                :attrs="{ required: true }"
                v-model="formData.name"
            />

            <input-base
                label="Ton adresse e-mail"
                type="email"
                class="mb-10"
                :attrs="{ required: true, autocomplete: 'email', }"
                v-model="formData.email"
            />

            <input-base
                label="Choisis un mot de passe"
                type="password"
                :helpers="['reveal']"
                :validator="$validator('password')"
                :attrs="{ autocomplete: 'new-password' }"
                v-model="formData.password"
            />

            <form-errors :items="errors" class="mt-20" />

            <button-base type="submit" :modifiers="['light']" class="mt-20" :class="{ 'is-disabled': state.success || state.loading }" v-if="!noSubmit">
                {{ state.loading ? 'Une petite seconde...' : `Créer mon profil` }}
            </button-base>
        </form>
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
        initialData: { type: Object, default: () => ({}) }
    },
    data: () => ({
        state: {
            isActive: false,
            success: false,
            loading: false,
        },
        errors: [],
        formData: {
            email: '',
            name: '',
            password: ''
        }
    }),
    watch: {
        ['formData.email'] (v) {
            this.state.active = true
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
    },
    methods: {
        async onSubmit () {
            try {

                this.errors = []
                this.state.loading = true

                const token = await this.$recaptcha.execute('login')
                const response = await this.$auth.loginWith('local', { 
                    data: {
                        ...this.formData,
                        token,
                        type: 'register'
                    }
                })

                if (response.data.status != 1) {
                    this.errors = response.data.errors
                } else {
                    window.location = this.localePath({ name: 'feed' })
                }
            } catch (e) {
                console.log(e)
            }

            this.state.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
</style>