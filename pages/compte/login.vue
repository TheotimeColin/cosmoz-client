<template>
    <div class="o-hidden">
        <div class="Wrapper Wrapper--m pv-100">
            <div class="p-30 br-m max-width-m m-auto bg-bg-xstrong br-s">
                <p class="ft-title-s">Se connecter</p>

                <form @submit.prevent="submitForm('login')" class="strong mt-20">
                    <input-base label="Ton adresse e-mail" class="mb-10" :attrs="{ required: true }" v-model="loginForm.email" type="email" />

                    <input-base label="Mot de passe" class="mb-10" type="password" :helpers="['reveal']" v-model="loginForm.password" />

                    <form-errors :items="loginErrors" />

                    <div class="text-right mt-10 text-center@xs fx-reverse@xs mt-15@xs">
                        <link-base class="mr-5 mr-0@xs mt-10@xs" @click="isReset = true" type="button">Mot de passe oublié ?</link-base>

                        <button-base type="submit" :modifiers="['secondary']" :class="{ 'is-loading': state.isSuccess || state.loading }">
                            Je me connecte
                        </button-base>
                    </div>
                </form>
            </div>
            
            <div class="p-30 br-m max-width-m m-auto bg-bg-xstrong mt-30" v-if="$route.query.token == 'supersecret'">
                <p class="ft-title-s">Créer mon profil</p>
                <register-form />
            </div>
            <div class="p-30 br-m max-width-m m-auto bg-bg-xstrong br-s mt-30" v-else>
                <p class="ft-title-s">Pas encore de compte ?</p>
                <p class="ft-l mt-20">On invite régulièrement de nouvelles personnes à rejoindre le réseau. Entre dans notre liste d'attente et reçois ton invitation gratuitement.</p>

                <button-base :modifiers="['light']" class="mt-20" @click="isNewsletter = true">
                    Entrer sur la liste
                </button-base>
            </div>
        </div>
        
        <popin-newsletter :is-active="isNewsletter" origin="login" @close="isNewsletter = false" />

        <popin :modifiers="['s', 'absolute-header']" :is-active="isReset" @close="isReset = false">
            <template slot="content">
                <form @submit.prevent="resetPassword" class="p-30">
                    <p class="ft-title-2xs">Réinitialiser ton mot de passe</p>
                    
                    <input-base label="Ton adresse e-mail" class="mv-20" type="email" v-model="loginForm.email" :attrs="{ required: true }" v-show="!resetSuccess" />

                    <form-errors :items="resetErrors" class="mb-20" />

                    <p class="ft-m mv-20" v-show="resetSuccess">Je viens de t'envoyer un e-mail. N'oublie pas de vérifier dans tes spams !</p>

                    <div class="text-right">
                        <button-base :class="{ 'is-disabled': resetSuccess }">Envoyer un email</button-base>
                    </div>
                </form>
            </template>
        </popin>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'LoginPage',
    components: { InputBase, SelectBase },
    layout: 'default',
    middleware: 'notLoggedIn',
    data: () => ({
        isReset: false,
        resetSuccess: false,
        isNewsletter: false,
        state: {
            isSuccess: false,
            loading: false
        },
        resetErrors: [],
        loginErrors: [],
        loginForm: {
            email: '',
            password: ''
        },
        registerErrors: [],
        registerForm: {}
    }),
    methods: {
        updateForm (v) {
            this.registerForm = {
                ...this.registerForm,
                ...v
            }
        },
        async resetPassword () {
            this.resetErrors = []

            const response = await this.$store.dispatch('user/requestPassword', this.loginForm.email)

            if (response.status == 0) {
                this.resetErrors = [ response.error ]
            } else {
                this.resetSuccess = true
            }
        },
        async submitForm (type) {
            this.loginErrors = []
            this.registerErrors = []
            this.state.loading = true

            try {
                const token = await this.$recaptcha.execute('login')
                const response = await this.$auth.loginWith('local', { 
                    data: { ...(type == 'register' ? this.registerForm : this.loginForm), token, type }
                })

                if (response.data.status != 1) {
                    if (type == 'login') {
                        this.loginErrors = response.data.errors
                    } else {
                        this.registerErrors = response.data.errors
                    }
                } else {
                    this.$router.push(this.localePath({ name: 'feed' }))
                }
            } catch (e) {
                console.log(e)
            }

            this.state.loading = false
        }
    }
}
</script>

<style>

</style>