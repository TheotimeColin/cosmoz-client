<template>
    <div>
        <div class="Wrapper Wrapper--xs pv-100 ft-l">
            <h1 class="ft-title-l mt-30 mb-10">Personnalisons un peu ton profil.</h1>

            <p>On a juste besoin de quelques infos pour te proposer des sorties qui peuvent te plaire.</p>

            <div class="mt-40 bg-bg p-20 br-s">
                <div class="d-flex mt-5">
                    <input-base label="Ton vrai prénom" v-model="formData.name" :attrs="{ required: true }" />

                    <input-toggle class="fx-no-shrink ml-10" label="Utiliser un pseudo" :value="isPseudo" @input="onTogglePseudo"/>
                </div>

                <div class="ft-m mt-15 p-20 br-s bg-bg-xstrong strong" v-if="isPseudo">
                    <input-base class="mb-10" label="Ton pseudonyme" v-model="formData.alias" :attrs="{ placeholder: 'Capitaine Patate' }" />

                    Ce pseudonyme remplace ton prénom pour les personnes que tu n'as encore pas rencontrées en vrai. 
                </div>

                <input-date class="mt-15" label="Ta date de naissance" v-model="formData.birthdate" :attrs="{ required: true, max: $moment().subtract(17, 'years').format('YYYY-MM-DD'), min: $moment().subtract(99, 'years').format('YYYY-MM-DD') }" />
                <p class="ft-s color-ft-weak mt-10">
                    <fa icon="fas fa-lock" class="mr-3" /> Ta date de naissance reste privée.</p>
            </div>

            <div class="mt-20 bg-bg p-20 br-s">
                <div class="d-flex fxa-center">
                    <user-icon class="" :no-link="true" :hide-picture="true" :modifiers="['xl']" v-bind="user" />

                    <fa icon="far fa-long-arrow-right" class="mh-15" />

                    <user-icon class="" :no-link="true" :modifiers="['xl']" v-bind="user" :picture-src="picture" />
                </div>
            
                <p class="ft-m mt-15"><fa icon="fas fa-lock" class="mr-3" /> Ta photo de profil est uniquement visible par les personnes que tu as rencontrées en vrai. Tu peux donc mettre une photo de ton visage en toute sécurité !</p>

                <input-file class="mt-20" v-model="newPicture" />
            </div>

            <div class="mt-20 p-20 bg-bg-xstrong text-right br-s">
                <button-base :modifiers="['light']" icon-after="arrow-right">
                    Continuer
                </button-base>
            </div>
        </div>

        <div class="p-relative bg-bg-2xstrong">
            <div id="faq" class="anchor"></div>

            <div class="Wrapper Wrapper--s pv-40 ft-l">
                <h2 class="ft-title-m mb-30">Un doute, une question ?</h2>
                <faq />
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'WelcomeProfile',
    components: { InputBase },
    data: () => ({
        isPseudo: false,
        newPicture: null,
        formData: {
            name: '',
            alias: '',
            birthdate: '1995-09-24',
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        picture () {
            return this.newPicture ? URL.createObjectURL(this.newPicture) : (this.user.profileLarge ? this.user.profileLarge : this.$bg.holo)
        }
    },
    mounted () {
        this.formData.name = this.user.name
    },
    methods: {
        onTogglePseudo (v) {
            console.log(v)
            this.isPseudo = v

            if (!v) this.formData.alias = ''
        },
        async onEnd () {
            await this.$store.dispatch('user/updateNotification', {
                id: 'welcomed',
                type: 'onboarding'
            })

            window.location = this.localePath({ name: 'feed' })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>