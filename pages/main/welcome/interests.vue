<template>
    <div>
        <form @submit.prevent="onSubmit" class="Wrapper Wrapper--s pv-100 ft-l pb-20@xs">
            <h1 class="ft-title-l mt-30 mb-10 mt-0@xs">Quels sont tes centres d'intérêts ?</h1>

            <p>Voici des exemples d'événements qu'on propose sur Cosmoz. Sélectionne ceux qui t'intéressent !</p>

            <transition-group name="fade" tag="div" class="row-s mt-40" v-if="pile.filter(p => p.title).length > 0">
                <div class="col-4 col-6@xs mb-20@xs" v-for="block in pile" :key="block.id">
                    <block-interest
                        v-bind="block"
                        @like="() => onAction(true, block)"
                        @ignore="() => onAction(false, block)"
                        v-if="block.title"
                    />
                </div>
            </transition-group>

            <template v-if="interests.length > 0 || excluded.length > 0">
                <h2 class="ft-title-s mt-60 mb-10">Mes centres d'intérêts</h2>
                <transition-group name="fade">
                    <span class="tag mb-5 mr-5 c-pointer" v-for="tag in interests" :key="tag" @click="onToggleTag(tag)">
                        <span>{{ $t(`interests.${tag}`) }}</span> <fa icon="far fa-times" class="ml-10" />
                    </span>
                </transition-group>

                <div class="mt-30" style="opacity: 0.5" v-if="excluded.length > 0">
                    <p class="mb-10">Pas intéressé</p>
                    <transition-group name="fade">
                        <span class="tag mb-5 mr-5 c-pointer" v-for="tag in excluded" @click="onToggleTag(tag)" :key="tag">
                            <fa icon="far fa-plus" class="mr-10" /> <span>{{ $t(`interests.${tag}`) }}</span> 
                        </span>
                    </transition-group>
                </div>
            </template>

            <div class="d-flex fxa-center mt-60 p-20 bg-bg-xstrong text-right br-s">
                <p class="ft-m color-ft-weak mr-10 fx-grow">Tu pourras ajuster tes centres d'intérêts plus tard</p>

                <button-base :modifiers="['light']" icon-after="arrow-right" :loading="isLoading" :disabled="interests.length <= 0">
                    Continuer
                </button-base>
            </div>
        </form>

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
    name: 'WelcomeInterests',
    middleware: ['loggedIn'],
    data: () => ({
        isLoading: false,
        blocks: [],
        pile: [],
        interests: [],
        excluded: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    created () {
        this.pile = [
            { id: 0, title: `Randonnée en forêt`, tags: [`nature`, `sport`, `outside`], thumbnail: require('@/assets/img/interests/nature.webp') },
            { id: 1, title: `Afterwork sur les quais`, tags: [`afterwork`, `drinks`, `outside`], thumbnail: require('@/assets/img/interests/afterworks.webp') },
            { id: 2, title: `Après-midi jeux de société`, tags: [`games`], thumbnail: require('@/assets/img/interests/games.webp') },
        ]

        this.blocks = [
            { id: 3, title: `Restaurant insolite`, tags: [`foodie`, `insolite`], thumbnail: require('@/assets/img/interests/foodie.webp') },
            { id: 4, title: `Soirée cinéma`, tags: [`movies`], thumbnail: require('@/assets/img/interests/movies.webp') },
            { id: 9, title: `Sortie entre LGBTQ+`, tags: [`lgbtq`], thumbnail: require('@/assets/img/interests/lgbtq.webp') },
            { id: 5, title: `Visite groupée au musée`, tags: [`art`, `culture`], thumbnail: require('@/assets/img/interests/art.webp') },
            { id: 6, title: `Partie de Mario Kart`, tags: [`geek`], thumbnail: require('@/assets/img/interests/geek.webp') },
            { id: 13, title: `Rencontre en célibataires`, tags: [`singles`], thumbnail: require('@/assets/img/interests/singles.webp') },
            { id: 10, title: `Après-midi bénévolat`, tags: [`volunteering`] },
            { id: 7, title: `Salon de thé & patisseries`, tags: [`foodie`, `chill`] },
            { id: 8, title: `Festival de musique`, tags: [`festive`, `music`] },
            { id: 11, title: `Soirée entre filles`, tags: [`girls`] },
            { id: 12, title: `Débat entrepreneurs & start-ups`, tags: [`startups`] },
        ]

        if (this.$smallerThan('s')) {
            this.pile.push(this.blocks[0])
            this.blocks.shift()
        }
    },
    methods: {
        onToggleTag (tag) {
            if (this.interests.includes(tag)) {
                this.interests = this.interests.filter(t => t != tag)
                this.excluded = [ ...this.excluded, tag ]
            } else {
                this.excluded = this.excluded.filter(t => t != tag)
                this.interests = [ ...this.interests, tag ]

            }
        },
        onAction (action, block) {
            if (action) {
                this.interests = [
                    ...this.interests,
                    ...block.tags.filter(t => !this.interests.includes(t) && !this.excluded.includes(t))
                ]
            } else {
                this.excluded = [
                    ...this.excluded,
                    ...block.tags.filter(t => !this.interests.includes(t))
                ]
            }

            this.pile = this.pile.map(b => ({
                ...(b.id == block.id ? (this.blocks[0] ? this.blocks[0] : false) : b)
            }))

            this.blocks.shift()
        },
        async onSubmit () {
            this.isLoading = true
            
            try {
                await this.$store.dispatch('user/update', {
                    interests: this.interests
                })

                await this.$store.dispatch('user/updateNotification', {
                    id: 'welcomed',
                    type: 'onboarding'
                })

                this.$router.push(this.localePath({ name: 'feed' }))
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>

</style>