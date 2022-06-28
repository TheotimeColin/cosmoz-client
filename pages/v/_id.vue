<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <div v-if="isLoading">
            <placeholder :ratio="45" />
        </div>
        <div v-else-if="!gathering">
            <div class="bg-bg-weak p-20 br-s mt-10">
                Il semblerait que cette rencontre n'existe pas. Pas de panique, l'organisateur pourra confirmer ta présence plus tard.
            </div>
        </div>
        <div v-else-if="isAttending">
            <div class="block-cosmoz text-center">
                <p class="ft-l-medium">Ta présence à été confirmée ! Profite du moment. 🔥</p>

                <div class="mt-20">
                    <button-base :modifiers="['cosmoz']" icon-before="sparkles" :to="{ name: 'c-slug-events-eventId', params: { slug: constellation.slug, eventId: gathering.id }}">
                        Friendly matching
                    </button-base>
                    <br>
                    <button-base class="mt-10" :modifiers="['light', 's']" :ellipsis="30" :image="constellation.logoSmall" :text="`${constellation.name}`" :to="{ name: 'c-slug', params: { slug: constellation.slug }}" />
                </div>
            </div>
            
        </div>
        <div v-else>
            <div class="+mt-20 block-cosmoz pt-20 pb-0 ph-0">
                <slider-block :slots="['1', '2', '3']" :auto-height="true" :offset="20" :offset-v="20">
                    <div class="bg-bg-weak-t height-100 width-xs p-20 br-s d-flex fxa-center d-block@xs" :slot="1">
                        <fa icon="far fa-sparkles" class="mr-20 mb-10@xs" size="xl"></fa>
                        <div>
                            <p class="ft-title-xs mb-5">Friendly matching</p>
                            <p>Garde le contact avec les personnes que tu as appréciées, si l'intérêt est réciproque.</p>
                        </div>
                    </div>
                    <div class="bg-bg-weak-t height-100 width-xs p-20 br-s d-flex fxa-center d-block@xs" :slot="2">
                        <fa icon="far fa-images" class="mr-20 mb-10@xs" size="xl"></fa>
                        <div>
                            <p class="ft-title-xs mb-5">Partage sécurisé</p>
                            <p>Publie des messages et des photos uniquement pour les personnes présentes à l'événement.</p>
                        </div>
                    </div>
                    <div class="bg-bg-weak-t height-100 width-xs p-20 br-s d-flex fxa-center d-block@xs" :slot="3">
                        <fa icon="far fa-hand-wave" class="mr-20 mb-10@xs" size="xl"></fa>
                        
                        <div>
                            <p class="ft-title-xs mb-5">Rejoins la communauté</p>
                            <p>Rejoins {{ this.constellation.name ? this.constellation.name : 'le groupe' }}, participe aux prochains événements, propose tes sorties.</p>
                        </div>
                    </div>
                </slider-block>
            </div>

            <div class="+mt-20 bg-bg-weak p-20 br-s" v-if="!user">
                <register-form :title="false" :redirect="false" />
            </div>

            <div class="+mt-20 bg-bg-weak p-20 br-s" v-else>
                <div class="text-center">
                    Clique ci-dessous pour accèder aux fonctionnalités réservées aux participants
                    
                    <div class="mt-20">
                        <button-base :modifiers="['cosmoz']" :loading="isStatusLoading" @click="onManageSubmit">
                            Confirmer ma présence
                        </button-base>
                    </div>
                </div>

                <block-gathering class="mt-20" :no-link="true" :const-only="true" :status-only="true" v-bind="gathering" />
            </div>

            <div class="text-center p-relative mt-20">
                <button-base :modifiers="['s']" :image="user.profileSmall" :ellipsis="20" :text="user.name" icon-after="times" @click="$store.dispatch('user/logOut')"  v-if="user" />
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

        await this.$store.dispatch('gathering/get', { query: { _id: this.$route.params.id, status: 'active' }})

        if (this.gathering) {
            await this.$store.dispatch('constellation/get', { query: { _id: this.gathering.constellation }})
        }

        this.isLoading = false 
    },
    data: () => ({
        isStatusLoading: false,
        isLoading: true
    }),
    computed: {
        
        isAttending () {
            if (!this.user) return false

            return this.gathering && this.gathering.users.find(u => u._id == this.user._id && ['confirmed', 'attending'].includes(u.status)) ? true : false
        },
        constellation () {
            return this.gathering ? this.$store.getters['constellation/findOne']({
                _id: this.gathering.constellation
            }) : null
        },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                _id: this.$route.params.id,
                status: 'active'
            })
        }
    },
    methods: {
        async onManageSubmit () {
            this.isStatusLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: [
                        { _id: this.user._id, status: 'confirmed', add: true }
                    ]
                })
            } catch (e) {
                console.error(e)
            }

            setTimeout(() => this.isStatusLoading = false, 1000)
        }
    },
    head () {
        let meta = {
            title: `Valider ma participation ${this.$t('meta.append')}`
        }

        return meta
    }
}
</script>

<style>

</style>