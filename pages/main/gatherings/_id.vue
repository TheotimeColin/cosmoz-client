<template>
    <div>
        <div class="Wrapper Wrapper--xs pt-20 pb-60">
            <div class="Gathering_cover">
                <div class="Gathering_coverImage" :style="{ backgroundImage: `url(${gathering.hero})` }"></div>

                <span v-html="$options.filters.verticalize(gathering.title)"></span>
            </div>

            <div class="Gathering_dates">
                <div class="mt-20" v-for="(date, i) in gathering.dates" :key="i">
                    <p class="ft-title-s">
                        {{ $moment(date.date).format('dddd DD MMMM à H:mm') }} 
                    </p>

                    <div class="d-flex mt-20">
                        <div class="fx-grow">
                            <p class="ft-l-bold" v-if="gathering.included">{{ gathering.included }}</p>
                            <p class="ft-m tape tape-strong mt-5"><i>Tarif : 8€</i></p>
                        </div>

                        <div class="text-center ml-20">
                            <button-base
                                tag="a"
                                :href="date.link"
                                :class="{ 'is-disabled': date.left <= 0 }"
                                class="Gathering_date ml-5"
                            >
                                {{ date.left > 0 ? `Je réserve ma place` : `Événement complet` }}
                            </button-base>

                            <p class="ft-s mt-5" v-if="date.left > 0">{{ date.left }} place(s) restantes</p>
                            <link-base class="mt-10" :href="gathering.meetup" v-else>S'inscrire en liste d'attente</link-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringSingle',
    async fetch () {
        await this.$store.dispatch('gathering/get', { query: { _id: this.$route.params.id }})
    },
    computed: {
        gathering () {
            return this.$store.getters['gathering/findOne']({
                _id: this.$route.params.id
            })
        }
    },
}
</script>

<style lang="scss" scoped>

.Gathering_cover {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font: var(--ft-title-xl);
    line-height: 1;
    background-color: var(--color-bg-strong);

    &::before {
        content: "";
        display: block;
        @include ratio(50);
    }

    & > span {
        position: relative;
        z-index: 1;
    }
}

.Gathering_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-size: cover;
    background-position: center;
}
</style>