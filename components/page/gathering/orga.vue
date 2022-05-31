<template>
    <div>
        <div class="p-20 bg-bg-weak mt-10 br-s">
            <div class="d-flex fxa-center d-block@xs">
                <div class="width-3xs fx-no-shrink m-auto mb-20@xs width-2xs@xs">
                    <qr-code :data="qr" />
                </div>
                <div class="ft-l ml-20 ml-0@xs text-center@xs">
                    Les personnes qui scannent ce QR auront confirmé leur présence automatiquement.
                </div>
            </div>
        </div>

        <p class="ft-title-s mt-40 mb-20">Participants</p>
        <form @submit.prevent="onManageSubmit">
            <transition-group name="fade">
                <div class="mb-30" v-for="status in userStatuses.filter(s => s.users.length > 0)" :key="status.id">
                    <div class="d-flex fxa-center" v-if="status.label">
                        <fa :icon="`far fa-${status.fa}`" class="mr-10" />
                        <p class="ft-title-2xs">{{ status.label }} <span class="round-s bg-bg-weak ml-10">{{ status.users.length }}</span></p>
                    </div>

                    <div class="d-flex fxa-center p-15 bg-bg-weak br-s o-hidden mt-10 d-block@s p-0@s" v-for="user in status.users" :key="user._id">
                        <div class="p-15@s">
                            <user-icon class="mr-10" :display-name="true" v-bind="user" />
                        </div>
                        <div class="fx-grow text-right p-15@s bg-bg-xstrong@s">
                            <button-base type="button" class="ml-3" :modifiers="['round', 'weak', 'xs']" icon-before="rotate-right" @click.stop="onUserAttendance(user, 'attending')" @mouseenter.native="(e) => $tOpen(`Réinitialiser le statut de cette personne.`, e)" @mouseleave.native="$tClose" v-if="status.id != 'attending'" />

                            <button-base type="button" class="ml-3" :modifiers="['round', 'light', 'xs']" icon-before="ghost" @click.stop="onUserAttendance(user, 'ghosted')" @mouseenter.native="(e) => $tOpen(`Cette personne n'est pas venue et n'a pas prévenu. Son taux de participation sera pénalisé.`, e)" @mouseleave.native="$tClose" v-if="status.id != 'ghosted'"/>

                            <button-base type="button" class="ml-3" :modifiers="['round', 'light', 'xs']" icon-before="times" @click.stop="onUserAttendance(user, 'cancelled')" @mouseenter.native="(e) => $tOpen(`Cette personne m'a prévenu qu'elle ne viendrait pas.`, e)" @mouseleave.native="$tClose" v-if="status.id != 'cancelled'"/>

                            <button-base type="button" class="ml-3" :modifiers="[ 'light']" icon-before="check" @click.stop="onUserAttendance(user, 'confirmed')" @mouseenter.native="(e) => $tOpen(`Cette personne est bien venue à l'événement.`, e)" @mouseleave.native="$tClose" v-if="status.id != 'confirmed'">
                                A participé
                            </button-base>
                        </div>
                    </div>
                </div>
            </transition-group>

            <div class="text-right" v-if="userChanges.length > 0">
                <button-base type="submit" :modifiers="['light']" :loading="isLoading">
                    Confirmer les changements
                </button-base>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'PageGatheringOrga',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        isLoading: false,
        userChanges: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        qr () {
            return this.$config.baseUrl + '/v/' + this.gathering._id
        },
        userStatuses () {
            return [
                { id: 'attending', users: this.usersByStatus(['attending']) },
                { id: 'confirmed', label: 'Confirmé', fa: 'check', users: this.usersByStatus(['confirmed']) },
                { id: 'cancelled', label: 'Annulé', fa: 'times', users: this.usersByStatus(['cancelled']) },
                { id: 'ghosted', label: 'Pas prévenu', fa: 'ghost', users: this.usersByStatus(['ghosted']) }
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

