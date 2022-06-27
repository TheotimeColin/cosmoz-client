<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <form @submit.prevent="onSubmit" class="block">
            <div class="ft-m">
                <input-base class="mb-10" label="Ton nom d'utilisateur" v-model="formData.id" validator="userId" :required="true" prefix="@" />

                <p class="ft-s color-ft-weak mt-10">
                    <fa icon="fas fa-sparkles" class="mr-3" /> Un nom unique qui permet de t'identifier facilement.
                </p>
            </div>

            <input-date class="mt-30" label="Ta date de naissance" v-model="formData.birthdate" :required="true" />

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
export default {
    name: 'AccountPage',
    layout: 'app',
    middleware: 'loggedUser',
    data: () => ({
        isLoading: false,
        isPseudo: false,
        isSuccess: false,
        formData: {
            id: '',
            birthdate: '1995-09-24',
        }
    }),
    computed: {  
        
    },
    watch: {
        user: {
            immediate: true,
            handler (v) {
                this.formData.birthdate = v.birthdate
                this.formData.id = v.id
            }
        }
    },
    methods: {
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