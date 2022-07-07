<template>
    <div class="ImagesMin">
        <nuxt-link class="ImagesMin_main" :class="[ $modifiers ]" :to="localePath(permaLink)" v-if="!isLoading && ownerData">
            <img class="ImagesMin_img" :src="image">

            <content-reactions-min
                class="ImagesMin_reactions"
                :reactions="reactions"
                v-if="reactions.length > 0"
            />
        </nuxt-link>
        <div v-else>
            <placeholder class="ImagesMin_placeholder" :ratio="$randomBetween(40, 60)" />
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ImagesMin',
    mixins: [ ModifiersMixin, PostMixin ],
    async fetch () {
        await this.$store.dispatch('user/softFetch', [
            this.owner,
            ...this.reactions.map(r => r.owner),
            ...this.children.reduce((all, c) => [ ...all, c.owner, ...c.reactions.map(r => r.owner)], [])
        ])

        this.isLoading = false
    },
    props: {
        _id: { type: String },
        content: { type: String },
        read: { type: String },
        owner: { type: String },
        images: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        forbidden: { type: Array, default: () => [] },
        tags: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] },
        gathering: { type: String },
        constellation: { type: String },
        origin: { type: String },
        noLink: { type: Boolean, default: false },
    },
    data: () => ({
        isLoading: false,
    }),
    computed: {
        image () {
            return this.images[0].medias.find(m => m.size == 'm').src
        },
        parsedContent () {
            return this.content.replaceAll('<br>', ' ')
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 8 : 12
        }
    }
}
</script>

<style lang="scss" scoped>
    .ImagesMin {
        height: 100%;
    }

    .ImagesMin_reactions {
        position: absolute;
        bottom: 8px;
        left: 8px;
    }

    .ImagesMin_main {
        border-radius: 6px;
        overflow: hidden;
        background-color: var(--color-bg-xweak);
        display: flex;
        align-items: center;
        position: relative;
        @include shadow-s;
        transition: all 250ms ease;
        height: 100%;
    }

    .ImagesMin_img {
        height: 100%;
    }
</style>