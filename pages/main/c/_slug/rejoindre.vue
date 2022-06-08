<template>
    <div class="Page_wrapper Wrapper Wrapper--s">
        <h1 class="ft-title-s mb-20">Conditions d'adhésion</h1>

        <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
            <div class="ft-title-m pr-20">
                <fa icon="far fa-user-vneck-hair" />
            </div>
            <div class="fx-grow">
                <p class="ft-title-2xs mb-3">Correspondre aux critères suivants :</p>
                <p class="color-ft-weak">A entre 18 et 35 ans. S'identifie comme Femme.</p>
            </div>
            <!-- <div class="ml-20">
                <span class="round bg-emerald">
                    <fa icon="far fa-check" />
                </span>
            </div> -->
        </div>

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

        <div class="fx-center pv-15 ph-20 bg-bg-weak br-xs mt-10">
            <div class="ft-title-m pr-20">
                <fa icon="far fa-hand-wave" />
            </div>
            <div class="fx-grow">
                <p class="ft-title-2xs mb-3">Avoir participé à une rencontre</p>
                <p class="color-ft-weak">Ce groupe est reservé aux personnes qui ont participé à l'un de leurs événements.</p>
            </div>
            <!-- <div class="ml-20">
                <span class="round bg-bg-strong">
                    <fa icon="far fa-times" />
                </span>
            </div> -->
        </div>

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
            <div class="ft-title-m pr-20">
                <fa icon="far fa-magnifying-glass" />
            </div>
            <div class="fx-grow">
                <p class="ft-title-2xs mb-3">Être validé par un organisateur</p>
                <p class="color-ft-weak">Chaque nouveau membre est validé manuellement. Ça ne devrait pas être long !</p>
            </div>
            <div class="ml-20">
                <span class="round bg-bg-strong">
                    <fa icon="far fa-spinner-third" class="spin" />
                </span>
            </div>
        </div>

        <div class="mt-20 fx-center">
            <div></div>
            <div>
                <link-base class="mr-10" @click="cancel" v-if="isPending">
                    Annuler ma demande
                </link-base>
                <button-base :modifiers="['light']" :disabled="true" v-if="isPending">
                    En attente d'approbation
                </button-base>
                <button-base :modifiers="['light']" @click="apply" :loading="isLoading" v-else>
                    Envoyer la demande
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isPending () { return this.constellation.followers.includes(this.user._id) }
    },
    methods: {
        async cancel () {
            this.isLoading = true

            await this.$store.dispatch('constellation/leave', this.constellation._id)
            
            this.isLoading = false
        },
        async apply () {
            this.isLoading = true

            await this.$store.dispatch('constellation/apply', this.constellation._id)
            
            this.isLoading = false
        }
    },
    head () {
        this.$store.commit('page/set', { subtitle: 'Rejoindre ' + this.constellation.name, fa: 'sparkles' })
        this.$emit('page', { subtitle: 'Rejoindre ' + this.constellation.name, fa: 'sparkles' })

        let meta = {
            title: `${this.constellation.name} organise ses événements sur Cosmoz ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>