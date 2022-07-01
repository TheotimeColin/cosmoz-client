<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="mb-10">
                    Total : {{ users.length }} inscrits
                </div>
                
                <div class="ft-m p-15 mv-10 bg-bg-weak br-s" v-for="user in users" :key="user._id">
                    <div class="d-flex fxa-center +mt-10">
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
                        <div class="fx-no-shrink ml-20">
                            <span>{{ user.id }}</span>
                            <span class="color-ft-weak">{{ $moment(user.createdAt).format('DD MMM hh:mm') }}</span>
                        </div>
                    </div>
                    <div class="p-10 bg-bg-strong +mt-10" v-if="user.friends.length > 0">
                        Amis
                        <div class="row-xs">
                            <div class="col-6 p-5" v-for="friend in user.friends" :key="friend._id">
                                <user-icon :display-name="true" v-bind="$getUser(friend)" />
                            </div>
                        </div>
                    </div>
                    <div class="p-10 bg-bg-strong +mt-10" v-if="user.affinities.length > 0">
                        Demandes envoyées
                        <div class="row-xs">
                            <div class="col-6 p-5" v-for="affinity in user.affinities" :key="affinity._id">
                                <user-icon :display-name="true" v-bind="$getUser(affinity)" />
                            </div>
                        </div>
                    </div>
                    <div class="p-10 bg-bg-strong +mt-10" v-if="$store.getters['mention/find']({ owner: user._id }).length > 0">
                        Mentions envoyées

                        <div class="mt-5" v-for="mention in $store.getters['mention/find']({ owner: user._id })" :key="mention._id">
                            <span class="tape tape-s ft-xs-bold">{{ mention.type }}</span> {{ $getUser(mention.target).name }} @{{ $getUser(mention.target).id }}
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
        await this.$store.dispatch('user/fetch')
        await this.$store.dispatch('mention/fetch')
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
        },
        mentions () {
            return this.$store.getters['mention/find']({
                sort: { createdAt: 'asc' }
            })
        },
    },
}
</script>