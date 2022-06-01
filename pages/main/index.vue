<template>
    <div class="Homepage bg-bg-strong">
        <div class="Homepage_heading bg-night">
            <div class="Wrapper">
                <div class="fx-grow">
                    <h1 class="ft-title-2xl ft-title-m@s ft-title-s@xs">
                        <span class="d-inline-block@xs mb-5@xs">Participe à nos rencontres.</span><br>
                        <span class="d-inline-block@xs mb-5@xs">Crée de nouvelles affinités.</span><br>
                        <span class="">Trouve <span class="text-underline">ta constellation.</span></span>
                    </h1>
                    
                    <h2 class="ft-l max-width-m mt-20 ft-m@xs">
                        Rejoins un groupe de personnes avec qui tu te sens bien, partagez vos meilleurs moments et sortez conquérir le monde.
                    </h2>
                </div>
                <div class="width-s ml-0@s width-auto@s mt-30@s d-none@xs">
                    <img :src="assets.landing0" width="100%">
                </div>
            </div>
        </div>

        <div class="Wrapper pv-20">
            <div class="row-s fxa-center pv-30 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing1" width="100%">
                </div>
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        1. Participe à nos rencontres super conviviales
                    </h2>

                    <p>
                        On organise de nombreuses rencontres près de chez toi, où tu peux profiter du soleil ou siroter un cocktail avec des personnes ouvertes et bienveillantes.
                    </p>

                    <div class="ft-title-xs tape tape-strong mt-30">Au fait, c'est gratuit.</div>
                </div>
            </div>

            <div class="row fxa-center pv-30">
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        2. Crée ta constellation de nouveaux potes
                    </h2>

                    <p>
                        T'as adoré discuter avec Jenny et Marc toute la soirée ? Si c'est réciproque, ils entrent <span class="text-underline">dans ta constellation</span>. On vous proposera de nouvelles sorties selon vos centres d'intérêt.
                    </p>
                </div>
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing2" width="100%">
                </div>
            </div>

            <div class="row fxa-center pv-30 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing3" width="100%">
                </div>
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        3. Organise tes propres sorties
                    </h2>

                    <p>
                        En quelques clics, tu peux proposer une sortie à ta constellation et continuer à vous voir. Et grâce à toi, de nouveaux liens vont sûrement se tisser entre tes potes !
                    </p>
                </div>
            </div>
        </div>

        <div class="pv-30 bg-bg-2xstrong bg-cover-25 bg-plastic-black" v-if="gatherings.length > 0">
            <div class="Wrapper">
                <div class="bg-bg-2xstrong pt-40 br-s">
                    <div class="mb-40 ph-40">
                        <h2 class="ft-title-m ft-title-s@xs">
                            Mieux que des événements,<br>des rencontres.
                        </h2>
                        <p class="mt-10 max-width-m">Nos animateurs sont vérifiés et ont tous le même objectif : te faire passer un moment convivial avec d'autres personnes qui te ressemblent.</p>
                    </div>

                    <slider-block
                        :slots="gatherings.map(g => g._id)"
                        :ratio="100"
                        item-class="width-2xs"
                        :offset="$smallerThan('xs') ? 15 : 20"
                        :offset-v="20"
                    >
                        <div v-for="gathering in gatherings" :slot="gathering._id" :key="gathering._id">
                            <block-gathering
                                :modifiers="['square']"
                                :const-only="true"
                                :const-short="true"
                                v-bind="gathering"
                            />
                        </div>
                    </slider-block>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import landing0 from '@/assets/img/landing/v2/landing_1.webp'
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
    background-color: var(--color-bg-weak);
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