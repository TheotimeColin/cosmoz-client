<template>
    <div class="NotifItem" :class="{ 'is-read': state == 'read' }">
        <div class="NotifItem_image" :style="{ backgroundImage: `url(${cover})` }"></div>
        <div>
            <div class="ellipsis-2" v-html="content"></div>
            <div class="ft-xs color-ft-xweak">{{ $moment(updatedAt).fromNow() }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Notifications',
    async fetch () {
        await this.$store.dispatch('user/softFetch', this.origins.filter(o => o.type == 'user').map(o => o._id))

        if (this.status) await this.$store.dispatch('status/softFetch', [ this.status ])

        if (this.gathering) await this.$store.dispatch('gathering/softFetch', [this.gathering])

        if (this.constellation) await this.$store.dispatch('constellation/softFetch', [ this.constellation ])
    },
    props: {
        state: { type: String },
        type: { type: String },
        status: { type: String },
        gathering: { type: String },
        constellation: { type: String },
        updatedAt: { type: String },
        origins: { type: Array, default: () => [] },
    },
    computed: {
        cover() {
            if (this.users[0]) return this.users[0].profileLarge
            if (this.gatherings[0]) return this.gatherings[0].hero
        },
        statusData () {
            if (!this.status) return null

            return this.$store.getters['status/findOne']({
                _id: this.status
            })
        },
        gatheringData() {
            if (!this.gathering) return null

            return this.$store.getters['gathering/findOne']({
                _id: this.gathering
            })
        },
        constellationData() {
            if (!this.constellation) return null

            return this.$store.getters['constellation/findOne']({
                _id: this.constellation
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                _id: { $in: this.origins.filter(o => o.type == 'gathering').map(o => o._id) }
            })
        },
        users () {
            return this.$store.getters['user/find']({
                _id: { $in: this.origins.filter(o => o.type == 'user').map(o => o._id) }
            })
        },
        content() {
            let count = this.users.length

            if (this.type.includes('event')) count = this.gatherings.length
            
            return this.$tc(`notifications.${this.type}.content`, count, {
                users: this.$pluralize(this.users.map(u => u.name)),
                status: this.statusData?.content,
                gathering: this.gatheringData?.title,
                constellation: this.constellationData?.name
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .NotifItem {
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 100ms ease;

        &.is-read {
            color: var(--color-ft-xweak);
            
            .NotifItem_image {
                opacity: 0.5;
            }
        }

        &:hover {
            color: var(--color-ft-light);
            background-color: var(--color-bg-weak);

            .NotifItem_image {
                opacity: 1;
            }
        }
    }

    .NotifItem_image {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
        border-radius: 50%;
        background-size: cover;
        margin-right: 15px;
        transition: all 100ms ease;
        opacity: 1;
    }
</style>