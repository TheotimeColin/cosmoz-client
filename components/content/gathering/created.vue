<template>
    <div class="GatheringCreated Post" :class="[]">
        <content-post-head
            v-bind="$props"
            :title="type != 'official' ? title : false"
            :is-constellation="type == 'official'"
        />

        <div class="ph-15 pb-15 ph-0@xs">
            <block-gathering
                v-bind="$props"
                :modifiers="['weak']"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContentGatheringEnd',
    props: {
        _id: { type: String },
        id: { type: String },
        type: { type: String },
        title: { type: String },
        hero: { type: String },
        date: { type: String },
        owner: { type: String },
        date: { type: String },
        cover: { type: Array, default: () => [] },
        createdAt: { type: String },
        constellation: { type: String },
        users: { type: Array, default: () => [] }
    },
    data: () => ({
        selectedUser: null
    }),
    computed: {
        constellationData () {
            return this.$store.getters['constellation/findOne']({
                _id: this.constellation
            })
        },
        attendedUsers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.users.filter(u => u.status == 'confirmed' || u.status == 'attending').map(u => u._id) }
            }).filter(u => u && u._id != this.user._id)
        }
    }
}
</script>

<style lang="scss" scoped>
.GatheringCreated {
    overflow: hidden;
}

.GatheringCreated_cover {
    @include ratio(40);
    background-size: cover;
    background-position: center;
    position: relative;
    background-color: var(--color-bg-strong);
}

.GatheringCreated_coverTitle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>