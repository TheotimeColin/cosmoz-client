<template>
    <div class="Orga page" v-if="orga">
        <div class="Wrapper">
            <div class="Orga_cover" :style="{ backgroundImage: `url(${orga.hero})` }">
                <quick-menu
                    :items="[
                        { label: `Copier l'ID`, fa: 'hashtag', action: () => $copy(orga._id) }
                    ]"
                />
            </div>

            <div class="fx-center p-15 bg-bg">
                <div class="d-flex fxa-center">
                    <orga-icon :modifiers="['xl']" v-bind="orga" />

                    <div class="ml-15">
                        <h1 class="ft-title-xs">{{ orga.name }}</h1>
                        <h2 class="ft-m">{{ orga.intro }}</h2>
                    </div>
                </div>
                <div class="d-flex fxa-center ml-20">
                    <p class="text-right mr-10">
                        Suivi par {{ '332' }} personnes
                    </p>

                    <button-base :modifiers="['light']" icon-before="plus" :loading="isLoading" @click="onFollow" v-if="!this.isFollowed">
                        Suivre
                    </button-base>
                    <button-base icon-before="check" :loading="isLoading" @click="onFollow" v-else>
                        Suivi
                    </button-base>
                </div>
            </div>
            <div class="d-flex mt-60">
                <div class="fx-grow o-hidden">
                    <div>
                        <p class="ft-title-m mb-20">Événements à venir</p>

                        <block-gathering
                            v-for="gathering in gatherings.filter(g => !g.isPast)"
                            class="mt-20"
                            :status-only="true"
                            v-bind="gathering"
                            :key="gathering._id"
                        />
                    </div>

                    <div class="pv-20 br-s bg-bg mv-40">
                        <p class="ft-title-xs mb-20 ph-20">Sélection d'événements passés</p>

                        <slider-block
                            item-class="width-2xs"
                            :offset="20"
                        >
                            <div v-for="gathering in gatherings.filter(g => g.isPast)" :slot="gathering._id" :key="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
                                    v-bind="gathering"
                                />
                            </div>
                        </slider-block>
                    </div>
                </div>

                <div class="width-s fx-no-shrink ml-40">
                    <div class="bg-bg p-20 br-s">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrganizationPage',
    async fetch () {
        const response = await this.$store.dispatch('organization/get', {
            query: { slug: this.$route.params.slug }
        })

        if (response) {
            await this.$store.dispatch('gathering/fetch', {
                query: {
                    organization: response._id
                }
            })
        }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        orga () {
            return this.$store.getters['organization/findOne']({
                slug: this.$route.params.slug
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                organization: { '$id': this.orga._id }
            })
        },
        isFollowed () {
            return this.user.followed.includes(this.orga._id)
        }
    },
    methods: {
        async onFollow () {
            this.isLoading = true 

            await this.$store.dispatch('user/update', {
                followed: this.isFollowed ? { $pull: this.orga._id } : { $addToSet: this.orga._id }
            })

            setTimeout(() => this.isLoading = false, 100)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Orga_cover {
        background-size: cover;
        background-position: center;

        &::before {
            content: "";
            display: block;
            @include ratio(33);
        }
    }
</style>