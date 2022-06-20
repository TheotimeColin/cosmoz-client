<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <div class="+mt-40">
            <h1 class="ft-title-s mb-20">
                Mes amis
            </h1>

            <div class="row-xs" v-if="constellation.length > 0">
                <div class="col-3 col-4@xs mt-10" v-for="user in constellation" :key="user._id">
                    <user-profile v-bind="user" />
                </div>
            </div>
            <div class="bg-bg-strong p-30 text-center br-s" v-else>
                <fa icon="far fa-user" class="ft-xl color-ft-xweak line-1"></fa>

                <p class="mt-10 mb-20 line-1">Il n'y a encore personne dans ta constellation.</p>
                
                <div class="mt-5">
                    <link-base :to="{ name: 'faq' }">C'est quoi une constellation ?</link-base>
                </div>
            </div>
        </div>

        <div class="+mt-40">
            <h1 class="ft-title-s mb-20">
                Mes groupes
            </h1>

            <div class="row-xs" v-if="constellation.length > 0">
                <div class="col-3 col-4@xs mt-10" v-for="user in constellation" :key="user._id">
                    <user-profile v-bind="user" />
                </div>
            </div>
            <div class="bg-bg-strong p-30 text-center br-s" v-else>
                <fa icon="far fa-sparkles" class="ft-xl color-ft-xweak line-1"></fa>

                <p class="mt-10 mb-20 line-1">Tu n'appartiens encore à aucun groupe.</p>

                <button-base :modifiers="['light']" :to="{ name: 'explore' }">
                    Trouver un groupe
                </button-base>
            </div>
        </div>

        <div class="+mt-40 block" v-if="pending.length > 0">
            <p class="ft-title-xs mb-5">Demandes en attente</p>
            <p class="ft-s color-ft-weak mb-20">Pour devenir amis sur Cosmoz, il faut que les deux personnes en fassent la demande.</p>

            <div class="fx-center p-10 bg-bg-xweak br-xs mt-5" v-for="user in pending" :key="user._id">
                <user-icon :display-name="true" v-bind="user" />

                <button-base icon-before="times" :modifiers="['round', 'xs']" @click="() => cancelRequest(user)" :loading="loading.includes(user._id)" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringsPast',
    middleware: ['loggedUser'],
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('user/fetch', {
            query: {}
        })
    },
    data: () => ({
        loading: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        encounters () {
            return this.$store.getters['user/find']({
                isEncountered: true,
                _id: '$notSelf'
            }).filter(u => !this.constellation.find(b => b._id == u._id))
        },
        pending () {
            return this.$store.getters['user/find']({
                _id: { $in: this.user.affinities.filter(id => !this.user.friends.includes(id)) }
            })
        },
        constellation () {
            return this.$store.getters['user/find']({
                isFriend: true,
                _id: '$notSelf'
            })
        }
    },
    methods: {
        async cancelRequest (user) {
            this.loading = [ ...this.loading, user._id ] 
            
            try {
                await this.$store.dispatch('user/cancelRequest', user)
            } catch (e) {
                console.error(e)
            }

            this.loading = this.loading.filter(id => id !== user._id) 
        }
    }
}
</script>