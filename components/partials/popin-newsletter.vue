<template>
    <popin-base :modifiers="['absolute-header', 'm']" :is-active="isActive" @close="$emit('close')">
        <template slot="content">
            <div :class="{ 'p-30': !isSuccess }">
                <template v-if="isSuccess">
                    <div class="p-30 text-center">
                        <div class="ft-title-m">
                            <span>C'est bien noté !</span>
                        </div>
                    
                        <p class="mt-20">Merci pour ton intérêt, on a hâte que tu puisses trouver les constellations qui te correspondent.</p>

                        <button-base :modifiers="['light', 's']" class="mt-20" @click="$emit('close')">
                            Fermer
                        </button-base>
                    </div>
                        
                    <a href="https://www.instagram.com/gatheringsfr/" target="_blank" class="Insta" :style="{ backgroundImage: `url(${assets.socials})` }">
                        <span class="ft-title-xs tape">Passe nous voir sur Insta @gatheringsfr</span>
                    </a>
                </template>
                <template v-else>
                    <p class="ft-title-m">
                        Entrer sur la liste d'attente
                    </p>

                    <p class="mt-10">On ouvre progressivement nos constellations. Un peu de patience, on te recontactera vite !</p>

                    <form class="strong mt-20" @submit.prevent="onSubmit">
                        <div class="row-xs">
                            <div class="col-6 col-12@s">
                                <input-base label="Ton prénom" v-model="formData.name" :attrs="{ required: true }" />
                            </div>
                            <div class="col-6 col-12@s mt-10@s">
                                <input-base label="Ton adresse e-mail" type="email" v-model="formData.email" :attrs="{ required: true }" />
                            </div>
                        </div>

                        <errors :items="errors" class="mt-20" v-if="errors.length > 0" />

                        <div class="text-right mt-20">
                            <button-base :modifiers="['light']">
                                Je m'inscris
                            </button-base>
                        </div>
                    </form>
                </template>
            </div>
        </template>
    </popin-base>
</template>

<script>
const CATEGORIES = [
    { label: `chill`, id: 'chill', description: `Ambiances propices à la discussion`, background: 'https://images.unsplash.com/photo-1615705592748-029c989e6d5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80' },
    { label: `festif`, id: 'fiesta', description: `Ambiances animées & bonne musique`, background: 'https://images.unsplash.com/photo-1621295244949-580172382e4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80' },
    { label: `impact`, id: 'impact', description: `S'amuser & étendre son réseau pro`, background: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `insolite`, id: 'unique', description: `Lieux & expériences uniques`, background: 'https://images.unsplash.com/photo-1541356665065-22676f35dd40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    { label: `geek`, id: 'geek', description: `Jouer & partager ses passions`, background: 'https://images.unsplash.com/photo-1610337673044-720471f83677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80' },
    { label: `queer`, id: 'queer', description: `Safe-spaces pour la commu LGBTQ`, background: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `-35 ans`, id: 'young', description: `Comme son nom l'indique`, background: 'https://images.unsplash.com/photo-1644943054825-13b1e3f22d60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `girls only`, id: 'girls', description: `Rencontres entre filles uniquement`, background: 'https://images.unsplash.com/photo-1632905460027-abad5efa8798?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2129&q=80' },
    { label: `travellers`, id: 'world', description: `For locals & visitors, in english`, background: 'https://images.unsplash.com/photo-1530788446596-f1dfa729142f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80' },
]

import { InputBase, ToggleBase } from 'instant-coffee-core'
import socials from '@/assets/img/social/banner_1.gif'

export default {
    name: 'PopinNewsletter',
    components: { InputBase, ToggleBase },
    props: {
        isActive: { type: Boolean, default: false },
        origin: { type: String, default: 'unknown' }
    },
    data: () => ({
        assets: { socials },
        CATEGORIES,
        errors: [],
        isSuccess: false,
        formData: {
            name: '',
            email: '',
            categories: []
        }
    }),
    watch: {
        isActive (v) {
            if (v) this.$gtm.push({
                event: 'Newsletter',
                action: 'open'
            })
        }
    },
    methods: {
        toggleCategory (id, value) {
            if (value) {
                this.formData.categories = [ ...this.formData.categories, id ]
            } else {
                this.formData.categories = this.formData.categories.filter(c => c != id)
            }
        },
        async onSubmit () {
            this.errors = []

            const token = await this.$recaptcha.execute('login')
            const response = await this.$store.dispatch('newsletter/subscribe', {
                ...this.formData, ref: this.origin, token
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