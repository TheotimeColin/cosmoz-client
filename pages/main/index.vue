<template>
    <div class="Homepage bg-bg-strong">
        <div class="Homepage_heading bg-night">
            <div class="Wrapper">
                <div class="fx-grow">
                    <h1 class="ft-title-xl ft-title-m@s ft-title-s@xs">
                        <span class="d-block@xs">Participe à nos événements.</span><br>
                        <span class="d-block@xs">Crée de nouvelles affinités.</span><br>
                        <span class="d-block@xs">Trouve <span class="text-underline">ta constellation.</span></span>
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

        <div class="Wrapper pv-40">
            <div class="row fx-align-center pv-20 fx-dir-column-reverse@s">
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
                </div>
            </div>
            <div class="row fx-align-center pv-20">
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        2. Connecte-toi avec les personnes que tu apprécies
                    </h2>

                    <p>
                        T'as adoré discuter avec Jenny et Marc toute la soirée ? Si c'est réciproque, des Affinités se créent entre vous. On vous proposera de nouvelles sorties selon vos centres d'intérêt.
                    </p>
                </div>
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing2" width="100%">
                </div>
            </div>
            <div class="row fx-align-center pv-20 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s mt-30@s">
                    <img :src="assets.landing3" width="100%">
                </div>
                <div class="col-6 col-12@s">
                    <h2 class="ft-title-l mb-20 ft-title-m@xs">
                        3. Rejoins une nouvelle Constellation
                    </h2>

                    <p>
                        C'est votre groupe social privé et à taille humaine. Ensemble, organisez vos sorties, vivez des moments uniques et créez une communauté qui vous ressemble.
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-cover bg-ice-cream pv-60">
            <div class="Wrapper Wrapper--xs text-center">
                <p class="ft-title-l mb-20">
                    Gatherings est en bêta fermée pour le moment.
                </p>

                <p>
                    Mais on invite régulièrement de nouvelles personnes à rejoindre le réseau. Entre dans notre liste d'attente et reçois ton invitation gratuitement.
                </p>

                <div>
                    <button-base :modifiers="['light', 's']" class="mt-20" @click="newsletterActive = true">
                        Entrer dans la liste
                    </button-base>
                </div>

                <p class="ft-title-xs tape mt-20">Prochaine invitation : {{ countdown }}</p>
            </div>
        </div>

        <div>
            <div class="Wrapper pt-40 pb-20 p-relative">
                <div class="row-s">
                    <div class="col-6 col-12@s">
                        <h3 class="ft-title-m mb-20">
                            Des constellations qui te ressemblent<br>et qui rassemblent
                        </h3>

                        <p>
                            Nos constellations se créent autour d'un centre d'intérêt, d'une appartenance ou simplement de personnes qui aiment être ensemble. Chacune est limitée en membres pour conserver des communautés à taille humaine.
                            <br><br>
                            Tu peux quitter ou rejoindre d'autres constellations à tout moment, jusqu'à ce que tu trouves les groupes où tu te sens bien.
                        </p>

                        <button-base :modifiers="['light', 's']" class="mt-30" @click="newsletterActive = true">
                            Trouver ma constellation
                        </button-base>
                    </div>
                    <div class="col-6 col-12@s">
                        <transition-group name="fade" component="div" class="row-s n-mt-60 n-mt-0@s mt-30@s">
                            <div class="col-6 col-12@xs mb-20" v-for="constellation in activeConstellations" :key="constellation.title">
                                <block-constellation v-bind="constellation" />
                            </div>
                        </transition-group>
                    </div>
                </div>
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
    data: () => ({
        newsletterActive: false,
        countdown: '0j 00h 00m 00s',
        assets: { landing0, landing1, landing2, landing3 },
        constellations: [],
        activeConstellations: []
    }),
    mounted () {
        this.activeConstellations = [
            {
                title: 'Planche & wine lovers', members: 12, events: 14,
                cover: 'https://images.unsplash.com/photo-1491924778227-f225b115dd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=300&q=20',
                logo: 'https://images.unsplash.com/photo-1616631124348-c63521eb484c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2hhcmN1dGVyaWV8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'Team scorpio', members: 16, events: 21,
                cover: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y29uc3RlbGxhdGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1601523266240-897ed285851d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHNjb3JwaW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: `La taverne (JDR)`, members: 11, events: 6,
                cover: 'https://images.unsplash.com/photo-1600081523138-0bae23488dea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fG1lZGlldmFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1614767629805-3bbcf6e26c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZGljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'Adventure club paris', members: 35, events: 8,
                cover: 'https://images.unsplash.com/photo-1598959853379-cf6efb7959df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGZvcmVzdCUyMHdhbGt8ZW58MHx8MHx8&auto=format&fit=crop&w=300&q=20',
                logo: 'https://images.unsplash.com/photo-1542666365-eb335dc966ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTF8fGZvcmVzdCUyMHdhbGt8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60',
            }
        ]

        this.constellations = [
            {
                title: 'sorties 35 ans et plus', members: 44, events: 23,
                cover: 'https://images.unsplash.com/photo-1558346489-19413928158b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d2luZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y29mZmVlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'cocktails & more', members: 29, events: 18,
                cover: 'https://images.unsplash.com/photo-1591243315780-978fd00ff9db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ja3RhaWxzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1560433956-b2847671bb86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGNvY2t0YWlsc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'kév et les autres', members: 11, events: 5,
                cover: 'https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1cmdlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1550259114-ad7188f0a967?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZyaWVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'loud & queer', members: 41, events: 22,
                cover: 'https://images.unsplash.com/photo-1542358935821-e4e9f3f3c15d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxnYnR8ZW58MHx8MHx8&auto=format&fit=crop&w=300&q=20',
                logo: 'https://images.unsplash.com/photo-1545231097-c046d9dcc2f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fGxnYnR8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60',
            }, {
                title: '8-bit club', members: 56, events: 13,
                cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmV0cm98ZW58MHx8MHx8&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fGdhbWluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60',
            }, {
                title: 'brunch ?! brunch.', members: 26, events: 8,
                cover: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnJ1bmNofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=60',
                logo: 'https://images.unsplash.com/photo-1552334900-c49c6e315adb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c21pbGUlMjBmcmllbmRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=100&q=60',
            }
        ]

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                setInterval(() => {
                    this.constellations.push(this.activeConstellations[i])
                    this.activeConstellations.splice(i, 1, this.constellations[0])
                    this.constellations.shift()
                }, 2000 * 4)
            }, 2000 * i)
        }

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
        padding: 60px 0;
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
            padding: 30px;
        }
    }

    .fx-dir-column-reverse\@s {
        flex-direction: column-reverse;
    }
}

</style>