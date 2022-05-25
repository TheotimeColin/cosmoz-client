<template>
    <div>
        <div class="Wrapper Wrapper--s pv-100 ft-l">
            <h1 class="ft-title-l mv-30">Bienvenue chez Cosmoz {{ user.name }} !</h1>

            <div class="d-flex mt-60 max-width-m">
                <div class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                    <fa icon="far fa-heart" />
                </div>

                <div>
                    <h3 class="ft-title-s mb-10">
                        Le premier réseau vraiment social.
                    </h3>
                    <p class="ft-l">Notre seul objectif ? Étendre ton réseau de connaissances pour que tu aies toujours des potes avec qui sortir.</p>
                </div>
            </div>

            <div class="d-flex mt-60 max-width-m ml-auto">
                <div class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                    <fa icon="far fa-lock" />
                </div>

                <div>
                    <h3 class="ft-title-s mb-10">
                        Ici, tout le monde se connaît.
                    </h3>
                    <p class="ft-l">Ton profil et ce que tu publies est uniquement visible par les personnes que tu as rencontrées en vrai.</p>
                </div>
            </div>

            
            <div class="d-flex mt-60 max-width-m">
                <div class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                    <fa icon="far fa-sparkles" />
                </div>

                <div>
                    <h3 class="ft-title-s mb-10">
                        Sortir & étendre ta constellation.
                    </h3>
                    <p class="ft-l">En participant à nos événements, tu vas créer de nouveaux liens avec des personnes géniales.</p>
                </div>
            </div>


            <div class="mt-60 p-20 bg-bg-xstrong text-right br-s">
                <button-base :modifiers="['light']" icon-after="arrow-right" :to="{ name: 'welcome-profile' }">
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
export default {
    name: 'WelcomeIndex',
    computed: {
        user () { return this.$store.getters['user/self'] },
    },
    methods: {
        async onEnd () {

        }
    }
}
</script>

<style lang="scss" scoped>

</style>