<template>
    <form @submit.prevent="onSubmit" class="ProfileEdit">
        <div>
            <p class="ft-title-m">Photo de profil</p>
            <p class="mt-10">Ta photo de profil sera uniquement visible par les personnes que tu as croisé lors d'un événement.</p>
            
            <div class="row-s text-center mt-20">
                <div class="col-6">
                    <p class="ft-l-bold text-upper ft-italic mb-20">Avant de t'avoir rencontré</p>
                    
                    <user-icon class="" :no-link="true" :modifiers="['2xl']" v-bind="user" />
                </div>
                <div class="col-6">
                    <p class="ft-l-bold text-upper ft-italic mb-20">Après t'avoir rencontré</p>

                    <user-icon class="" :no-link="true" :modifiers="['2xl']" v-bind="user" :picture-src="picture" />

                    <input-file class="mt-20" v-model="formData.picture" />
                </div>
            </div>
        </div>

        <div class="text-right mt-30 pt-30 b-top">
            <button-base :modifiers="['light']">
                Sauvegarder les changements
            </button-base>
        </div>
    </form>
</template>

<script>
export default {
    name: 'ProfileEdit',
    data: () => ({
        formData: {}
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        newPicture () {
            return false
            return this.formData.picture !== this.user.picture
         },
        picture () {
            return this.user.profileLarge
            return this.newPicture ? URL.createObjectURL(this.formData.picture) : this.user.profileLarge
        }
    },
    watch: {
        user: {
            immediate: true,
            deep: true,
            handler (v) {
                this.formData = {
                    ...this.formData,
                    ...this.user
                }
            }
        }
    },
    methods: {
        async onSubmit () {
            if (this.formData.picture) {
                let result = await this.$store.dispatch('library/create', {
                    file: this.formData.picture,
                    size: 'profile',
                    path: '$user'
                })

                this.formData.picture = result._id
            }
            
            await this.$store.dispatch('user/update', this.formData)
        }
    }
}
</script>

<style>

</style>