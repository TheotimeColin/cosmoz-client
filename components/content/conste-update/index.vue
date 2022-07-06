<template>
    <div class="ConsteUpdate" v-if="constellation">
        <div class="pt-20 ph-20 fx-center">
            <const-icon v-bind="constellation" :display-name="true">
            </const-icon>

            <button-base :modifiers="['s']" class="ml-15"  icon-after="arrow-right" :to="{ name: 'c-slug-discussions', params: { slug: constellation.slug } }">
                Voir tout
            </button-base>
        </div>

        <p class="ph-20 mt-15 ft-m" v-if="getNewPosts() > 0">{{ getNewPosts() }} nouvelles publications 🔥</p>

        <div class="p-20" v-if="statuses.posts && statuses.posts.length > 0">
            <div class="+mt-10" v-for="post in statuses.posts.slice(0, 3)" :key="post._id">
                <content-post-min
                    v-bind="post"
                    :modifiers="['weak']"
                    :no-footer="true"
                    :key="post._id"
                />
            </div>
        </div>

        <template v-if="statuses.photos && statuses.photos.length > 0">
            <slider-block :class="{ 'mt-20': !statuses.posts || statuses.posts.length <= 0 }" :slots="statuses.photos.map(p => p._id).slice(0, 6)" :offset="20" :offset-v="20" :height="175" :margin="10">
                <content-images-min v-for="photos in statuses.photos.slice(0, 6)" :slot="photos._id" :key="photos._id" v-bind="photos" />
            </slider-block>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ContentConsteUpdate',
    props: {
        startDate: { type: [String, Date] },
        endDate: { type: [String, Date] },
        constellation: { type: Object },
        statuses: { type: Object }
    },
    methods: {
        getNewPosts () {
            let query = {
                parent: '$null',
                constellation: this.constellation._id,
                createdAt: { $and: [
                    { $gte: this.startDate },
                    { $lte: this.endDate },
                ] }
            }

            if (this.user && this.user.constellationData) {
                let constellationData = this.user.constellationData[this.constellation._id]

                if (constellationData && constellationData.lastVisit) {
                    query.createdAt.$and = [
                        ...query.createdAt.$and,
                        { $gte: constellationData.lastVisit }
                    ]
                }
            }

            return this.$store.getters['status/find']({
                ...query
            }).length
        }
    }
}
</script>

<style lang="scss" scoped>
.ConsteUpdate {
    border-radius: 10px;
    background-color: var(--color-bg-weak);
    position: relative;
    @include shadow-s;
}

@include breakpoint-xs {

    .ConsteUpdate {
        margin-left: -20px;
        margin-right: -20px;
        border-radius: 0;
    }
}
</style>