<template>
    <div class="pb-40">
        <div class="Wrapper Wrapper--s pv-100">
            <p class="ft-title-m mb-20">Ma constellation</p>

            <div class="row-xs" v-if="constellation.length > 0">
                <div class="col-2 col-3@s col-4@xs mt-10" v-for="user in constellation" :key="user._id">
                    <user-profile v-bind="user" />
                </div>
            </div>
            <div class="bg-bg-xstrong p-30 text-center br-s" v-else>
                <fa icon="far fa-sparkles" class="ft-xl color-ft-xweak line-1"></fa>

                <p class="mt-10 mb-20 line-1">Il n'y a encore personne dans ta constellation.</p>

                <button-base :modifiers="['light']" :to="{ name: 'g' }">
                    Participer à un événement
                </button-base>
                
                <div class="mt-5">
                    <link-base :to="{ name: 'faq' }">C'est quoi une constellation ?</link-base>
                </div>
            </div>

            <div class="mt-40 p-20 bg-bg-weak br-s" v-if="extended.length > 0">
                <p class="ft-title-xs mb-5">Constellation étendue</p>
                <p class="mb-20">Ces personnes font partie de la constellation d'au moins 2 personnes de ta constellation.</p>

                <div class="row-xs">
                    <div class="col-3 col-4@s col-6@xs mt-10" v-for="user in extended" :key="user._id">
                        <user-icon :display-name="true" v-bind="user" />
                    </div>
                </div>
            </div>

            <div class="mt-40 p-20 bg-bg-weak br-s">
                <p class="ft-title-xs mb-5">Connaissances</p>
                <p class="mb-20">Tu as rencontré ces personnes lors d'un rassemblement.</p>

                <div class="row-xs" v-if="encounters.length > 0">
                    <div class="col-3 col-4@s col-6@xs mt-10" v-for="user in encounters" :key="user._id">
                        <user-icon :display-name="true" v-bind="user" />
                    </div>
                </div>
                <div class="bg-bg-strong p-30 text-center br-s" v-else>
                    <fa icon="far fa-hand-wave" class="ft-xl color-ft-xweak line-1"></fa>

                    <p class="mt-10 mb-20 line-1">Tu n'as pas encore fait de rencontres.</p>

                    <button-base :modifiers="['light']" :to="{ name: 'g' }">
                        Participer à un événement
                    </button-base>
                    
                    <div class="mt-5">
                        <link-base :to="{ name: 'faq' }">Comment faire des rencontres ?</link-base>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringsPast',
    middleware: 'onboarded',
    
    async fetch () {
        await this.$store.dispatch('user/fetch', {
            query: {}
        })
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        encounters () {
            return this.$store.getters['user/find']({
                isEncountered: true,
                _id: '$notSelf'
            }).filter(u => !this.constellation.find(b => b._id == u._id))
        },
        constellation () {
            return this.$store.getters['user/find']({
                isAffinity: true,
                _id: '$notSelf'
            })
        },
        extended () {
            let extended = {}

            if (this.constellation) {
                this.constellation.forEach(u => {
                    (u.constellation ? u.constellation : []).forEach(a => {
                        extended[a] = extended[a] ? extended[a] + 1 : 1
                    })
                })
                
                extended = Object.keys(extended).filter(u => u != this.user._id && extended[u] >= 2 && !this.constellation.find(a => a._id == u))
            } else {
                return []
            }

            return this.$store.getters['user/find']({
                _id: { $in: extended }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>