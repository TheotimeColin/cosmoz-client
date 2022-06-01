<template>
    <div>
        <div class="p-20 bg-bg-weak br-s">
            <p>
                <fa icon="far fa-calendar" class="mr-5" /> {{ $moment(gathering.date).format('D MMMM YYYY à HH:mm') }}
            </p>
            <p class="mt-5">
                <fa icon="far fa-map-marker-alt" class="mr-5" /> {{ user ? gathering.location : `Information réservée aux membres` }}
            </p>

            <!-- <nuxt-link :to="localePath({ name: 'c-slug', params: { slug: gathering.constellation.slug }})" class="mt-20 d-flex c-pointer" v-if="gathering.constellation">
                <const-icon
                    v-bind="gathering.constellation"
                    :no-link="true"
                    :modifiers="['m']"
                />

                <div class="ml-15">
                    <p class="ft-s color-ft-weak">Organisé par</p>
                    <p class="ft-title-2xs">{{ gathering.constellation.name }}</p>
                </div>
            </nuxt-link> -->
        </div>

        <div class="p-20 bg-bg-weak mt-10 br-s p-sticky p-relative@s" style="--offset: 40px" v-if="!gathering.isPast">
            <div class="mb-5" v-if="usersByStatus(['attending', 'confirmed']).length > 0">
                <user-icon class="mr-5 mb-5" v-for="participant in usersByStatus(['attending', 'confirmed']).slice(0, 7)" :key="participant._id" v-bind="participant" />
            </div>
            
            <link-base @click="isList = true">
                <template v-if="usersByStatus(['attending', 'confirmed']).length > 3 && !hasBooked">
                    {{ attending }} et {{ usersByStatus(['attending', 'confirmed']).length - 2 }} autres participent
                </template>
                <template v-else>
                    {{ usersByStatus(['attending', 'confirmed']).length }} inscrits
                </template>
            </link-base>

            <div class="color-ft-weak ft-italic" v-if="usersByStatus('waiting').length > 0">{{ usersByStatus('waiting').length }} en liste d'attente</div>

            <div class="d-flex fxa-center mt-20" v-if="!hasConfirmed">
                <template v-if="user">
                    <button-base class="fx-grow is-disabled" :modifiers="['light']" v-if="hasWaitingList">
                        événement complet
                    </button-base>
                    <button-base class="fx-grow" :modifiers="['light']" :icon-before="hasBooked ? 'check' : 'clock'" @click="isManage = true" v-else-if="hasBooked || isWaiting">
                        {{ hasBooked ? `Inscription confirmée` : `En liste d'attente` }}
                    </button-base>
                    <button-base class="fx-grow" :modifiers="['light']" icon-before="arrow-right" @click="isManage = true" v-else>
                        {{ (hasWaitingList ? `Entrer en liste d'attente` : `Je m'inscris !`) }}
                    </button-base>
                </template>
                <template v-else>
                    <button-base class="fx-grow" :modifiers="['light']" icon-before="arrow-right" @click="$store.commit('page/register', `sub-${gathering._id}`)">
                        Je m'inscris !
                    </button-base>
                </template>
            </div>
        </div>

        <popin :is-active="isList" :modifiers="['s']" @close="isList = false">
            <template slot="content">
                <div class="p-30">
                    <p class="ft-title-s mb-15">Participations</p>

                    <div class="row-xs">
                        <div class="col-6 pt-10 col-12@xs" v-for="participant in usersByStatus(['attending', 'confirmed'])" :key="participant._id">
                            <user-icon :display-name="true" :modifiers="['m']" v-bind="participant" />
                        </div>
                    </div>
                </div>
            </template>
        </popin>

        <popin :is-active="isManage" :modifiers="['s']" @close="isManage = false">
            <template slot="content">
                <div class="text-center">
                    <div class="bg-cover p-60" :style="{ '--background': `url(${gathering.hero})` }">
                        <p class="ft-title-m ">{{ gathering.title }}</p>
                    </div>

                    <div class="p-30">
                        <template v-if="hasBooked">
                            <p>Ton inscription est confirmée. Rendez-vous {{ $moment(gathering.date).format('dddd DD MMMM YYYY à HH:mm') }} !</p>

                            <link-base class="mv-20" :href="googleCal" target="_blank">Ajouter à Google Calendar</link-base>
                            
                            <p class="p-10 bg-bg-weak  br-s">Tu as dû recevoir un email de confirmation. Vérifie tes spam !</p>
                        </template>
                        <template v-else>
                            Attention, pour conserver ton accès aux futures rencontres <span class="text-underline">n'oublie pas de te désincrire</span> si tu as un empêchement !
                        </template>
                        
                        <div>
                            <button-base class="mt-20" :class="{ 'is-loading': isLoading }" :modifiers="['light']" @click="onBookUpdate('attending')"
                            v-if="!hasBooked && !hasWaitingList">
                                Confirmer mon inscription
                            </button-base>
                            <div class="fx-center mt-20" v-else>
                                <button-base :class="{ 'is-loading': isLoading }" :modifiers="['s']" @click="() => { onBookUpdate('cancelled'); isManage = false }">
                                    Me désincrire
                                </button-base>

                                <button-base :modifiers="['light']" @click="isManage = false">
                                    Fermer
                                </button-base>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </popin>
    </div>
</template>

<script>
export default {
    name: 'PageGatheringManage',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        isLoading: false,
        isManage: false,
        isList: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        attending () {
            return this.$shuffle(this.usersByStatus(['attending', 'confirmed'])).slice(0, 2).map(u => u.name).join(', ')
        },
        hasBooked () {
            return this.user && this.usersByStatus(['attending']).find(u => u._id == this.user._id)
        },
        isWaiting () {
            return this.user && this.usersByStatus(['waiting']).find(u => u._id == this.user._id)
        },
        hasWaitingList () {
            return this.usersByStatus(['attending', 'confirmed']).length >= this.gathering.max
        },
        hasConfirmed () {
            return this.user && this.usersByStatus(['confirmed']).find(u => u._id == this.user._id) ? true : false
        },
        canonical () {
            return this.$config.baseUrl + this.localePath({ name: 'c-slug-events-id', params: { id: this.gathering.id, slug: this.gathering.constellation ? this.gathering.constellation.id : 'event' }})
        },
        googleCal () {
            return `http://www.google.com/calendar/event?action=TEMPLATE&sprop=name:${this.gathering.title}&sprop=website:${this.canonical}&text=${this.gathering.title}&details=${this.gathering.intro}+${this.canonical}&dates=${this.$moment(this.gathering.date).format()}`
        }
    },
    methods: {
        usersByStatus (statuses) {
            let users = Object.values(this.gathering.users.reduce((all, current) => ({
                ...all, [current._id]: current 
            }), {}))

            return users.filter(u => statuses.includes(u.status))
        },
        async onBookUpdate (status) {
            this.isLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: [
                        { _id: this.user._id, status: status }
                    ]
                })
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style>

</style>