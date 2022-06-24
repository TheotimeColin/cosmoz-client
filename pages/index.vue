<template>
    <div class="Homepage">
        <div class="bg-cover-10 bg-night">
            <div class="G_cosmoz"></div>
            <div class="Wrapper Wrapper--m fx-center pv-60 pt-150@s d-block@s">
                <div class="text-center@xs">
                    <h1 class="ft-title-xl ft-title-l@xs">
                        Des communautés dans lesquelles tu te sentiras bien.
                    </h1>

                    <p class="ft-l mt-20 max-width-m">Trouve ta place et rencontre d'autres personnes extraordinaires qui partagent tes passions.</p>

                    <div class="mt-30 text-center@xs">
                        <button-base :modifiers="['light']" icon-before="sparkles" @click="$store.commit('page/register', 'landing-1')">
                            Commencer
                        </button-base>
                        
                        <br v-if="$smallerThan('xs')">

                        <link-base class="ml-10 ml-0@xs mt-10@xs" :to="{ name: 'explore' }">
                            Parcourir les groupes
                        </link-base>
                    </div>
                </div>
                <div class="width-m fx-no-shrink ml-20 mt-30 width-100@s ml-0@s">
                    <img :src="assets.landing0" width="100%" />
                </div>
            </div>
        </div>

        <div class="bg-cosmoz o-hidden">
            <div class="Wrapper">
                <div class="row fxa-center fxa-stretch">
                    <div class="col-6 col-12@s pv-100 pv-40@xs">
                        <h2 class="ft-title-l mb-20 ft-title-m@xs">
                            Ici, on se fout <span class="text-underline">royalement</span> de ce que pensent les influenceurs.
                        </h2>

                        <p class="ft-l">
                            <b>Dans ta communauté, pas d'influenceurs ni de pub déguisée.</b> Ici, on peut être soi-même et partager ses photos, même quand elles sont moches.
                        </p>

                        <div class="block-r p-15 shadow mt-30">
                            <input-toggle class="ft-title-2xs" style="--height: 30px" label="Filtre anti-ego-surdimensionné" v-model="filterOn" @click.native="hasClicked = true" />
                        </div>
                    </div>
                    <div class="col-6 col-12@s p-relative pb-20@xs bg-bg-xstrong@xs">
                        <img class="Homepage_image2" :src="assets.landingAuthentic" width="100%" v-show="filterOn">

                        <img class="Homepage_image2" :src="assets.landingFake" width="100%" v-show="!filterOn">
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-cover-75 bg-bg-xstrong o-hidden">
            <div class="G_cosmoz"></div>

            <div class="Wrapper pv-60 pt-20@xs pb-0@xs">
                <div class="block bg-bg-t shadow bg-none@xs p-0 ph-20@xs">
                    <h3 class="ft-title-s pv-30 ph-30 ph-0@xs pt-10@xs">
                        Trouve ta communauté
                    </h3>

                    <slider-block
                        :slots="constellations.map(g => g._id)"
                        class="outflow@xs"
                        :offset="20"
                        :offset-v="30"
                        item-class="width-xs"
                    >
                        <template v-for="conste in constellations" :slot="conste._id">
                            <block-const
                                class="shadow-s"
                                v-bind="conste"
                                :key="conste._id"
                            />
                        </template>
                    </slider-block>
                </div>
            </div>
        </div>

        <div class="bg-bg-light bg-cover bg-paper color-bg pv-60 text-center">
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

                <button-base :modifiers="['cosmoz']" class="mt-30 n-ml-3" @click="$store.commit('page/register', 'landing-2')" icon-before="arrow-right">
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
        await this.$store.dispatch('constellation/fetch', {
            query: { type: 'community', featured: true }
        })
    },
    data: () => ({
        filterOn: false,
        hasClicked: false,
        assets: { landing0, landingFake, landingAuthentic, feat1, feat2, feat3 }
    }),
    computed: {
        constellations () {
            return this.$store.getters['constellation/find']({
                type: 'community', featured: true
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
    top: 0;
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