<template>
    <div>
        <div class="mb-30">
            <p class="ft-title-m">
                {{ formType == 'register' ? `Créer mon compte Cosmoz` : `Se connecter` }}
            </p>
            
            <slot name="description"></slot>
        </div>

        <div v-show="hasGoogle">
            <div class="d-flex fxj-center">
                <div ref="google"></div>
            </div>

            <div class="fx-center ft-title-xs mv-20">
                <hr class="Separator fx-grow mr-10">
                OU
                <hr class="Separator fx-grow ml-10">
            </div>
        </div>

        <form @submit.prevent="() => onSubmit()">
            <input-base
                label="Ton prénom"
                class="mb-10"
                :attrs="{ required: true }"
                v-model="formData.name"
                v-if="formType == 'register'"
            />

            <input-base
                label="Ton adresse e-mail"
                type="email"
                class="mb-10"
                :attrs="{ autocomplete: 'email', required: true }"
                v-model="formData.email"
            />

            <input-base
                label="Choisis un mot de passe"
                type="password"
                :helpers="['reveal']"
                :validator="$validator('password')"
                :attrs="{ required: true, autocomplete: 'password' }"
                v-model="formData.password"
            />

            <form-errors :items="errors" class="mt-20" />

            <div class="fx-center mt-20">
                <div class="mr-20 text-left">
                    <link-base @click="formType = 'login'" v-if="formType == 'register'">Me connecter</link-base>

                    <link-base @click="formType = 'register'" v-if="formType == 'login'">Créer un compte</link-base>

                    <template v-if="formType == 'login'">
                         · 
                        <link-base @click="isReset = true">Mot de passe oublié ?</link-base>
                    </template>
                </div>
                
                <button-base type="submit" :modifiers="['light']" :loading="isLoading" v-if="!noSubmit">
                    {{ formType == 'register' ? `Créer mon compte` : `Se connecter` }}
                </button-base>
            </div>
        </form>

        <popin :modifiers="['s', 'absolute-header']" :is-active="isReset" @close="isReset = false" v-show="isReset">
            <template slot="content">
                <form @submit.prevent="resetPassword" class="p-30">
                    <p class="ft-title-2xs">Réinitialiser mon mot de passe</p>
                    
                    <input-base label="Ton adresse e-mail" class="mv-20" type="email" v-model="formData.email" :attrs="{ required: true }" v-show="!resetSuccess" />

                    <form-errors :items="resetErrors" class="mb-20" />

                    <p class="ft-m mv-20" v-show="resetSuccess">Je viens de t'envoyer un e-mail. N'oublie pas de vérifier dans tes spams !</p>

                    <div class="text-right">
                        <button-base :modifiers="['light']" :class="{ 'is-disabled': resetSuccess }">Envoyer un email</button-base>
                    </div>
                </form>
            </template>
        </popin>
    </div>
</template>

<script>

import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'RegisterForm',
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        type: { type: String },
        redirect: { type: Boolean, default: true },
        reference: { type: String, default: 'unknown' },
        noSubmit: { type: Boolean, default: false },
        initialData: { type: Object, default: () => ({}) }
    },
    data: () => ({
        formType: 'register',
        state: {
            success: false,
            loading: false,
        },
        isLoading: false,
        isReset: false,
        resetSuccess: false,
        errors: [],
        resetErrors: [],
        hasGoogle: false,
        formData: {
            email: '',
            name: '',
            password: ''
        }
    }),
    watch: {
        type: {
            immediate: true,
            handler (v) {
                if (v) this.formType = v
            }
        }
    },
    mounted () {
        if (process.server && !window.google) return

        window.google.accounts.id.initialize({
            client_id: "322716061919-7io9tjlk3pbfqrl9akdrq03q5rqk3kdc.apps.googleusercontent.com",
            callback: this.onSubmit
        })

        window.google.accounts.id.renderButton(this.$refs.google, {
            theme: "outline",
            text: 'continue_with',
            shape: 'pill',
            width: 250,
            size: "large",
            logo_alignment: 'center'
        })

        this.hasGoogle = true
        // window.google.accounts.id.prompt()
    },
    methods: {
        async resetPassword () {
            this.resetErrors = []

            const response = await this.$store.dispatch('user/requestPassword', this.formData.email)

            if (response.status == 0) {
                this.resetErrors = [ response.error ]
            } else {
                this.resetSuccess = true
            }
        },
        async onSubmit (googleCred = null) {
            try {
                this.errors = []
                this.isLoading = true

                const token = await this.$recaptcha.execute('login')

                console.log(token)

                const response = await this.$auth.loginWith('local', { 
                    data: {
                        ...(googleCred ? googleCred : this.formData),
                        ref: this.reference,
                        token, type: this.formType
                    }
                })

                console.log(response)

                if (response.data.status != 1) {
                    this.errors = response.data.errors
                    this.isLoading = false
                } else {
                    if (this.redirect) window.location = this.localePath({ name: 'feed' })

                    this.$emit('success')
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>