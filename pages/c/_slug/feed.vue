<template>
    <div class="page" v-if="!isLoading">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <div class="block-cosmoz-r mb-15 mb-10@xs" v-if="!$store.getters['user/notif']('introduced', $constellation._id)">
                <p class="ft-title-xs">Bienvenue dans la communauté 👋</p>
                <p class="mt-10">Prends quelques instants pour te présenter aux autres membres !</p>

                <button-base class="mt-15" :modifiers="['cosmoz']" icon-before="plus" @click="openEditor">
                    Je me présente
                </button-base>
            </div>

            <content-feed
                :constellation="$constellation._id"
                :disable-create="!$isConsteMember"
                @introduced="onIntroduced"
                read="g-member"
                ref="feed"
            />
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'
import PermissionsMixin from '@/mixins/permissions'

export default {
    mixins: [ ConstellationMixin, PermissionsMixin ],
    layout: 'app',
    async fetch () {
        this.isLoading = true

        await this.$preFetch()

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    methods: {
        openEditor () {
            if (this.$refs.feed) this.$refs.feed.openEditor({
                tags: ['présentations']
            })
        },
        onIntroduced () {
            if (this.user && !this.$store.getters['user/notif']('introduced', this.$constellation._id)) {
                this.$store.dispatch('user/updateNotification', { id: 'introduced', type: this.$constellation._id })
            }
        }
    }
}
</script>