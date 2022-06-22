<template>
    <form @submit.prevent="onSubmit" class="ProfileEdit">
        <div class="ratio-15 bgi-cover" :style="{ backgroundImage: `url(${$bg.holo})` }"></div>

        <div class="p-30">
            <div class="d-flex fxa-center">
                <label class="c-pointer" for="profile-edit">
                    <user-icon :no-link="true" :modifiers="['2xl']" v-bind="user" :picture-src="picture" badge="pen" />
                </label>

                <div class="ml-30">
                    <p class="ft-title-s">Photo de profil</p>
                    <p class="mt-5">Ta photo de profil sera uniquement visible par les personnes que tu as croisé lors d'un événement.</p>

                    <div class="mt-15">
                        <button-base :modifiers="['s', 'cosmoz']" icon-before="image">
                            Choisir une image
                        </button-base>

                        <link-base class="ml-10" v-if="picture">
                            Retirer ma photo
                        </link-base>
                    </div>

                    <input-file class="mt-20" :no-label="true" id="profile-edit" v-model="newPicture" />
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
        formData: {},
        newPicture: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        picture () {
            return this.newPicture ? URL.createObjectURL(this.newPicture) : this.user.profileLarge
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
            let data = this.formData

            if (this.newPicture) {
                let result = await this.$store.dispatch('library/create', {
                    file: this.newPicture,
                    size: 'profile',
                    path: '$user'
                })

                data.picture = result._id
            }
            
            await this.$store.dispatch('user/update', data)
        }
    }
}
</script>

<style>

</style>