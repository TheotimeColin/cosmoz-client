<template>
    <div class="Page_wrapper Wrapper Wrapper--s" v-if="$constellation">
        <div class="pt-20 mb-30 bg-bg-weak br-s">
            <h2 class="ft-title-xs mb-20 mh-20">L'équipe</h2>
            <slider-block
                :slots="admins.map(u => u._id)"
                :ratio="150"
                :offset="$smallerThan('xs') ? 15 : 20"
                item-class="width-2xss"
            >
                <div v-for="user in admins" :slot="user._id" :key="user._id">
                    <user-profile v-bind="user" />
                </div>
            </slider-block>
        </div>

        <h2 class="ft-title-xs mb-10 mt-20">
            <span class="round-s bg-bg-strong mr-10">{{ users.filter(u => !admins.includes(u)).length }}</span>Membres
        </h2>
        <div class="row-xs">
            <div class="col-6 col-12@xs mt-10" v-for="user in users.filter(u => !admins.includes(u))" :key="user._id">
                <div class="block-r p-10">
                    <user-icon v-bind="user" :display-name="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    name: 'ConsteMembers',
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch () {
        await this.$preFetch()

        await this.$store.dispatch('user/softFetch', this.$constellation.members)
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        admins () {
            return this.$store.getters['user/find']({
                _id: { $in: [ ...this.$constellation.admins, ...this.$constellation.organizers ] }
            })
        },
        users () {
            return this.$store.getters['user/find']({
                _id: { $in: this.$constellation.members }
            })
        },
    },
    head () {
        if (!this.$constellation) return {}

        let meta = {
            title: `Membres de ${this.$constellation.name} ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>