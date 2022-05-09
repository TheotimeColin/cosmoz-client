<template>
    <div v-if="gathering">
        <app-banner :background="gathering.hero">
            {{ gathering.title }}

            <p class="ft-l mt-10" v-if="gathering.intro">
                {{ gathering.intro }}
            </p>
        </app-banner>

        <div class="Wrapper">
            <div class="d-flex">
                <div class="fx-grow pt-30 pv-60">
                    <div class="Gathering_section" v-if="gathering.description && gathering.description != '<p></p>'">
                        <h2 class="ft-title-s mb-15">Détails</h2>
                        <text-body :modifiers="['gathering']" :value="gathering.description" />
                    </div>

                    <div class="Gathering_section" v-if="gathering.venue && gathering.venue != '<p></p>'">
                        <h2 class="ft-title-s mb-15">À propos du lieu</h2>
                        <text-body :modifiers="['gathering']" :value="gathering.venue" />
                    </div>

                    <div class="Gathering_section p-20 bg-bg-strong" v-if="gathering.important && gathering.important != '<p></p>'">
                        <h2 class="ft-title-xs mb-15 tape">Important</h2>
                        <text-body :modifiers="['gathering']" :value="gathering.important" />
                    </div>

                    <div class="Gathering_section" v-if="gathering.information && gathering.information != '<p></p>'">
                        <h2 class="ft-title-s mb-15">Informations pratiques</h2>
                        <text-body :modifiers="['gathering']" :value="gathering.information" />
                    </div>
                </div>
                <div class="width-s fx-no-shrink mt-30 ml-40">
                    <div class="p-20 bg-bg-strong br-s">
                        <p>
                            <i class="fal fa-calendar mr-5"></i> {{ $moment(gathering.date).format('D MMMM YYYY à HH:mm') }}
                        </p>
                        <p class="mt-5">
                            <i class="fal fa-map-marker-alt mr-5"></i> {{ gathering.location }}
                        </p>
                    </div>
                    <div class="p-20 bg-bg-strong mt-10 p-sticky" style="--offset: 40px">
                        {{ gathering.attending.length }} inscrits

                        <div class="d-flex fx-align-center mt-10">
                            <!-- <button-base :modifiers="['s']" class="mr-5" v-if="!hasBooked">
                                Peut-être
                            </button-base> -->

                            <button-base class="fx-grow" :modifiers="['light']" :icon-before="hasBooked ? 'check' : 'arrow-right'" @click="isManage = true">
                                {{ hasBooked ? `Inscription confirmée` : `Je m'inscris !` }}
                            </button-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <popin-base :is-active="isManage" :modifiers="['s']" @close="isManage = false">
            <template slot="content">
                <div class="text-center">
                    <div class="bg-cover p-60" :style="{ '--background': `url(${gathering.hero})` }">
                        <p class="ft-title-m ">{{ gathering.title }}</p>
                    </div>

                    <div class="p-30">
                        <template v-if="hasBooked">
                            <p>Ton inscription est confirmée !</p>

                            <link-base :href="googleCal" target="_blank">Ajouter à Google Calendar</link-base>
                        </template>
                        
                        <div>
                            <button-base class="mt-20" :modifiers="['light']" @click="onBook" v-if="!hasBooked">
                                Confirmer mon inscription
                            </button-base>
                            <button-base class="mt-20" :modifiers="['s']" @click="onCancelBook" v-else>
                                Me désincrire
                            </button-base>
                        </div>
                    </div>
                </div>
            </template>
        </popin-base>
    </div>
</template>

<script>
export default {
    name: 'GatheringPage',
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.id }})
    },
    data: () => ({
        isManage: false
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.id
            })
        },
        updatedDate () {
            return this.gathering.createdAt.isSame(this.gathering.updatedAt) ? null : this.gathering.updatedAt.format('DD MMM YYYY')
        },
        createdDate () {
            return this.gathering.createdAt.format('DD MMM YYYY')
        },
        hasBooked () {
            return this.gathering.attending.includes(this.user._id)
        },
        canonical () {
            return this.$config.appUrl + this.localePath({ name: 'g-id', params: { id: this.gathering.id }})
        },
        googleCal () {
            return `http://www.google.com/calendar/event?action=TEMPLATE&sprop=name:${this.gathering.title}&sprop=website:${this.canonical}&text=${this.gathering.title}&details=${this.gathering.intro}+${this.canonical}&dates=${this.$moment(this.gathering.date).format()}`
        }
    },
    methods: {
        async onBook () {
            await this.$store.dispatch('gathering/book', this.gathering._id)
        },
        async onCancelBook () {
            await this.$store.dispatch('gathering/cancelBook', this.gathering._id)

            this.isManage = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Gathering_section {

    & + & {
        margin-top: 40px;
    }
}
</style>