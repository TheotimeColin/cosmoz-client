<template>
    <div>
        <nuxt-link :to="localePath(permaLink)" v-if="!isLoading && ownerData">
            <div class="PostMin" :class="[ $modifiers ]" ref="container" >
                <div class="PostMin_icon fx-no-shrink">
                    <user-icon class="PostMin_user" :modifiers="['']" v-bind="ownerData" v-if="ownerData" />
                </div>
                
                <div class="PostMin_text ellipsis-2" v-if="parsedContent">
                    <div v-html="$options.filters.specials(parsedContent)" ref="text"></div>
                </div>

                <content-reactions-min
                    :reactions="reactions"
                    v-if="reactions.length > 0"
                />
            </div>
        </nuxt-link>
        <div v-else>
            <placeholder class="PostMin_placeholder" :ratio="$randomBetween(40, 60)" />
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'PostMin',
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
    .PostMin {
        border-radius: 6px;
        background-color: var(--color-bg-xweak);
        display: flex;
        align-items: center;
        position: relative;
        padding: 10px;
        @include shadow-s;
        transition: all 250ms ease;
        
        &:hover {
            transform: translateY(-2px);
            background-color: var(--color-cosmoz);
            @include shadow;
        }
    }

    .PostMin_main {
        position: relative;
    }

    .PostMin_block.PostMin_reactions {
        position: relative;
        z-index: 5;
        margin: 0;
        padding: 0 20% 0 15px;
        background-color: var(--color-bg-weak);
        margin-top: 20px;
    }

    .PostMin_text {
        font: var(--ft-m);
        padding: 0 20px 0 10px;

        a {
            text-decoration: underline;

            &:hover {
                text-decoration: none;
            }
        }
    }

    .PostMin_head {
        padding: 15px 15px 20px;
        position: relative;
    }

    .PostMin_icon {
        display: block;
        flex-shrink: 0;
        flex-grow: 0;
        position: relative;
    }

    .PostMin_conste {
        position: absolute;
        bottom: -5px;
        right: -5px;
        border-radius: 50%;
        border: 2px solid var(--color-bg-weak);
    }

    .PostMin_gathering {
        width: 25px;
        height: 25px;
        position: absolute;
        bottom: -8px;
        right: -5px;
        border-radius: 4px;
        background-size: cover;
        background-position: center;
    }
</style>