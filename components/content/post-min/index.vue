<template>
    <div>
        <nuxt-link :to="localePath(permaLink)" v-if="!isLoading && ownerData">
            <div class="PostMin" :class="[ $modifiers, { 'is-new': isNew } ]" ref="container" >
                <div class="PostMin_icon fx-no-shrink">
                    <user-icon class="PostMin_user" :modifiers="['m']" v-bind="ownerData" v-if="ownerData" />
                </div>
                
                <div class="pl-10 pr-20 fx-grow">
                    <div class="PostMin_text ellipsis-2" v-if="parsedContent">
                        <div v-html="$options.filters.specials(parsedContent)" ref="text"></div>
                    </div>

                    <div class="ft-xs color-ft-weak">
                        {{ $moment(createdAt).fromNow() }}
                    </div>
                </div>

                <content-reactions-min
                    :reactions="reactions"
                    class="ml-15"
                    v-if="reactions.length > 0"
                />
                
                <div class="PostMin_notif ml-15" v-if="isNew"></div>
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
        },
        lastVisit () {
            if (this.user && this.user.constellationData) {
                let constellationData = this.user.constellationData[this.constellation]

                if (constellationData && constellationData.lastVisit) {
                    return constellationData.lastVisit
                } else {
                    return this.$moment().subtract(1, 'months').toDate()
                }
            }

            return this.$moment().subtract(1, 'months').toDate()
        },
        isNew () {
            return this.$moment(this.createdAt).isAfter(this.$moment(this.lastVisit))
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
        padding: 10px 15px 10px 10px;
        @include shadow-s;
        transition: all 250ms ease;
        color: var(--color-ft-weak);
        
        &.is-new {
            color: var(--color-ft-light);
            background-color: var(--color-bg-xweak);

            .PostMin_notif {
                display: block;
            }
        }

        &:hover {
            transform: translateY(-2px);
            color: var(--color-ft-light);
            background-color: var(--color-cosmoz);
            @include shadow;
        }
    }

    .PostMin_main {
        position: relative;
    }

    .PostMin_notif {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(farthest-corner at top right, color-opacity('nebula', -50%), var(--color-cosmoz) 85%);
        flex-shrink: 0;
        @include shadow;
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
        flex-grow: 1;

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