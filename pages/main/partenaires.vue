<template>
    <div class="Partners">
        <div class="bg-cover bg-plastic-black">
            <div class="Wrapper pv-40">
                <div class="row fx-align-center">
                    <div class="col-7 col-12@s">
                        <h1 class="ft-title-l mb-20 ft-title-l@s">Recherche lieux exceptionnels,<br>pour rencontres exceptionnelles.</h1>

                        <p class="ft-l">Nous rassemblons les meilleurs bars, restaurants & activités pour y accueillir nos Gatherings.</p>
                    </div>
                    <div class="col-5 col-12@s text-center text-left@xs">
                        <span class="ft-title-s tape tape-strong mv-3 d-none@xs mt-20@s">remplis tes tables</span><br>
                        <span class="ft-title-s tape tape-strong mv-3 d-none@xs">fais découvrir ton lieu</span>
                        <br class="d-none@xs">
                        <span class="ft-title-s tape mv-3 d-none@xs">participe à une super expérience</span>
                        <br class="d-none@xs">

                        <button-base tag="a" href="https://calendly.com/gatheringsfr/partenariats" target="_blank" :modifiers="['light']" class="mt-20 mt-0@xs">
                            On en discute ?
                        </button-base>
                    </div>
                </div>
            </div>
        </div>

        <div class="ft-l">
            <div class="Wrapper pv-40">
                <div class="row">
                    <div class="col-4 col-6@s col-12@xs mb-30@xs">
                        <h2 class="ft-title-s tape tape-strong mb-10">réservations assurées</h2>
                        <p><b>Nous réservons par tables de 4 personnes.</b> Elles découvrent ton lieu et en parlent autour d'elles.</p>
                    </div>
                    <div class="col-4 col-6@s col-12@xs mb-30@xs">
                        <h2 class="ft-title-s tape tape-strong mb-10">sans commission</h2>
                        <p><b>Tu offres la première consommation</b>, mais chaque personne va probablement consommer plus sur place.</p>
                    </div>
                    <div class="col-4 col-6@s col-12@xs">
                        <h2 class="ft-title-s tape tape-strong mb-10">100% flexible</h2>
                        <p><b>C'est toi qui choisis tes créneaux de réservation :</b> on remplit tes tables quand c'est calme pour toi.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-cover bg-plastic-black text-center">
            <div class="Wrapper Wrapper--s pv-20 ft-title-xs">
                <div class="tape tape-strong mv-3">
                    bars
                </div>
                <div class="tape tape-strong mv-3">
                    restaurants
                </div>
                <div class="tape tape-strong mv-3">
                    escape games
                </div>
                <div class="tape tape-strong mv-3">
                    cafés
                </div>
                <div class="tape tape-strong mv-3">
                    tiers-lieux
                </div>
                <div class="tape tape-strong mv-3">
                    bowlings
                </div>
                <div class="tape tape-strong mv-3">
                    food-courts
                </div>
                <div class="tape tape-strong mv-3">
                    lieux culturels
                </div>
                <div class="tape tape-strong mv-3">
                    coworkings
                </div>
                <div class="tape tape-strong mv-3">
                    aventures
                </div>
                <div class="tape tape-strong mv-3">
                    hôtels
                </div>
                <div class="tape mv-3">
                    ...et tout le reste
                </div>
            </div>
        </div>

        <div class="bg-bg-strong">
            <div class="Wrapper pv-40">
                <h2 class="ft-title-l max-width-m mb-30">Concrètement,<br>comment ça marche ?</h2>

                <div class="row-no-gutters">
                    <div class="col-4 bg-cover bg-plastic-black col-12@s mb-15@s">
                        <div class="p-20">
                            <h3 class="ft-xl-bold mb-10 text-upper"><i>1. Prise de réservation</i></h3>
                            <p><b>Nous te contactons au moins 1 semaine à l'avance</b> pour te réserver de 1 à 3 tables de 4 personnes. On s'arrange pour trouver les meilleurs créneaux.</p>
                        </div>
                    </div>
                    <div class="col-4 bg-cover bg-aluminium col-12@s mb-15@s">
                        <div class="p-20">
                            <h3 class="ft-xl-bold mb-10 text-upper mb-10"><i>2. Préparation des tables</i></h3>
                            <p>Sur chaque table réservée, <b>une pochette Gatherings à placer :</b> elle contient des goodies et des instructions pour les participants.</p>
                        </div>
                    </div>
                    <div class="col-4 bg-cover bg-holo col-12@s">
                        <div class="p-20">
                            <h3 class="ft-xl-bold mb-10 text-upper mb-10"><i>3. Arrivée des participants</i></h3>
                            <p>Les personnes arrivent au compte-goutte. Il suffit de les mener à leur tables respectives (numérotées de 1 à 3). <b>Mission accomplie.</b></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-cover bg-ice-cream text-center">
            <div class="Wrapper Wrapper--xs pv-40">
                <h2 class="ft-title-l mb-10">On serait ravis d'en discuter avec toi</h2>
                <p>On est très doués pour s'adapter aux spécifités de chaque lieu. N'hésite pas à nous contacter pour plus d'informations.</p>

                <button-base tag="a" href="https://calendly.com/gatheringsfr/partenariats" target="_blank" :modifiers="['light']" class="mt-30">
                    Être rappelé
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PartnerPage',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    data: () => ({

    }),
    computed: {
        gatherings () { return this.$store.getters['gathering/find']() },
    },
    mounted () {

    }
}
</script>

<style lang="scss" scoped>

</style>