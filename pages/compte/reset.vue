<template>
    <div class="Page_wrapper Wrapper Wrapper--2xs">
        <div class="block-r">
            <p class="ft-title-xs">Créer un nouveau mot de passe</p>

            <div class="text-center" v-if="isSuccess">
                <p class="mv-20">Mot de passe modifié avec succès. Tu peux maintenant retenter de te connecter :</p>

                <button-base :to="{ name: 'compte-login' }">
                    Se connecter
                </button-base>
            </div>

            <form @submit.prevent="submitForm()" v-else>
                <input-base
                    label="Nouveau mot de passe" 
                    class="mv-20"
                    type="password"
                    :helpers="['reveal']"
                    validator="password"
                    :attrs="{ autocomplete: 'new-password' }"
                    v-model="formData.password"
                />

                <form-errors :items="errors" class="mb-20" />

                <div class="text-right">
                    <button-base type="submit" :modifiers="['light']" :disabled="!formData.password" :loading="isLoading">
                        Confirmer
                    </button-base>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResetPasswordPage',
    layout: 'default',
    middleware: 'loggedIn',
    data: () => ({
        isLoading: false,
        isSuccess: false,
        errors: [],
        formData: {
            password: '',
            token: ''
        }
    }),
    mounted () {
        if (!this.$route.query.token) this.$router.push(this.localePath({ name: 'compte-login' }))

        this.formData.token = this.$route.query.token
    },
    methods: {
        async submitForm () {
            this.isLoading = true

            try {
                const response = await this.$store.dispatch('user/resetPassword', this.formData)

                if (response.status == 0) {
                    this.errors = [ response.error ]
                } else {
                    this.isSuccess = true
                }
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style>

</style>