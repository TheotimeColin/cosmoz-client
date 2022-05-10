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
                        <div class="mb-5" v-if="usersByStatus(['attending', 'confirmed']).length > 0">
                            <user-icon class="mr-5 mb-5" v-for="user in usersByStatus(['attending', 'confirmed'])" :key="user._id" v-bind="user" />
                        </div>
                    
                        <template v-if="usersByStatus(['attending']).length > 3 && !hasBooked">
                            {{ attending }} et {{ usersByStatus(['attending']).length - 3 }} autres participent !
                        </template>
                        <template v-else>
                            {{ usersByStatus(['attending', 'confirmed']).length }} inscrits
                        </template>

                        <div class="color-ft-weak ft-italic" v-if="usersByStatus('waiting').length > 0">{{ usersByStatus('waiting').length }} en liste d'attente</div>

                        <div class="d-flex fx-align-center mt-20">
                            <!-- <button-base :modifiers="['s']" class="mr-5" v-if="!hasBooked">
                                Peut-être
                            </button-base> -->

                            <button-base class="fx-grow is-disabled" :modifiers="['light']" v-if="gathering.isPast">
                                Evénement terminé
                            </button-base>
                            <button-base class="fx-grow is-disabled" :modifiers="['light']" v-else-if="hasWaitingList">
                                Evénement complet
                            </button-base>
                            <button-base class="fx-grow" :modifiers="['light']" :icon-before="hasBooked ? 'check' : 'clock'" @click="isManage = true" v-else-if="hasBooked || isWaiting">
                                {{ hasBooked ? `Inscription confirmée` : `En liste d'attente` }}
                            </button-base>
                            <button-base class="fx-grow" :modifiers="['light']" icon-before="arrow-right" @click="isManage = true" v-else>
                                {{ (hasWaitingList ? `Entrer en liste d'attente` : `Je m'inscris !`) }}
                            </button-base>
                        </div>

                        <div class="text-center mt-5">
                            <link-base @click="isAdminManage = true" v-if="user.role == 'admin'">Gestion des inscriptions</link-base>
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
                        <template v-else>
                            Attention
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
        userChanges: []
    }),
    computed: {
        user () { return this.$store.state.auth.user },
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

            this.isManage = false
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