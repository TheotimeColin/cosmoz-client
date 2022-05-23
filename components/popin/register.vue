<template>
    <popin :is-active="isActive" :modifiers="['s']" @close="$store.commit('page/register', null)">
        <template slot="content">
            <div :class="{ 'p-30': !isSuccess }">
                <template v-if="isSuccess">
                    <div class="p-30 text-center">
                        <div class="ft-title-m">
                            <span>C'est bien noté !</span>
                        </div>
                    
                        <p class="mt-20" v-if="referral">Génial, tu feras partie de la constellation de {{ referral.name }} lorsqu'elle sera prête.</p>
                        <p class="mt-20" v-else>Merci pour ton intérêt, on a hâte que tu puisses enfin créer la constellation qui te comblera ✨</p>

                        <p class="ft-title-2xs mt-30">Place dans la liste d'attente : {{ Math.round(users.length * 1.5) }}.</p>

                        <div class="p-20 bg-bg-strong br-s mt-30">
                            <p v-if="referral">
                                Tu peux à ton tour inviter tes amis à rejoindre ta propre constellation !
                            </p>
                            <p v-else>
                                Invite dès maintenant tes amis à rejoindre ta constellation et montez ensemble dans la liste d'attente :
                            </p>

                            <div class="mt-15">
                                <p class="mt-20 ph-10 pv-5 bg-bg-xstrong">{{ referralLink }}</p>

                                <button-base :modifiers="['xs', 'light']" icon-before="paper-plane" @click="onShare" class="mt-10" v-if="shareLink">
                                Partager</button-base>

                            </div>
                        </div>

                        <link-base class="mt-20" @click="$store.commit('page/register', null)">
                            Fermer
                        </link-base>
                    </div>
                </template>
                <template v-else>
                    <template v-if="referral">
                        <p class="ft-title-m">
                            {{ referral.name }} t'as invité dans sa constellation
                        </p>

                        <p class="mt-10">Tu dois sûrement faire partie de son groupe d'amis préférés ! 😎 Cosmoz, c'est le réseau vraiment social pour les groupes d'amis.</p>
                    </template>
                    <template v-else>
                        <p class="ft-title-m">
                            Ah zut, il n'y plus de place dans le Cosmoz pour le moment.
                        </p>

                        <p class="mt-10">On ouvre progressivement nos constellations. <b>Entre dès aujourd'hui dans notre liste d'attente</b> et on te recontactera vite.</p>
                    </template>

                    <form class="strong mt-20" @submit.prevent="onSubmit">
                        <input-base label="Ton prénom" v-model="formData.name" :attrs="{ required: true }" />

                        <input-base label="Ton adresse e-mail" type="email" class="mt-10" v-model="formData.email" :attrs="{ required: true }" />

                        <form-errors :items="errors" class="mt-20" v-if="errors.length > 0" />

                        <div class="text-right mt-20">
                            <button-base :modifiers="['light']">
                                {{ referral ? `Rejoindre ${referral.name}` : `Entrer en liste d'attente` }}
                            </button-base>
                        </div>
                    </form>
                </template>
            </div>
        </template>
    </popin>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import socials from '@/assets/img/social/banner_1.gif'

export default {
    name: 'RegisterPopin',
    components: { InputBase },
    async fetch () {
        await this.$store.dispatch('user/fetch')
    },
    data: () => ({
        assets: { socials },
        errors: [],
        isSuccess: false,
        formData: {
            name: '',
            email: '',
            referral: ''
        }
    }),
    computed: {
        isActive () {
            return this.$store.state.page.popins.register ? true : false
        },
        referralLink () {
            return this.$config.baseUrl + `?r=${this.formData.email}`
        },
        shareLink () {
            return window && window.navigator.share ? {
                title: `Rejoins ma constellation sur Cosmoz`,
                text: 'Je crée notre réseau social privé pour organiser facilement nos sorties.',
                url: this.referralLink,
            } : null
        },
        users () {
            return this.$store.getters['user/find']()
        },
        referral () {
            return this.$route.query.r ? this.$store.getters['user/findOne']({
                email: this.$route.query.r
            }) : null
        }
    },
    methods: {
        onShare () {
            window.navigator.share(this.shareLink)
        },
        async onSubmit () {
            this.errors = []

            const token = await this.$recaptcha.execute('login')
            const response = await this.$store.dispatch('newsletter/subscribe', {
                ...this.formData,
                ref: this.$store.state.page.popins.register,
                referral: this.referral ? this.referral.email : '',
                token
            })

            if (response.status == 0) {
                this.errors = [ response.code ]
            } else {
                this.isSuccess = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .Insta {
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: cover;
        background-position: center;

        &::before {
            content: "";
            display: block;
            @include ratio(33.33);
        }
    }
</style>