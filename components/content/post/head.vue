<<template>
    <div class="Post_head">
        <div class="d-flex fxa-center fx-grow">
            <div class="Post_icon fx-no-shrink" @click.stop>
                <user-icon class="Post_user" :modifiers="['m']" v-bind="ownerData"  v-if="ownerData" />

                <const-icon class="Post_conste" v-bind="consteData" :modifiers="['xs']" v-if="consteData" />
            </div>

            <div class="ml-10 ft-xs line-1 fx-grow" @click.stop>
                <component :is="titleLink ? 'nuxt-link' : 'div'" :to="titleLink" class="ft-title-2xs subtitle">
                    {{ title }}
                </component>

                <template v-if="parentData">
                    <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                    <link-base :to="consteData ? { name: 'c-slug-,postId', params: { slug: consteData.slug, postId: parentData._id } } : { name: 'post-postId', params: { postId: parentData._id } }" :modifiers="['l']">
                        {{ $ellipsis(parentData.content, 40) }}
                    </link-base>
                </template>
                <template v-else-if="gatheringData && !isCurrent">
                    <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                    <link-base :to="gatheringLink" :modifiers="['l']">
                        {{ $ellipsis(gatheringData.title, 40) }}
                    </link-base>
                </template>
                <template v-else-if="consteData && !isCurrent">
                    <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                    <link-base :to="gatheringLink" :modifiers="['l']">
                        {{ $ellipsis(consteData.name, 40) }}
                    </link-base>
                </template>

                <div class="color-ft-weak mt-5 ellipsis-1 ellipsis-break" v-if="ownerData">
                    @{{ ownerData.id }} · {{ subtitle }}
                </div>
            </div>

            <quick-menu
                class="ml-10"
                :button="{ modifiers: ['s', 'xweak'] }"
                :items="actions"
            />
        </div>

        <content-reaction-popin
            :is-active="isSeeReactions"
            :reactions="reactionTypes"
            @close="isSeeReactions = false"
            v-if="!isForbidden"
        />
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'PostHead',
    mixins: [ PostMixin ],
    props: {
        _id: { type: String },
        owner: { type: String },
        createdAt: { type: [String, Date] },
        forbidden: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
        gathering: { type: String },
        constellation: { type: String },
        noLink: { type: Boolean, default: false },
    },
    data: () => ({
        isSeeReactions: false
    }),
    computed: {
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
        title () {
            return this.ownerData ? this.ownerData.name : ''
        },
        subtitle () {
            let subtitle = this.$moment(this.createdAt).fromNow()
            return subtitle
        },
        titleLink () {
            return this.ownerData ? this.localePath({ name: 'p-userId', params: { userId: this.ownerData.id } }) : null
        },
        gatheringLink () {
            let link = null

            if (this.gatheringData && this.consteData) {
                link = this.localePath({ name: 'c-slug-events-eventId', params: { eventId: this.gatheringData.id, slug: this.consteData.slug } })
            } else if (this.consteData) {
                link = this.localePath({ name: 'c-slug-feed', params: { slug: this.consteData.slug } })
            }

            return link
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post_head {
        padding: 15px 15px 20px;
        position: relative;
    }

    .Post_icon {
        display: block;
        flex-shrink: 0;
        flex-grow: 0;
        position: relative;
    }

    .Post_conste {
        position: absolute;
        bottom: -5px;
        right: -5px;
        border-radius: 50%;
        border: 2px solid var(--color-bg-weak);
    }

    .Post_gathering {
        width: 25px;
        height: 25px;
        position: absolute;
        bottom: -8px;
        right: -5px;
        border-radius: 4px;
        background-size: cover;
        background-position: center;
    }

    @include breakpoint-xs {
        .Post_head {
            padding-left: 0;
            padding-right: 0;
        }
        .Post_head {
            padding-top: 0;
            padding-bottom: 20px;
            display: flex;
        }
    }

</style>