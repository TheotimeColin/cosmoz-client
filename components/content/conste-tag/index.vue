<template>
    <div class="ConsteTag">
        <div class="pt-20 ph-20 fx-center">
            <div v-if="hashtag">
                <span class="color-ft-weak">Publications dans</span> <link-base :invert="true" :modifiers="['l']" :to="{ name: 'c-slug-discussions-tag-tagId', params: { slug: $constellation.slug, tagId: hashtag } }">#{{ hashtag }}</link-base>
            </div>
            <div v-else>
                <link-base :invert="true" :modifiers="['l']" :to="{ name: 'c-slug-discussions', params: { slug: $constellation.slug } }">
                    Dernières publications
                </link-base>
            </div>
            
        </div>

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
import ConstellationMixin from '@/mixins/constellation'

export default {
    name: 'ContentConsteTag',
    mixins: [ ConstellationMixin ],
    props: {
        hashtag: { type: String },
        statuses: { type: Object }
    }
}
</script>

<style lang="scss" scoped>
.ConsteTag {
    border-radius: 10px;
    background-color: var(--color-bg-weak);
    position: relative;
    @include shadow-s;
}


@include breakpoint-xs {

    .ConsteTag {
        margin-left: -20px;
        margin-right: -20px;
        border-radius: 0;
    }
}
</style>