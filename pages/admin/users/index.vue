<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="mb-10">
                    Total : {{ users.length }} inscrits
                </div>
                
                <div class="ft-m p-15 mv-10 bg-bg br-s" v-for="user in users" :key="user._id">
                    <div class="d-flex fxa-center">
                        <user-icon class="fx-no-shrink mr-10" v-bind="user" />

                        <div class="fx-grow">
                            <span class="ft-title-xs">{{ user.name }}</span> <span class="color-ft-weak">{{ user.email }}</span>

                            <div class="ft-m">
                                {{ user.encounters.length }} rencontres · {{ user.affinities.length }} affinités envoyées
                            </div>

                            <div class="ft-m-bold">
                                {{ user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').length }} inscriptions ({{ user.gatherings.filter(g => g.status == 'confirmed').length }} confirmées)

                                <span class="bg-bg-xstrong p-5" v-if="user.gatherings.filter(g => g.status == 'ghosted').length > 0">{{ user.gatherings.filter(g => g.status == 'ghosted').length }} no-show</span>
                            </div>
                        </div>

                        <div class="fx-no-shrink  ml-20">
                            <span class="mr-10">
                                {{ user.ref ? user.ref : 'Unknown' }}
                            </span>
                            <span class="mr-10" v-if="user.referral">
                                {{ user.referral }}
                            </span>
                            <span class="color-ft-weak">{{ $moment(user.createdAt).format('DD MMM hh:mm') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsletterPage',
    layout: 'admin',
    async fetch () {
        let response = await this.$store.dispatch('user/fetch')
    },
    data: () => ({
        data: []
    }),
    computed: {
        users () {
            return this.$store.getters['user/find']({
                sort: { createdAt: 'asc' },
                name: '$notNull'
            })
        }
    }
}
</script>