<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <nav-bar class="mb-20" v-model="type" :weak="true" :items="[
            { id: 'index', label: 'À venir' },
            { id: 'ideas', label: 'Date à choisir' },
            { id: 'past', label: 'Passés' },
        ]" />
        
        <template v-if="gatherings.length > 0">
            <div class="Date" v-for="gathering in gatherings" :key="gathering._id">
                <placeholder :ratio="40" v-if="isLoading" />

                <block-gathering
                    v-show="!isLoading"
                    v-bind="gathering"
                    :display-intro="true"
                />
            </div>
        </template>
        <div class="bg-bg-strong p-30 text-center br-s" v-else>
            <fa icon="far fa-calendar-xmark" class="ft-xl color-ft-x$weak line-1"></fa>

            <p class="mt-10 mb-20 line-1">Tu n'as encore rien de prévu !</p>

            <button-base :modifiers="['light', 's']" icon-before="compass" :to="{ name: 'explore' }">
                Trouver des sorties
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: ['loggedUser'],
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('gathering/softFetch', [
            ...this.user.gatherings.map(g => g._id)
        ])

        this.isLoading = false
    },
    data: () => ({
        type: 'index',
        isLoading: true,
        format: 'YYYYDDD'
    }),
    computed: {
        gatherings () {
            let query = {
                isPast: false,
                isNoDate: false,
                sort: { date: 'desc'}
            }

            if (this.type == 'past') query = {
                isPast: true,
                isNoDate: false,
                sort: { date: 'asc' }
            }

            if (this.type == 'ideas') query = {
                isNoDate: true
            }

            return this.$store.getters['gathering/find']({
                status: 'active',
                isAttending: true,
                ...query
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.Date {

    & + & {
        margin-top: 10px;
    }
}
</style>