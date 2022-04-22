<template>
    <div class="Homepage">
        <div class="Homepage_slider" :style="{ '--background': `url(https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
            <div class="Wrapper">
                <div class="fx-grow">
                    <h1 class="ft-title-xl">1 lieu sélectionné,<br>1 expérience à partager,<br>4 inconnus.</h1>
                    
                    <h2 class="ft-l-medium mt-20">La nouvelle manière de se rencontrer :<br>sans applis, sans profils, sans messages.</h2>
                </div>
                <div class="width-s text-center pv-40 ph-20 bg-bg-strong br-s ml-20">
                    <p class="ft-title-s">
                        On se lance bientôt.
                    </p>

                    <p class="mt-10">Soyez dans les premiers à réserver votre expérience (surprises à prévoir)</p>

                    <div class="ft-title-m fx-no-shrink mt-20 tape">
                        {{ countdown }}
                    </div>

                    <button-base :modifiers="['light']" class="mt-20">
                        Me prévenir
                    </button-base>
                </div>
            </div>
        </div>
        <div class="Wrapper">
            <div class="row-s mt-60">
                <div class="col-4 col-6@s mb-40" v-for="gathering in gatherings.slice(0, limit)" :key="gathering._id">
                    <block-gathering
                        v-bind="gathering"
                    />
                </div>

                <div class="col-12 text-center" v-if="limit < gatherings.length">
                    <button-base @click="limit += 6">Afficher la suite</button-base>
                </div>
            </div>

            <!-- <popin-base :modifiers="['absolute-header']" :is-active="true">
                <template slot="content">
                    <div class="p-30">
                        <p class="ft-title-m">
                            Pour des Rencontres plus spontanées, conviviales. Plus humaines.
                        </p>
                    </div>
                </template>
            </popin-base> -->
            
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

        <article class="Homepage_presentation bg-bg-strong mt-40 pb-40">
            <div class="Wrapper Wrapper--s pv-40">
                <h1 class="ft-title-l max-width-l mb-20">Se rencontrer hors-ligne, dans une atmosphère conviviale et bienveillante.</h1>
                <p class="ft-l max-width-l">Si tu en as marre des profils égocentriques, marre qu'on te demande ce que tu recherches, marre des conversations qui ne mènent à rien : tu es au bon endroit.</p>

                <p class="ft-l-medium max-width-l mt-20">Ici, on prône l'authenticité, la spontanéité et la bienveillance.</p>

                <div class="row-no-gutters mt-40">
                    <div class="col-5">
                        <div class="Homepage_image fx-justify-end mr-40" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1569937756023-a079ccbe730e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjk2fHxncm91cCUyMGZyaWVuZHN8ZW58MHwxfDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60)` }">

                            <div class="ft-title-m tape tape-strong mb-5">
                                authentiques
                            </div>

                            <div class="ft-title-m tape tape-strong mb-5">
                                spontanés
                            </div>

                            <div class="ft-title-m tape">
                                humains
                            </div>
                        </div>
                    </div>

                    <div class="col-7">
                        <div class="TextBody">
                            <h2>Faire des rencontres sans applications, c'est possible.</h2>

                            <p>Nous organisons des rencontres de groupes (4 à 6 personnes) dans des lieux atypiques que nous sélectionnions.</p>

                            <p><b>Pas de profils, pas de messages, pas de filtres. Tu découvres les autres participants le jour J.</b></p>

                            <p>Nos Gatherings sont faits pour les personnes ouvertes d'esprits, qui aiment rencontrer d'autres humains sans pression.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-bg pv-20">
                <div class="Wrapper Wrapper--s">
                    <div class="TextBody text-left mv-30">
                        <h2 style="font-size: 30px;">Ceci n'est pas une application de rencontre amoureuse.</h2>

                        <p>As-tu déjà rêvé de tomber amoureux au coin de la rue ? Encore faut-il regarder autour de soi. Parfois nous sommes tellement concentrés sur nos recherches (trouver l'amour, trouver des amis...), que nous oublions de lever la tête.</p>

                        <p><b>Dans un Gathering, tu rencontres simplement d'autres personnes qui ont envie de partager un bon moment. Viens sans attentes et laisse le hasard faire le reste.</b></p>
                    </div>
                </div>
            </div> 

            <div class="Wrapper Wrapper--s">
                <div class="row-no-gutters mt-40">
                    <div class="col-7">
                        <div class="TextBody">
                            <h2>Notre objectif : que tu passes une bonne soirée.</h2>

                            <p>Nous voulons que nos Gatherings soient ouverts à tous, même aux plus timides et anxieux. On sait à quel point ça peut être difficile de se lancer.</p>

                            <p>À chaque Gathering t'attend notre Kit Icebreaker. Il contient tout ce qu'il faut pour détendre l'atmosphère, donner la parole à chacun et créer une vraie dynamique dans le groupe.</p>
                        </div>
                    </div>
                    <div class="col-5">
                        <div class="Homepage_image ml-40 =" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)` }">
                        
                            <div class="ft-title-m tape tape-strong mb-5">
                                pour les timides
                            </div>

                            <div class="ft-title-m tape tape-strong mb-5">
                                pour les bavards
                            </div>

                            <div class="ft-title-m tape">
                                pour tous
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
        countdown: ''
    }),
    computed: {
        gatherings () { return this.$store.getters['gathering/find']() },
    },
    mounted () {
        setInterval(() => {
            let m = this.$moment.duration(this.$moment('18-05-2022 18:00', 'DD-MM-YYYY HH:mm').diff(this.$moment()))
            
            this.countdown = `${this.$options.filters.fixed(m.days())}j ${this.$options.filters.fixed(m.hours())}h ${this.$options.filters.fixed(m.minutes())}m ${this.$options.filters.fixed(m.seconds())}s`
        }, 500)
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
    margin-bottom: 40px;
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
        left: -35px;
        top: -18px;
        width: 70px;
        height: 70px;
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
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
}

</style>