<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <p class="ft-title-s">Hey {{ user.name }} !</p>

        <form @submit.prevent="onSubmit" class="mt-40 block">
            <div class="d-flex mt-5 d-block@xs">
                <input-base label="Ton vrai prénom" v-model="formData.name" :attrs="{ required: true }" />

                <input-toggle class="fx-no-shrink ml-10 ml-0@xs mt-10@xs" label="Utiliser un pseudo" :value="isPseudo" @input="onTogglePseudo"/>
            </div>

            <div class="ft-m p-20 br-s bg-bg strong mt-20" v-if="isPseudo">
                <input-base class="mb-10" label="Ton pseudonyme" v-model="formData.alias" :attrs="{ placeholder: 'Capitaine Patate' }" />

                Ce pseudonyme remplace ton prénom pour les personnes que tu n'as encore pas rencontrées en vrai. 
            </div>

            <input-date class="mt-20" label="Ta date de naissance" v-model="formData.birthdate" :attrs="{ required: true, max: $moment().subtract(17, 'years').format('YYYY-MM-DD'), min: $moment().subtract(99, 'years').format('YYYY-MM-DD') }" />

            <p class="ft-s color-ft-weak mt-10">
                <fa icon="fas fa-lock" class="mr-3" /> Ta date de naissance reste privée.
            </p>

            <div class="fx-center mt-30 fx-reverse@s">
                <div class="text-right mr-20 mr-0@s mt-10@s">
                    <p class="ft-s" v-if="isSuccess">Les modifications ont été enregistrées.</p>
                </div>

                <button-base :modifiers="['light']" :loading="isLoading">
                    Modifier mes informations
                </button-base>
            </div>
        </form>

        <div class="text-center mt-20 mt-0@s">
            <link-base :to="{ name: 'compte-logout' }">
                Se déconnecter
            </link-base>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'AccountPage',
    components: { InputBase },
    middleware: 'loggedUser',
    data: () => ({
        isLoading: false,
        isPseudo: false,
        isSuccess: false,
        formData: {
            name: '',
            alias: '',
            birthdate: '1995-09-24',
        }
    }),
    computed: {  
        user () { return this.$store.getters['user/self'] },
    },
    watch: {
        user: {
            immediate: true,
            handler (v) {
                this.formData.name = v.name
                this.formData.birthdate = v.birthdate
                
                if (v.alias) {
                    this.formData.alias = v.alias
                    this.isPseudo = true
                }
            }
        }
    },
    methods: {
        onTogglePseudo (v) {
            this.isPseudo = v

            if (!v) this.formData.alias = ''
        },
        async onSubmit () {
            this.isLoading = true
            this.isSuccess = false
            
            try {
                let data = this.formData

                await this.$store.dispatch('user/update', data)
                
                this.isSuccess = true
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>