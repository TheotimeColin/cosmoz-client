<template>
    <div class="Wrapper Wrapper--xs pv-100 pv-30@xs">
        <div class="bg-bg p-20 br-s mb-10" v-if="user">
            <div class="fx-center">
                <user-icon :display-name="true" :no-link="true" :modifiers="['l']" v-bind="user">
                    <p class="color-ft-weak ft-s line-1">{{ user.email }}</p>
                </user-icon>

                <button-base :modifiers="['s', 'round', 'weak']" @click="$store.dispatch('user/logOut')" icon-before="arrow-right-from-bracket" v-if="$smallerThan('xs')" />
                <button-base :modifiers="['s']" @click="$store.dispatch('user/logOut')" v-else>
                    Se déconnecter
                </button-base>
            </div>
        </div>

        <div class="bg-bg p-20 br-s mb-10" v-else>
            <register-form :redirect="false">
                <template slot="description">
                    <p class="mt-10">Accède à des rencontres exclusives près de chez toi et garde le contact avec tes nouvelles rencontres !</p>
                </template>
            </register-form>
        </div>


        <div v-if="isLoading || !user">
            <placeholder :ratio="45" />
        </div>
        <div v-else-if="!gathering">
            <div class="bg-bg p-20 br-s mt-10">
                Il semblerait que cette rencontre n'existe pas. Pas de panique, l'organisateur pourra confirmer ta présence plus tard.
            </div>
        </div>
        <div v-else>
            <div class="bg-bg p-20 br-s mt-10">
                <div v-if="isAttending">
                    <div class="d-flex fxa-center" v-if="isStatusLoading">
                        <span class="round bg-bg-strong mr-10"><fa icon="far fa-spinner-third" class="spin" /></span> Un petit instant...
                    </div>
                    <div class="d-flex fxa-center" v-else>
                        <span class="round bg-bg-strong mr-10"><fa icon="far fa-check" /></span> Ta présence est bien validée. Tu peux maintenant profiter du moment et fermer cette page !
                    </div>
                </div>
                <div v-else>
                    On dirait que tu n'étais inscrit à la rencontre via Cosmoz. Aucun soucis, on ne t'en veux pas :

                    <div class="text-center mt-20">
                        <button-base :modifiers="['light']" :loading="isStatusLoading" @click="onManageSubmit">
                            M'inscrire et confirmer
                        </button-base>
                    </div>
                </div>

                <block-gathering class="mt-20" :no-link="true" :orga-only="true" :status-only="true" v-bind="gathering" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringValidate',
    layout: 'full',
    async fetch () {
        this.isLoading = true 

        await this.$store.dispatch('gathering/get', { query: { _id: this.$route.params.id }})

        this.isLoading = false 
    },
    data: () => ({
        isStatusLoading: false,
        isLoading: true
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isAttending () {
            if (!this.user) return false

            return this.gathering && this.gathering.users.find(u => u._id == this.user._id && ['confirmed', 'attending'].includes(u.status)) ? true : false
        },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                _id: this.$route.params.id
            })
        }
    },
    watch: {
        isAttending: {
            immediate: true,
            handler (v) {
                if (v) this.onManageSubmit()
            }
        } 
    },
    methods: {
        async onManageSubmit () {
            this.isStatusLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: [ { _id: this.user._id, status: 'confirmed' } ]
                })
            } catch (e) {
                console.error(e)
            }

            setTimeout(() => this.isStatusLoading = false, 1000)
        }
    },
    head () {
        let meta = {
            title: 'Valider ma participation'
        }

        return meta
    }
}
</script>

<style>

</style>