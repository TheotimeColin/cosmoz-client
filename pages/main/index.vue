<template>
    <div class="Homepage">
        <div class="Homepage_slider bg-ice-cream">
            <div class="Wrapper">
                <div class="fx-grow">
                    <h1 class="ft-title-xl ft-title-l@s">1 lieu sélectionné,<br>1 expérience à partager,<br>4 inconnus.</h1>
                    
                    <h2 class="ft-l-medium mt-20">La nouvelle manière de se rencontrer :<br>sans applis, sans profils, sans messages.</h2>
                </div>
                <div class="width-s text-center pv-40 ph-30 bg-bg-strong ml-20 ml-0@s width-auto@s mt-30@s">
                    <p class="ft-title-s">
                        Rejoins l'un de nos Gatherings.
                    </p>

                    <p class="mt-10">Tous les jeudis, reçois les événements de la semaine prochaine dans ta boîte mail. <b>Places très limitées.</b></p>

                    <div class="ft-title-m fx-no-shrink mt-20 tape d-block@s" :style="{ opacity: countdown == '0j 00h 00m 00s' ? 0 : 1 }">
                        <span>{{ countdown }}</span>
                    </div>

                    <br>

                    <button-base :modifiers="['light']" class="mt-20" @click="newsletterActive = true">
                        Entrer dans la liste
                    </button-base>
                </div>
            </div>
        </div>

        <div class="Wrapper mt-60">
            <div class="Homepage_weekTitle bg-denim-s">
                <span>nos meilleures expériences</span>
            </div>

            <p class="mt-20 mb-30 max-width-m">Selon tes critères, tu peux participer à des Gatherings par tranche d'âge, sexe ou centres d'intérêt. Ou alors laisser faire le hasard.</p>

            <div class="row-s">
                <div class="col-4 col-6@s col-12@xs mb-40" v-for="gathering in gatherings.slice(0, limit)" :key="gathering._id">
                    <block-gathering
                        v-bind="gathering"
                        @favorite="onFavorite"
                    />
                </div>

                <div class="col-12 text-center" v-if="limit < gatherings.length">
                    <button-base @click="limit += 6">Afficher la suite</button-base>
                </div>
            </div>

            <div class="text-center">
                <p class="ft-title-m max-width-m m-auto">
                    On imagine de nouvelles expériences toutes les semaines.
                </p>

                <div class="ft-title-l tape tape-2 mt-20">
                    {{ theme }}
                </div>
            </div>
            
            <!-- <div class="Homepage_week mt-60">
                <div class="Homepage_weekTitle" :style="{ '--background': `url(https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
                    <span>cette semaine <b>02 - 09 avril</b></span>
                </div>
                <div class="Homepage_row">
                    <div class="row-s">
                        <div class="col-4 col-6@s mb-40" v-for="gathering in gatherings" :key="gathering._id">
                            <block-gathering
                                v-bind="gathering"
                            />
                        </div>
                    </div>
                </div>
            </div> -->
        </div>

        <popin-newsletter :is-active="newsletterActive" origin="home" @close="newsletterActive = false" />

        <article class="Homepage_presentation bg-bg-strong p-relative mt-40">
            <div id="about" class="anchor"></div>

            <div class="Wrapper Wrapper--s pv-40">
                <h1 class="ft-title-l max-width-l mb-20 ft-title-m@s">Se rencontrer <span class="tape" style="transform: rotate(-2deg)">hors-ligne</span> dans une atmosphère conviviale et bienveillante.</h1>
                <p class="ft-l max-width-l">Si tu en as marre des profils égocentriques, marre qu'on te demande ce que tu recherches, marre des conversations qui ne mènent à rien : tu es au bon endroit.</p>
            </div>

            <div class="bg-cover bg-plastic-black pv-40">
                <div class="Wrapper Wrapper--s ft-title-2xs line-2 text-center">
                    <div class="row-xs">
                        <div class="col-6 col-12@xs">
                            <!-- <div class="tape tape-l tape-1">
                                "Je préfère apprendre à connaître dans le présent plutôt que de l'ajouter à une wishlist pour plus tard."
                            </div> -->
                            <div class="tape tape-strong tape-l">
                                "Attention à l'imagination qui se débride derrière un écran, on idéalise vite une image, une phrase, un profil"
                            </div>
                        </div>
                        <div class="col-6 col-12@xs">
                            <div class="tape tape-1 tape-l">
                                "Avec la masse de gens sur le "marché", on devient super exigeantes et ça mène qu'à de la déception pour tous."
                            </div>
                            <!-- <div class="tape tape-l tape-1">
                                "Sans parler des gars qui ressemblent pas du tout à ce qu'on voit en photos"
                            </div> -->
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="ft-title-xs line-2 tape max-width-m tape-l">
                            "au final, on tombe souvent amoureux de personnes qui ressemblent peu à nos choix théoriques."
                            
                            <span class="ft-xs-bold d-block mt-5">Lubomir lamy - Docteur en psychologie</span>
                        </div>
                    </div>
                </div>
            </div> 

            <div class="Wrapper Wrapper--s pv-60">
                <div class="row-no-gutters">
                    <div class="col-5 d-none@s">
                        <div class="Homepage_image fx-justify-end mr-40" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1569937756023-a079ccbe730e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjk2fHxncm91cCUyMGZyaWVuZHN8ZW58MHwxfDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60)` }">

                            <div class="ft-title-s tape tape-strong mb-5">
                                authentiques
                            </div>

                            <div class="ft-title-s tape tape-strong mb-5">
                                spontanés
                            </div>

                            <div class="ft-title-s tape">
                                humains
                            </div>
                        </div>
                    </div>

                    <div class="col-7 col-12@s">
                        <div class="TextBody">
                            <h2>Faire des rencontres sans applications, c'est possible.</h2>

                            <p>Nous organisons des rencontres en groupes de 4 à 6 personnes dans des lieux atypiques que nous sélectionnons.</p>

                            <p><b>Pas de profils, pas de messages, pas de filtres. Tu découvres les autres participants le jour J.</b></p>

                            <p>Nos Gatherings sont faits pour les personnes ouvertes d'esprits, qui aiment rencontrer d'autres humains sans pression.</p>

                            <button-base :modifiers="['light']" class="mt-20" @click="newsletterActive = true">
                                Je veux participer
                            </button-base>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-cover bg-bubble-gum pv-60">
                <div class="Wrapper Wrapper--s">
                    <div class="TextBody text-left">
                        <h2 style="font-size: 30px;">Ceci <span class="text-underline ">n'est pas</span> une application de rencontre amoureuse.</h2>

                        <p>As-tu déjà rêvé de tomber amoureux au coin de la rue ? Encore faut-il regarder autour de soi. Parfois nous sommes tellement concentrés sur nos recherches (trouver l'amour, trouver des amis...), que nous oublions de lever la tête.</p>

                        <p><b>Dans un Gathering, tu rencontres simplement d'autres personnes qui ont envie de partager un bon moment. Viens sans attentes et laisse le hasard faire le reste.</b></p>
                    </div>
                </div>
            </div> 

            <div class="bg-bg">
                <div class="Wrapper Wrapper--s pv-60">
                    <div class="row-no-gutters">
                        <div class="col-7 col-12@s">
                            <div class="TextBody">
                                <h2>Notre objectif : que tu passes une bonne soirée.</h2>

                                <p>Nous voulons que nos Gatherings soient ouverts à tous, même aux plus timides et anxieux. On sait à quel point ça peut être difficile de se lancer.</p>

                                <p>À chaque Gathering t'attend notre Kit Icebreaker. Il contient tout ce qu'il faut pour détendre l'atmosphère, donner la parole à chacun et créer une vraie dynamique dans le groupe.</p>

                                <button-base :modifiers="['light']" class="mt-20" @click="newsletterActive = true">
                                    Je me lance
                                </button-base>
                            </div>
                        </div>
                        <div class="col-5 d-none@s">
                            <div class="Homepage_image ml-40" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
                            
                                <div class="ft-title-s tape tape-strong mb-5">
                                    pour les timides
                                </div>

                                <div class="ft-title-s tape tape-strong mb-5">
                                    pour les bavards
                                </div>

                                <div class="ft-title-s tape">
                                    pour tous
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    data: () => ({
        limit: 6,
        newsletterActive: false,
        theme: '#chill',
        countdown: '0j 00h 00m 00s'
    }),
    computed: {
        gatherings () { return this.$store.getters['gathering/find']({ status: 'active' }) },
    },
    mounted () {
        let nextThursday = this.$moment('28-04-2022 18:00', 'DD-MM-YYYY HH:mm')

        while (nextThursday.isBefore(this.$moment())) {
            nextThursday = nextThursday.add('7', 'days')
        }

        setInterval(() => {
            let m = this.$moment.duration(nextThursday.diff(this.$moment()))

            this.countdown = `${m.days()}j ${this.$options.filters.fixed(m.hours())}h ${this.$options.filters.fixed(m.minutes())}m ${this.$options.filters.fixed(m.seconds())}s`

            let theme = this.theme

            while (theme == this.theme) {
                theme = this.$random(['#chill', '#fiesta', '#escapeGame', '#food', '#mocktails', '#karaoké', '#running', '#hackathon', '#networking', '#marioKart', '#uno', '#books', '#balade', '#beer', '#healthy', '#photographie', '#art', '#streetArt', '#vin', '#coffee', '#quizz', '#blindTest', '#bénévolat', '#goûter', '#queer', '#sushi', '#cuisine', '#atelier', '#pizza', '#gâteaux'])
            }

            this.theme = theme
        }, 400)
    },
    methods: {
        onFavorite () {
            if (this.$cookies.get('is-newsletter')) return
            
            this.$cookies.set('is-newsletter', true)

            setTimeout(() => {
                this.newsletterActive = true
            }, 500)
        }
    }
}
</script>

<style lang="scss" scoped>
.Homepage_row {
    border-left: 1px solid var(--color-border);
    padding: 0 0 0 40px;
}

.Homepage_weekTitle {
    font: var(--ft-title-l);
    line-height: 1;
    position: relative;

    span {
        position: relative;
        z-index: 2;
    }

    b {
        font: var(--ft-s-medium);
        text-transform: uppercase;
        margin-left: 3px;
        color: var(--color-ft-weak);
    }

    &::before {
        content: "";
        display: block;
        position: absolute;
        left: -25px;
        top: -8px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-image: var(--background);
        background-size: cover;
        background-position: center;
    }
}

.Homepage_slider {
    background-color: var(--color-bg-strong);
    position: relative;

    .Wrapper {
        padding: 40px 0;
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
        opacity: 0.5;
        background-image: var(--background);
        background-size: cover;
        background-position: center;
    }
}

.Homepage_image {
    height: 100%;
    min-height: 360px;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
}

@include breakpoint-s {
    .Homepage_slider {

        .Wrapper {
            display: block;
            padding: 30px;
        }
    }
}

</style>