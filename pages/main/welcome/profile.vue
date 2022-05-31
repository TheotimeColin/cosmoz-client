<template>
    <div>
        <form @submit.prevent="onSubmit" class="Wrapper Wrapper--xs pv-100 ft-l pv-40@xs">
            <h1 class="ft-title-l mt-30 mb-10 mt-0@xs">Personnalisons un peu ton profil.</h1>

            <p>On a juste besoin de quelques infos pour te proposer des sorties qui peuvent te plaire.</p>

            <div class="mt-40 bg-bg-weak p-20 br-s">
                <div class="d-flex mt-5 d-block@xs">
                    <input-base label="Ton vrai prénom" v-model="formData.name" :attrs="{ required: true }" />

                    <input-toggle class="fx-no-shrink ml-10 ml-0@xs mt-10@xs" label="Utiliser un pseudo" :value="isPseudo" @input="onTogglePseudo"/>
                </div>

                <div class="ft-m mt-15 p-20 br-s bg-bg-xstrong strong" v-if="isPseudo">
                    <input-base class="mb-10" label="Ton pseudonyme" v-model="formData.alias" :attrs="{ placeholder: 'Capitaine Patate' }" />

                    Ce pseudonyme remplace ton prénom pour les personnes que tu n'as encore pas rencontrées en vrai. 
                </div>

                <input-date class="mt-15" label="Ta date de naissance" v-model="formData.birthdate" :attrs="{ required: true, max: $moment().subtract(17, 'years').format('YYYY-MM-DD'), min: $moment().subtract(99, 'years').format('YYYY-MM-DD') }" />
                <p class="ft-s color-ft-weak mt-10">
                    <fa icon="fas fa-lock" class="mr-3" /> Ta date de naissance reste privée.</p>
            </div>

            <div class="mt-20 bg-bg-weak p-20 br-s">
                <div class="d-flex fxa-center">
                    <user-icon :no-link="true" :hide-picture="true" :modifiers="['xl']" v-bind="user" />

                    <fa icon="far fa-long-arrow-right" class="mh-15" />

                    <user-icon :no-link="true" :modifiers="['xl']" v-bind="user" :picture-src="picture" />
                </div>
            
                <p class="ft-m mt-15"><fa icon="fas fa-lock" class="mr-3" /> Ta photo de profil est uniquement visible par les personnes que tu as rencontrées en vrai. Tu peux donc mettre une photo de ton visage en toute sécurité !</p>

                <input-file class="mt-20" v-model="newPicture" />
            </div>

            <div class="Footer mt-20 p-20 bg-bg-xstrong text-right br-s">
                <button-base :modifiers="['light']" icon-after="arrow-right" :loading="isLoading">
                    Continuer
                </button-base>
            </div>
        </form>

        <div class="p-relative bg-bg-2xstrong">
            <div id="faq" class="anchor"></div>

            <div class="Wrapper Wrapper--s pv-60 ft-l">
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
    middleware: ['loggedIn'],
    layout: 'full',
    components: { InputBase },
    data: () => ({
        isPseudo: false,
        isLoading: false,
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
        this.formData.birthdate = this.user.birthdate
        
        if (this.user.alias) {
            this.formData.alias = this.user.alias
            this.isPseudo = true
        }
    },
    methods: {
        onTogglePseudo (v) {
            this.isPseudo = v

            if (!v) this.formData.alias = ''
        },
        async onSubmit () {
            this.isLoading = true
            
            try {
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

                this.$router.push(this.localePath({ name: 'welcome-interests' }))
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
    @include breakpoint-xs {

        .Footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 15px;
            z-index: 10;
        }
    }
</style>