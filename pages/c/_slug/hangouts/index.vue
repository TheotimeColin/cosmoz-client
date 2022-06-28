<template>
    <div class="Page_wrapper Wrapper Wrapper--xs" v-if="$constellation">
        <div class="block-cosmoz">
            <p class="ft-title-s mb-10">Bientôt disponible !</p>

            <p>Cosmoz est phase de développement, on te remercie déjà de tester la plateforme ! 🌞</p>

            <p class="ft-m-bold mt-10">Bientôt, tu pourras :</p>

            <ul class="ft-m-bold pl-30 mt-10">
                <li class="+mt-10">Ajouter tes envies et recommandations de sorties</li>
                <li class="+mt-10">Organiser en quelques clics une sortie avec les autres membres du groupe</li>
            </ul>
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch () {
        await this.$preFetch()

        await this.$store.dispatch('gathering/softFetch', this.$constellation.gatherings)
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    }
}
</script>