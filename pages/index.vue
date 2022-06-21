<template>
    <div class="Homepage">
        <div class="bg-cosmoz-strong">
            <div class="Wrapper Wrapper--m fx-center pv-60 pt-100@s d-block@s">
                <div>
                    <h1 class="ft-title-xl ft-title-l@xs">
                        Rejoins une communauté dans laquelle tu te sentiras bien.
                    </h1>

                    <p class="ft-l mt-20 max-width-m">Rencontre des personnes extraordinaires qui partagent tes passions et trouve ta place dans nos groupes locaux.</p>

                    <div class="mt-30 text-center@s">
                        <button-base :modifiers="['light']" icon-before="sparkles" @click="$store.commit('page/register', 'landing-1')">
                            Commencer
                        </button-base>

                        <link-base class="ml-10" :to="{ name: 'explore' }">
                            Parcourir les groupes
                        </link-base>
                    </div>
                </div>
                <div class="width-m fx-no-shrink ml-20 mt-30 width-100@s ml-0@s">
                    <img :src="assets.landing0" width="100%" />
                </div>
            </div>
        </div>

        <div class="bg-bg-weak o-hidden">
            <div class="Wrapper">
                <div class="row fxa-center fxa-stretch">
                    <div class="col-6 col-12@s pv-100 pv-40@xs">
                        <h2 class="ft-title-l mb-20 ft-title-m@xs">
                            Ici, on se fout <span class="text-underline">royalement</span> de ce que pensent les influenceurs.
                        </h2>

                        <p class="ft-l">
                            <b>Dans ta communauté, pas d'influenceurs ni de pub déguisée.</b> Ici, on peut être soi-même et partager ses photos, même quand elles sont moches.
                        </p>

                        <input-toggle class="ft-title-2xs mt-30" style="--height: 30px" label="Filtre anti-ego-surdimensionné" v-model="filterOn" @click.native="hasClicked = true" />
                    </div>
                    <div class="col-6 col-12@s p-relative pb-20@xs" :class="{ 'bg-cosmoz@xs': filterOn, 'bg-bg-xweak@xs': !filterOn }">
                        <img class="Homepage_image2" :src="assets.landingAuthentic" width="100%" v-show="filterOn">

                        <img class="Homepage_image2" :src="assets.landingFake" width="100%" v-show="!filterOn">
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-cover-75 bg-ice-cream">
            <div class="Wrapper pv-60 pv-20@xs">
                <div class="block bg-bg-strong bg-none@xs p-0 ph-20@xs">
                    <h3 class="ft-title-s pv-20 ph-20 ph-0@xs">
                        Trouver sa communauté
                    </h3>

                    <slider-block
                        :slots="constellations.map(g => g._id)"
                        class="outflow@xs"
                        :offset="$smallerThan('xs') ? 20 : 20"
                        item-class="width-xs"
                    >
                        <template v-for="conste in constellations" :slot="conste._id">
                            <block-const
                                v-bind="conste"
                                :key="conste._id"
                            />
                        </template>
                    </slider-block>
                </div>
            </div>
        </div>

        <div class="bg-cosmoz-strong pv-60 text-center">
            <div class="Wrapper Wrapper--s">
                <h2 class="ft-title-l mb-20 ft-title-m@xs">
                    En ligne c'est bien.<br><u>Hors-ligne</u>, c'est encore mieux.
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

                <button-base :modifiers="['light']" class="mt-30 n-ml-3" @click="$store.commit('page/register', 'landing-2')" icon-before="arrow-right">
                    C'est parti !
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import landing0 from '@/assets/img/landing/v3/foodies.webp'
import landingFake from '@/assets/img/landing/v2/fake.webp'
import landingAuthentic from '@/assets/img/landing/v2/authentic.webp'
import feat1 from '@/assets/img/landing/v2/feat1.webp'
import feat2 from '@/assets/img/landing/v2/feat2.webp'
import feat3 from '@/assets/img/landing/v2/feat3.webp'

export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('constellation/fetch', {})
    },
    data: () => ({
        filterOn: false,
        hasClicked: false,
        assets: { landing0, landingFake, landingAuthentic, feat1, feat2, feat3 }
    }),
    computed: {
        constellations () {
            return this.$store.getters['constellation/find']({

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
        setInterval(() => {
            if (this.hasClicked) return

            this.filterOn = !this.filterOn
        }, 4000)
    }
}
</script>

<style lang="scss" scoped>
.Homepage_image2 {
    position: absolute;
    left: 0;
    bottom: -10%;
    width: 155%;
    z-index: 3;
}

@include breakpoint-s {
    
    .Homepage_image2 {
        position: relative;
        bottom: auto;
        left: -25%;
        width: 150%;
    }
}
</style>