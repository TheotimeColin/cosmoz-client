<template>
    <popin :modifiers="['absolute-header', 'm']" :is-active="isActive" @close="$emit('close')">
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
                        On dirait qu'il n'y plus de place dans le Cosmoz pour le moment
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
                            <button-base :modifiers="['light']" :class="{ 'is-loading': isLoading }">
                                Je m'inscris
                            </button-base>
                        </div>
                    </form>
                </template>
            </div>
        </template>
    </popin>
</template>

<script>
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
        errors: [],
        isSuccess: false,
        isLoading: false,
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
            this.isLoading = true

            const token = await this.$recaptcha.execute('login')
            const response = await this.$store.dispatch('newsletter/subscribe', {
                ...this.formData, ref: this.origin, token
            })

            if (response.status == 0) {
                this.errors = [ response.code ]
            } else {
                this.isSuccess = true
            }
            
            this.isLoading = false
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