<template>
    <div v-if="gathering">
        <app-banner :background="gathering.hero">
            <link-base class="mb-40" :to="{ path: localePath({ name: 'index' }) }" icon-before="long-arrow-left">Retour aux événements</link-base>

            <div>
                {{ gathering.title }}

                <p class="ft-l mt-10" v-if="gathering.intro">
                    {{ gathering.intro }}
                </p>
            </div>
        </app-banner>

        <div class="Wrapper">
            <div class="d-flex">
                <div class="fx-grow pt-30 pb-60">
                    <template v-if="gathering.isPast && usersByStatus(['confirmed']).find(u => u._id == user._id)">
                        <div class="p-20 b mb-30">
                            <p class="ft-title-xs mb-10">
                                Tu les as rencontrés <span class="ft-m color-ft-weak ml-5">{{ usersByStatus(['confirmed']).length }} participants</span>
                            </p>
                            
                            <div class="row-xs" v-if="!displayAll">
                                <div class="col-3 mt-10" v-for="(user, i) in usersByStatus(['confirmed']).filter(u => u._id != user._id).slice(0, 4)" :key="user._id">
                                    <user-profile v-bind="user" :no-link="true"  :gathering="gathering._id" :overlay=" i == 3 ? 'Afficher tout le monde' : ''" @click.native="() => i == 3 ? displayAll = true : selectedUser = user" />
                                </div>
                            </div>
                            <div class="row-xs" v-else>
                                <div class="col-4 mt-10" v-for="user in usersByStatus(['confirmed']).filter(u => u._id != user._id)" :key="user._id">
                                    <div class="d-flex fxa-center c-pointer" @click.prevent="selectedUser = user">
                                        <user-icon v-bind="user" 
                                        :modifiers="['m']" :no-link="true" :gathering="gathering._id" />

                                        <p class="ft-s subtitle ml-10">
                                            {{ user.name }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <user-popin-mention :selected-user="selectedUser" :gathering="gathering._id" @close="selectedUser = null" />
                    </template>
                    <template v-else-if="gathering.isPast && usersByStatus(['attending', 'waiting']).find(u => u._id == user._id)">
                        <div class="p-20 mb-30">
                            Présence non-confirmée
                        </div>
                    </template>
                    
                    <div class="Gathering_section mt-30" v-if="gathering.description && gathering.description != '<p></p>'">
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

                    <div class="p-20 bg-bg-strong mt-10 br-s" v-if="hasBooked">
                        <div class="d-flex fx-align-center">
                            <div class="width-3xs fx-no-shrink">
                                <qr-code :data="qr" />
                            </div>
                            <div class="ft-s ml-20">
                                Présente ce QR code à l'organisateur sur place.
                            </div>
                        </div>
                    </div>

                    <div class="p-20 bg-bg-strong mt-10 br-s p-sticky" style="--offset: 40px" v-if="!gathering.isPast">
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

                        <div class="d-flex fx-align-center mt-20">
                            <button-base class="fx-grow is-disabled" :modifiers="['light']" v-if="hasWaitingList">
                                événement complet
                            </button-base>
                            <button-base class="fx-grow" :modifiers="['light']" :icon-before="hasBooked ? 'check' : 'clock'" @click="isManage = true" v-else-if="hasBooked || isWaiting">
                                {{ hasBooked ? `Inscription confirmée` : `En liste d'attente` }}
                            </button-base>
                            <button-base class="fx-grow" :modifiers="['light']" icon-before="arrow-right" @click="isManage = true" v-else>
                                {{ (hasWaitingList ? `Entrer en liste d'attente` : `Je m'inscris !`) }}
                            </button-base>
                        </div>
                    </div>
                    
                    <div class="text-center mt-5">
                        <link-base @click="isAdminManage = true" v-if="user.role == 'admin'">Gestion des inscriptions</link-base>
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
                            <p>Ton inscription est confirmée. Rendez-vous {{ $moment(gathering.date).format('dddd DD MMMM YYYY à HH:mm') }} !</p>

                            <link-base class="mv-20" :href="googleCal" target="_blank">Ajouter à Google Calendar</link-base>
                            
                            <p class="p-10 bg-bg-weak br-s">Tu as dû recevoir un email avec le QR code à faire scanner sur place le jour J. Vérifie tes spam !</p>
                        </template>
                        <template v-else>
                            Attention, pour conserver ton futur accès aux événements <span class="text-underline">n'oublie pas de te désincrire</span> si tu as un empêchement !
                        </template>
                        
                        <div>
                            <button-base class="mt-20" :modifiers="['light']" @click="onBookUpdate('attending')" v-if="!hasBooked && !hasWaitingList">
                                Confirmer mon inscription
                            </button-base>
                            <button-base class="mt-20" :modifiers="['s']" @click="onBookUpdate('cancelled')" v-else>
                                Me désincrire
                            </button-base>
                        </div>
                    </div>
                </div>
            </template>
        </popin-base>

        <popin-base :is-active="isAdminManage" @close="isAdminManage = false" v-if="user.role == 'admin'">
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
                                        <button-base class="is-merlot" :modifiers="['round', 'current', 's']" icon-before="do-not-enter" @click="onUserAttendance(user, 'ghosted')"/>

                                        <button-base class="is-tulip" :modifiers="['round', 'current', 's']" icon-before="times" @click="onUserAttendance(user, 'cancelled')"/>


                                        <button-base class="is-alpine" :modifiers="['round', 'current', 's']" icon-before="check" @click="onUserAttendance(user, 'confirmed')"/>
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
        isManage: false,
        isAdminManage: false,
        selectedUser: null,
        displayAll: false,
        userChanges: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.id
            })
        },
        attending () {
            return this.$shuffle(this.usersByStatus(['attending'])).slice(0, 3).map(u => u.name).join(', ')
        },
        updatedDate () {
            return this.gathering.createdAt.isSame(this.gathering.updatedAt) ? null : this.gathering.updatedAt.format('DD MMM YYYY')
        },
        createdDate () {
            return this.gathering.createdAt.format('DD MMM YYYY')
        },
        hasBooked () {
            return this.usersByStatus(['attending']).find(u => u._id == this.user._id)
        },
        isWaiting () {
            return this.usersByStatus(['waiting']).find(u => u._id == this.user._id)
        },
        hasWaitingList () {
            return this.usersByStatus(['attending', 'confirmed']).length >= this.gathering.max
        },
        canonical () {
            return this.$config.appUrl + this.localePath({ name: 'g-id', params: { id: this.gathering.id }})
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
            return this.$config.appUrl + '/v/' + this.gathering.id + '?user=' + this.user.id
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
            await this.$store.dispatch('gathering/updateBookStatus', {
                _id: this.gathering._id,
                users: [
                    { _id: this.user._id, status: status }
                ]
            })
        },
        onUserAttendance (user, status) {
            this.userChanges = this.userChanges.filter(u => u._id != user._id)

            this.userChanges = [
                ...this.userChanges,
                { ...user, status }
            ]
        },
        async onManageSubmit () {
            await this.$store.dispatch('gathering/updateBookStatus', {
                _id: this.gathering._id,
                users: this.userChanges.map(u => ({ _id: u._id, status: u.status }))
            })

            this.userChanges = []
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