<template>
    <div class="Homepage bg-bg-strong">
        <div class="Homepage_heading o-hidden">
            <div class="Wrapper Wrapper--l">
                <div class="n-mt-40">
                    <h1 class="ft-title-2xl ft-title-m@s ft-title-s@xs">
                        <span class="d-inline-block@xs mb-5@xs">Le premier réseau social</span><br>
                        <span class="d-inline-block@xs mb-5@xs">qui te reconnecte à tes amis,</span><br>
                        <span class="text-underline">pour de vrai.</span>
                    </h1>

                    <div class="row max-width-l mt-30 mt-10@xs">
                        <div class="col-6 mt-30 col-12@xs">
                            <h3 class="ft-title-2xs d-flex fxa-center">
                                <span class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                                    <fa icon="far fa-heart" />
                                </span>

                                Partage avec ceux qui comptent vraiment
                            </h3>
                        </div>
                        <div class="col-6 mt-30 col-12@xs">
                            <h3 class="ft-title-2xs d-flex fxa-center">
                                <span class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                                    <fa icon="far fa-party-horn" />
                                </span>
                                
                                Organisez et vivez des moments uniques
                            </h3>
                        </div>
                        <div class="col-6 mt-30 col-12@xs">
                            <h3 class="ft-title-2xs d-flex fxa-center">
                                <span class="color-ft round-m bg-bg-light fx-no-shrink mr-15">
                                    <fa icon="far fa-sparkles" />
                                </span>
                                
                                Crée un groupe sur qui tu peux compter
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="fx-grow p-relative">
                    <img width="475" class="d-none@xs" style="opacity: 0" :src="assets.landing0">
                    <img class="Homepage_image0" :src="assets.landing0">
                </div>
            </div>
        </div>

        <div class="bg-cover-25 bg-night bg-bg-2xstrong">
            <div class="Wrapper Wrapper--m ph-30@xs">
                <div class="row fxa-center fx-dir-column-reverse@s">
                    <div class="col-6 col-12@s n-mt-20 n-mb-20 mt-10@s">
                        <img :src="assets.landing1" width="100%">
                    </div>
                    <div class="pv-60 col-6 col-12@s pv-30@xs">
                        <h2 class="ft-title-l mb-20 ft-title-m@xs">
                            Ta constellation de potes en qui tu peux avoir confiance.
                        </h2>

                        <p class="ft-l">
                            <b>Seules les personnes que tu connais dans la vie réelle peuvent voir et interagir avec ce que tu publies.</b> Votre constellation, c'est votre bout de Cosmoz rien qu'à vous.
                        </p>

                        <button-base :modifiers="['light']" class="mt-30 n-ml-3" @click="$store.commit('page/register', 'landing-1')">
                            Créer ma constellation
                        </button-base>
                    </div>
                </div>
            </div>
        </div>

        <div class="o-hidden">
            <div class="Wrapper ph-30@xs">
                <div class="row fxa-center fxa-stretch">
                    <div class="col-6 col-12@s pv-100 pv-40@xs">
                        <h2 class="ft-title-l mb-20 ft-title-m@xs">
                            Ici, on se fout <span class="text-underline">royalement</span> de ce que pensent les influenceurs.
                        </h2>

                        <p class="ft-l">
                            <b>Dans ta constellation, pas d'influenceurs, pas de pub déguisée.</b> On préfère plutôt suivre l'avis de ses potes ou avoir des nouvelles de leur chaton.
                        </p>

                        <input-toggle class="ft-title-2xs mt-30" style="--height: 30px" label="Filtre anti-ego-surdimensionné" v-model="filterOn" @click.native="hasClicked = true" />
                    </div>
                    <div class="col-6 col-12@s p-relative">
                        <img class="Homepage_image2" :src="assets.landingAuthentic" width="100%" v-show="filterOn">

                        <img class="Homepage_image2" :src="assets.landingFake" width="100%" v-show="!filterOn">
                    </div>
                </div>
            </div>

            <div class="bg-bg-xstrong pv-60 text-center n-mt-40@xs">
                <div class="Wrapper Wrapper--s  h-30@xs">
                    <h2 class="ft-title-l mb-20 ft-title-s@xs">
                        Le meilleur moyen d'entretenir sa constellation,<br>c'est de <span class="text-underline">lâcher son écran</span>.
                    </h2>
                    <div class="row-s mt-40 fxa-start">
                        <div class="col-4 col-6@s col-12@xs">
                            <h3 class="ft-title-xs mb-20 max-width-xs@s m-auto">
                                Restez au courant des envies de chacun.
                            </h3>

                            <img :src="assets.feat1" width="100%" class=" max-width-xs@s" />
                        </div>
                        <div class="col-4 col-6@s col-12@xs mt-30@xs">
                            <h3 class="ft-title-xs mb-20 max-width-xs@s m-auto">
                                Organisez vos sorties sans prise de tête.
                            </h3>

                            <img :src="assets.feat2" width="100%" class=" max-width-xs@s" />
                        </div>
                        <div class="col-4 col-6@s col-12@xs mt-30@s">
                            <h3 class="ft-title-xs mb-20 max-width-xs@s m-auto">
                                Créez de nouveaux souvenirs, ensemble.
                            </h3>

                            <img :src="assets.feat3" width="100%" class=" max-width-xs@s" />
                        </div>
                    </div>

                    <button-base :modifiers="['light']" class="mt-30 n-ml-3" @click="$store.commit('page/register', 'landing-2')">
                        Créer ma constellation
                    </button-base>
                </div>
            </div>

            <div class="bg-cover bg-ice-cream pv-60">
                <div class="Wrapper Wrapper--s ph-30@xs">
                    <h2 class="ft-title-l mb-20 ft-title-s@xs">
                        Envie de voir de nouvelles têtes ? Nouveau en ville ? On a pensé à toi.
                    </h2>
                    
                    <p>On a créé <span class="text-underline">Cosmoz Events</span> pour les personnes qui ont envie d'étendre leur constellation. Participe à des rassemblements super conviviaux près de chez toi, et crée de nouvelles affinités !</p>

                    <button-base :to="{ name: 'events' }" :modifiers="['light']" class="mt-30 n-ml-3">
                        Découvrir nos rassemblements
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import landing0 from '@/assets/img/landing/v2/landing_0.webp'
import landing1 from '@/assets/img/landing/v2/landing_1.webp'
import landingFake from '@/assets/img/landing/v2/fake.webp'
import landingAuthentic from '@/assets/img/landing/v2/authentic.webp'
import feat1 from '@/assets/img/landing/v2/feat1.webp'
import feat2 from '@/assets/img/landing/v2/feat2.webp'
import feat3 from '@/assets/img/landing/v2/feat3.webp'

export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            limit: 3,
            query: {}
        })
    },
    data: () => ({
        filterOn: false,
        hasClicked: false,
        assets: { landing0, landing1, feat1, feat2, feat3, landingFake, landingAuthentic }
    }),
    computed: {
        gatherings () {
            return this.$store.getters['gathering/find']({
                date: '$notNull',
                display: false
            })
        }
    },
    created () {
        this.$store.commit('page/setHeader', { transparent: true })
    },
    beforeDestroy () {
        this.$store.commit('page/setHeader', { transparent: false })
    },
    mounted () {
        if (this.$route.query.r) {
            this.$store.commit('page/register', 'referral')
        }
        
        setInterval(() => {
            if (this.hasClicked) return

            this.filterOn = !this.filterOn
        }, 4000)
    }
}
</script>

<style lang="scss" scoped>
.Homepage_row {
    border-left: 1px solid var(--color-border);
    padding: 0 0 0 40px;
}

.Homepage_image0 {
    position: absolute;
    top: 0;
    left: 10%;
    width: 100%;
    z-index: 3;
}

.Homepage_image2 {
    position: absolute;
    left: 0;
    bottom: -10%;
    width: 155%;
    z-index: 3;
}

.Homepage_heading {
    background-color: var(--color-bg-strong);
    position: relative;

    .Wrapper {
        padding: 70px 0 0px;
        display: flex;
        position: relative;
        align-items: center;
    }
}

@include breakpoint-s {
    .Homepage_heading {
        
        .Wrapper {
            display: block;
            padding: 120px 30px 60px;
        }
    }

    .Homepage_image0 {
        display: none;
    }

    .Homepage_image2 {
        position: relative;
        bottom: auto;
        left: -25%;
        width: 150%;
    }

    .fx-dir-column-reverse\@s {
        flex-direction: column-reverse;
    }
}

</style>