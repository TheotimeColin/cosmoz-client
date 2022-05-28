<template>
    <div>
        <div class="p-20 bg-bg br-s">
            <p>
                <fa icon="far fa-calendar" class="mr-5" /> {{ $moment(gathering.date).format('D MMMM YYYY à HH:mm') }}
            </p>
            <p class="mt-5">
                <fa icon="far fa-map-marker-alt" class="mr-5" /> {{ gathering.location }} {{ gathering.location }} {{ gathering.location }} {{ gathering.location }}
            </p>

            <nuxt-link :to="localePath({ name: 'o-slug', params: { slug: gathering.organization.slug }})" class="mt-20 d-flex c-pointer" v-if="gathering.organization">
                <orga-icon
                    v-bind="gathering.organization"
                    :no-link="true"
                    :modifiers="['m']"
                />

                <div class="ml-15">
                    <p class="ft-s color-ft-weak">Organisé par</p>
                    <p class="ft-title-2xs">{{ gathering.organization.name }}</p>
                </div>
            </nuxt-link>
        </div>

        <div class="p-20 bg-bg mt-10 br-s" v-if="hasBooked">
            <div class="d-flex fxa-center">
                <div class="width-3xs fx-no-shrink">
                    <qr-code :data="qr" />
                </div>
                <div class="ft-s ml-20">
                    Présente ce QR code à l'organisateur sur place.
                </div>
            </div>
        </div>

        <div class="p-20 bg-bg mt-10 br-s p-sticky p-relative@s" style="--offset: 40px" v-if="!gathering.isPast">
            <div class="mb-5" v-if="usersByStatus(['attending', 'confirmed']).length > 0">
                <user-icon class="mr-5 mb-5" v-for="participant in usersByStatus(['attending', 'confirmed'])" :key="participant._id" v-bind="participant" />
            </div>
        
            <template v-if="usersByStatus(['attending']).length > 3 && !hasBooked">
                {{ attending }} et {{ usersByStatus(['attending']).length - 3 }} autres participent !
            </template>
            <template v-else>
                {{ usersByStatus(['attending', 'confirmed']).length }} inscrits
            </template>

            <div class="color-ft-weak ft-italic" v-if="usersByStatus('waiting').length > 0">{{ usersByStatus('waiting').length }} en liste d'attente</div>

            <div class="d-flex fxa-center mt-20">
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
                            
                            <p class="p-10 bg-bg-weak br-s">Tu as dû recevoir un email avec le QR code à faire scanner sur place le jour J. Vérifie tes spam !</p>
                        </template>
                        <template v-else>
                            Attention, pour conserver ton futur accès aux événements <span class="text-underline">n'oublie pas de te désincrire</span> si tu as un empêchement !
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

        <popin :is-active="isAdminManage" @close="isAdminManage = false" v-if="user && user.role == 'admin'">
            <template slot="content">
                <form @submit.prevent="onManageSubmit" class="p-30">
                    <div class="mb-30" v-for="(status, i) in userStatuses" :key="i">
                        <p class="ft-title-2xs">{{ status.label }} <span class="round-s bg-bg ml-10">{{ status.users.length }}</span></p>

                        <div class="row-xs mt-10">
                            <div class="col-6 mt-10" v-for="user in status.users" :key="user._id">
                                <div class="d-flex fxa-center p-15 b">
                                    <div>
                                        <user-icon class="mr-10" v-bind="user" />
                                        {{ user.name }} 
                                    </div>
                                    <div class="fx-grow text-right">
                                        <button-base class="is-merlot" :modifiers="['round', 'current', 's']" icon-before="do-not-enter" @click.stop="onUserAttendance(user, 'ghosted')"/>

                                        <button-base class="is-tulip" :modifiers="['round', 'current', 's']" icon-before="times" @click.stop="onUserAttendance(user, 'cancelled')"/>

                                        <button-base class="is-alpine" :modifiers="['round', 'current', 's']" icon-before="check" @click.stop="onUserAttendance(user, 'confirmed')"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="text-right" v-if="userChanges.length > 0">
                        <button-base type="submit" :modifiers="['light']">
                            Confirmer les changements
                        </button-base>
                    </div>
                </form>
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
        isAdminManage: false,
        userChanges: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        attending () {
            return this.$shuffle(this.usersByStatus(['attending'])).slice(0, 3).map(u => u.name).join(', ')
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
            return this.$config.baseUrl + this.localePath({ name: 'o-slug-id', params: { id: this.gathering.id, slug: this.gathering.organization ? this.gathering.organization.id : 'event' }})
        },
        googleCal () {
            return `http://www.google.com/calendar/event?action=TEMPLATE&sprop=name:${this.gathering.title}&sprop=website:${this.canonical}&text=${this.gathering.title}&details=${this.gathering.intro}+${this.canonical}&dates=${this.$moment(this.gathering.date).format()}`
        },
        userStatuses () {
            return [
                { label: 'En attente', users: this.usersByStatus(['attending']) },
                { label: 'Confirmé', users: this.usersByStatus(['confirmed']) },
                { label: 'Annulé', users: this.usersByStatus(['cancelled']) },
                { label: 'Pas prévenu', users: this.usersByStatus(['ghosted']) },
                { label: `Liste d'attente`, users: this.usersByStatus(['waiting']) },
            ]
        },
        qr () {
            return this.$config.baseUrl + '/v/' + this.gathering.id + '?user=' + this.user.id
        }
    },
    methods: {
        usersByStatus (statuses) {
            let users = Object.values([ ...this.gathering.users, ...this.userChanges ].reduce((all, current) => ({
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
        },
        onUserAttendance (user, status) {
            this.userChanges = this.userChanges.filter(u => u._id != user._id)

            this.userChanges = [
                ...this.userChanges,
                { ...user, status }
            ]
        },
        async onManageSubmit () {
            this.isLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: this.userChanges.map(u => ({ _id: u._id, status: u.status }))
                })
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
            this.userChanges = []
        }
    }
}
</script>

<style>

</style>