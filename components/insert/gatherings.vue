<template>
    <div class="InsertGatherings">
        <div :href="$config.blogUrl" class="ft-title-s fx-no-shrink">
            1 lieu unique, 1 expérience à partager, 4 inconnus.
        </div>

        <div class="mt-10">
            Se rencontrer de manière plus authentique & spontanée. Une nouvelle manière de créer lien, de découvrir sa ville et découvrir l'autre. <b>De nouvelles expériences chaque semaine.</b>
        </div>

        <div class="row">
            <div class="mt-20 col-6 col-12@s" v-for="gathering in gatherings.slice(0, 2)" :key="gathering._id">
                <block-gathering-secret
                    v-bind="gathering"
                    @unlock="toUnlock -= 1"
                />
            </div>
        </div>

        <popin-newsletter :is-active="isNewsletter" origin="article" @close="isNewsletter = false" />

        <transition name="fade">
            <div class="d-flex br-s bg-cover o-hidden bg-holo p-30 mt-30 d-block@s" v-show="toUnlock == 0">
                <div class="max-width-m">
                    <p class="ft-title-s">Comment participer à nos Gatherings ?</p>

                    <div class="mt-10"></div>

                    <p class="line-2">On t'envoie les invitations exclusives tous les jeudis. Inscris-toi sur notre liste pour ne pas les rater.</p>
                </div>

                <div class="mh-30">
                    <hr class="SeparatorV">
                </div>

                <div class="fx-grow text-center mr-10 fx-center mr-0@s mt-20@s">
                    <button-base :modifiers="['light']" @click="isNewsletter = true">Envoyez-moi les invit'</button-base>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    name: 'InsertGatherings',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    data: () => ({
        toUnlock: 2,
        isNewsletter: false,
    }),
    computed: {
        gatherings () { return this.$shuffle(this.$store.getters['gathering/find']({ status: 'active' })) },
    },
}
</script>

<style lang="scss" scoped>
.InsertGatherings {
    padding: 40px;
    background-color: var(--color-bg-xstrong);
    color: var(--color-ft-light);

    a {
        text-decoration: none;
    }
}

.InsertGatherings_container {
    overflow: hidden;
}

.InsertGatherings_rail {
    white-space: nowrap;
}

.InsertGatherings_item {
    display: inline-flex;
    vertical-align: top;
    padding: 10px;
}

@include breakpoint-xs {

    .InsertGatherings {
        padding: 20px;
    }
}

</style>