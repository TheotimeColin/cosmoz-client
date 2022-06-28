<template>
    <div class="Page_wrapper Wrapper Wrapper--m">
        <div class="p-30 br-m max-width-m m-auto bg-bg-weak br-s">
            <register-form type="login" />
        </div>
    </div>
</template>

<script>

export default {
    name: 'LoginPage',
    middleware: 'notLoggedIn',
    data: () => ({
        isReset: false,
        resetSuccess: false,
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