<template>
    <div class="Page" v-if="$constellation">
        <div class="bg-cover-100 ratio-15 ratio-35@xs" :style="{ '--background': `url(${$constellation.hero}` }"
            v-if="$constellation.hero"></div>

        <div class="Page_wrapper Wrapper Wrapper--xs">
            <h1 class="ft-title-xs mb-20">Conditions d'adhésion</h1>

            <!-- <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
                <div class="ft-title-m pr-20">
                    <fa icon="far fa-user-vneck-hair" />
                </div>
                <div class="fx-grow">
                    <p class="ft-title-2xs mb-3">Correspondre aux critères suivants :</p>
                    <p class="color-ft-weak">A entre 18 et 35 ans. S'identifie comme Femme.</p>
                </div>
                <div class="ml-20">
                    <span class="round bg-emerald">
                        <fa icon="far fa-check" />
                    </span>
                </div>
            </div> -->

            <!-- <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
                <div class="ft-title-m pr-20">
                    <fa icon="far fa-memo-circle-check" />
                </div>
                <div class="fx-grow">
                    <p class="ft-title-2xs mb-3">Accepter les conditions d'utilisation</p>
                    <p class="color-ft-weak">Accepter les conditions d'utilisation</p>
                </div>
                <div class="ml-20">
                    <span class="round bg-emerald">
                        <fa icon="far fa-check" />
                    </span>
                </div>
            </div> -->

            <!-- <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
                <div class="ft-title-m pr-20">
                    <fa icon="far fa-hand-wave" />
                </div>
                <div class="fx-grow">
                    <p class="ft-title-2xs mb-3">Avoir participé à une rencontre</p>
                    <p class="color-ft-weak">Ce groupe est reservé aux personnes qui ont participé à l'un de leurs événements.</p>
                </div>
                <div class="ml-20">
                    <span class="round bg-bg-strong">
                        <fa icon="far fa-times" />
                    </span>
                </div>
            </div> -->

            <!-- <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
                <div class="ft-title-m pr-20">
                    <fa icon="far fa-phone-plus" />
                </div>
                <div class="fx-grow">
                    <p class="ft-title-2xs mb-3">Avoir un numéro de téléphone vérifié</p>
                    <p class="color-ft-weak">C'est une sécurité supplémentaire, pour tous.</p>
                </div>
                <div class="ml-20">
                    <span class="round bg-emerald">
                        <fa icon="far fa-check" />
                    </span>
                </div>
            </div> -->

            <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
                <div class="ft-title-s pr-20">
                    <fa icon="far fa-magnifying-glass" />
                </div>
                <div class="fx-grow">
                    <p class="ft-title-2xs mb-3">Être validé par un organisateur</p>
                    <p class="ft-s color-ft-weak">Chaque nouveau membre est validé manuellement. Ça ne devrait pas être
                        long
                        !</p>
                </div>
            </div>

            <div class="mt-20 text-right text-center@s">
                <div>
                    <link-base class="mr-10 mr-0@s mb-10@s" @click="cancel" v-if="isPending">
                        Annuler
                    </link-base>
                    <button-base :modifiers="['light']" :disabled="true" icon-before="check" v-if="isPending">
                        Demande envoyée
                    </button-base>
                    <button-base :modifiers="['light']" @click="apply" :loading="isLoading" v-else>
                        Envoyer la demande
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    middleware: ['loggedUser'],
    async fetch() {
        await this.$preFetch()
    },
    transition (to, from) {
        if (to.name.includes('rejoindre')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        
        isPending () { return this.$constellation.followers.includes(this.user._id) }
    },
    methods: {
        async cancel () {
            this.isLoading = true

            await this.$store.dispatch('constellation/leave', this.$constellation._id)
            
            this.isLoading = false
        },
        async apply () {
            this.isLoading = true

            await this.$store.dispatch('constellation/apply', this.$constellation._id)
            
            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Page {
    background-color: var(--color-bg);
}
</style>