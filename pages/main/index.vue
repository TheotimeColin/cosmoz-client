<template>
    <div class="Homepage bg-bg-strong">
        <div class="Homepage_heading bg-night">
            <div class="Wrapper">
                <div class="fx-grow">
                    <h1 class="ft-title-xl ft-title-m@s ft-title-s@xs">
                        <span class="d-inline-block@xs mb-5@xs">Participe à nos événements.</span><br>
                        <span class="d-inline-block@xs mb-5@xs">Crée de nouvelles affinités.</span><br>
                        <span class="">Trouve <span class="text-underline">ta constellation.</span></span>
                    </h1>
                    
                    <h2 class="ft-l max-width-m mt-20 ft-m@xs">
                        Rejoins un groupe de personnes avec qui tu te sens bien, partagez vos meilleurs moments et sortez conquérir le monde.
                    </h2>
                </div>
                <div class="width-s ml-20 ml-0@s width-auto@s mt-30@s d-none@xs">
                    <img :src="assets.landing0" width="100%">
                </div>
            </div>
        </div>

        <div class="Wrapper pv-20">
            <div class="row-s fxa-center pv-20 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing1" width="100%">
                </div>
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        1. Participe à nos événements super conviviaux
                    </h2>

                    <p>
                        On organise de nombreux événements près de chez toi, où tu peux profiter du soleil ou siroter un cocktail avec des personnes ouvertes et bienveillantes.
                    </p>

                    <div class="ft-title-s tape tape-strong mt-30">Au fait, c'est gratuit.</div>
                </div>
            </div>
        </div>
        <div class="pv-30 bg-bg-2xstrong bg-cover-25 bg-plastic-black">
            <div class="Wrapper">
                <div class="bg-bg-2xstrong pt-40 br-s">
                    <div class="mb-40 ph-40">
                        <h2 class="ft-title-m ft-title-s@xs">
                            Mieux que des événements,<br>des rassemblements.
                        </h2>
                        <p class="mt-10 max-width-m">Nos créateurs sont vérifiés et ont tous le même objectif : te faire passer un bon moment avec d'autres personnes qui te ressemblent.</p>
                    </div>

                    <slider-block
                        item-class="width-2xs"
                        :offset="40"
                    >
                        <div v-for="gathering in gatherings" :slot="gathering._id" :key="gathering._id">
                            <block-gathering
                                :modifiers="['square']"
                                :status-only="true"
                                v-bind="gathering"
                            />

                            <p class="ft-s mt-10">Organisé par antiswipe, rencontres LGBTQ</p>
                        </div>
                    </slider-block>
                </div>
            </div>
        </div>
        <div class="Wrapper pv-20">
            <div class="row fxa-center pv-20">
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        2. Connecte-toi avec les personnes que tu apprécies
                    </h2>

                    <p>
                        T'as adoré discuter avec Jenny et Marc toute la soirée ? Si c'est réciproque, des <span class="text-underline">affinités</span> se créent entre vous. On vous proposera de nouvelles sorties selon vos centres d'intérêt.
                    </p>
                </div>
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing2" width="100%">
                </div>
            </div>
            <div class="row fxa-center pv-20 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing3" width="100%">
                </div>
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        3. Rejoins une nouvelle constellation
                    </h2>

                    <p>
                        Lorsque tu as assez d'affintés, on propose à ton réseau de créer une <span class="text-underline">constellation</span>. C'est votre groupe social privé et à taille humaine. Organisez vos sorties, vivez des moments uniques et créez une communauté qui vous ressemble.
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-cover bg-ice-cream pv-60">
            <div class="Wrapper Wrapper--xs text-center">
                <p class="ft-title-l mb-20">
                    Cosmoz est en bêta fermée pour le moment.
                </p>

                <p>
                    Mais on invite régulièrement de nouvelles personnes à rejoindre le réseau. Entre dans notre liste d'attente et reçois ton invitation gratuitement.
                </p>

                <div>
                    <button-base :modifiers="['light']" class="mt-20" @click="newsletterActive = true">
                        Entrer dans la liste
                    </button-base>
                </div>

                <p class="ft-title-xs tape mt-20">Prochaine invitation : {{ countdown }}</p>
            </div>
        </div>

        <div>
            <div class="Wrapper pv-60 p-relative">
                <p class="ft-title-l mb-40">
                    Par ici les questions !
                </p>

                <faq />
            </div>
        </div>

        <popin-newsletter :is-active="newsletterActive" origin="home" @close="newsletterActive = false" />
    </div>
</template>

<script>
import landing0 from '@/assets/img/landing/landing_0.webp'
import landing1 from '@/assets/img/landing/landing_1.webp'
import landing2 from '@/assets/img/landing/landing_2.webp'
import landing3 from '@/assets/img/landing/landing_3.webp'

export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            limit: 3,
            query: {}
        })
    },
    data: () => ({
        newsletterActive: false,
        countdown: '0j 00h 00m 00s',
        assets: { landing0, landing1, landing2, landing3 }
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
        let nextThursday = this.$moment('28-04-2022 18:00', 'DD-MM-YYYY HH:mm')

        while (nextThursday.isBefore(this.$moment())) {
            nextThursday = nextThursday.add('4', 'days')
        }

        setInterval(() => {
            let m = this.$moment.duration(nextThursday.diff(this.$moment()))

            this.countdown = `${m.days()}j ${this.$options.filters.fixed(m.hours())}h ${this.$options.filters.fixed(m.minutes())}m ${this.$options.filters.fixed(m.seconds())}s`
        }, 400)
    }
}
</script>

<style lang="scss" scoped>
.Homepage_row {
    border-left: 1px solid var(--color-border);
    padding: 0 0 0 40px;
}

.Homepage_heading {
    background-color: var(--color-bg-strong);
    position: relative;

    .Wrapper {
        padding: 100px 0 60px;
        display: flex;
        position: relative;
        align-items: center;
    }

    &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.25;
        background-image: var(--background);
        background-size: cover;
        background-position: center;
    }
}

@include breakpoint-s {
    .Homepage_heading {

        .Wrapper {
            display: block;
            padding: 100px 30px 40px;
        }
    }

    .fx-dir-column-reverse\@s {
        flex-direction: column-reverse;
    }
}

</style>