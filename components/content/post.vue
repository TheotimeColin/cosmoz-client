<template>
    <div class="Post" :class="{ 'is-current': isCurrent }">
        <div class="Post_head">
            <div class="d-flex fxa-center">
                <nuxt-link class="Post_icon" :to="titleLink" :style="isCurrent ? {} : { backgroundImage: `url(${gatheringData.thumbnail})` }">
                    <user-icon class="Post_user" :modifiers="['s']" v-bind="owner" />
                </nuxt-link>

                <div class="ml-10 ft-s line-1">
                    <nuxt-link :to="titleLink" class="subtitle">{{ title }}</nuxt-link>
                    <p class="ft-italic color-ft-weak mt-5">{{ subtitle }}</p>
                </div>
            </div>
        </div>
        <div class="Post_main">
            <div class="Post_text" v-html="content"></div>
        </div>
        <div class="Post_footer">
            <div class="Post_action">
                <i class="fal fa-heart mr-3"></i> {{ reactions.length ? reactions.length : '' }}
            </div>
            <div class="Post_action" @click="onAddComment">
                <i class="fal fa-comment-lines mr-3"></i> {{ comments.length ? comments.length : '' }}
            </div>
        </div>
        <transition name="fade">
            <div class="Post_comments" v-show="displayedComments.length > 0 || isAdd">
                <link-base class="Post_comment color-ft-weak d-block n-mt-5 mb-20" @click="max += 3" v-if="displayedComments.length < comments.length">Commentaires précédents</link-base>
               
                <content-comment
                    v-for="post in displayedComments"
                    class="Post_comment"
                    v-bind="post"
                    :key="post._id"
                />

                <content-editor
                    @submit="onSubmit"
                    class="Post_comment"
                    :tiny="true"
                    placeholder="Ajouter un commentaire..."
                    @blur="() => comments.length == 0 ? isAdd = false : ''"
                    v-show="isAdd || comments.length > 0"
                    ref="commentInput"
                />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
        _id: { type: String },
        content: { type: String },
        owner: { type: Object },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        disableCreate: { type: Boolean, default: false },
        createdAt: { type: [String, Date] },
        gathering: { type: String },
        activeGathering: { type: String }
    },
    data: () => ({
        max: 2,
        isAdd: false,
        localComments: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        displayedComments () {
            return this.comments.slice(Math.max(0, this.comments.length - this.max), this.comments.length)
        },
        comments () {
            let comments = this.$store.getters['status/find']({
                '$in': this.children
            })

            return [ ...comments, ...this.localComments ] 
        },
        isCurrent () {
            return this.activeGathering == this.gathering
        },
        gatheringData () {
            return this.$store.getters['gathering/findOne']({ _id: this.gathering })
        },
        title () {
            if (this.isCurrent) {
                return this.owner.name
            } else {
                return this.gatheringData.title
            }
        },
        subtitle () {
            let subtitle = this.$moment(this.createdAt).fromNow()

            if (!this.isCurrent) subtitle = this.owner.name + ' · ' + subtitle

            return subtitle
        },
        titleLink () {
            if (this.isCurrent) {
                return this.localePath({ name: 'p-id', params: { id: this.owner.id } })
            } else {
                
                return this.localePath({ name: 'g-id', params: { id: this.gatheringData.id } })
            }
        }
    },
    methods: {
        reset () {
            this.$refs.commentInput.reset()
        },
        pushComment (v) {
            this.localComments = [ ...this.localComments, v ]
        },
        onAddComment () {
            if (this.disableCreate) return

            this.isAdd = true
            setTimeout(() => this.$refs.commentInput.focus(), 10)
        },
        onSubmit (data) {
            if (this.disableCreate) return
            
            this.$emit('submit', {
                ...data,
                parent: this._id
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post {
        border-radius: 5px;
        background-color: var(--color-bg-strong);

        &.is-current {

            .Post_icon {
                background-color: transparent;
            }

            .Post_user {
                position: relative !important;
                bottom: auto;
                right: auto;
                width: 100% !important;
                height: 100% !important;
            }
        }
    }

    .Post_icon {
        flex-shrink: 0;
        flex-grow: 0;
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg);
        position: relative;
    }

    .Post_user {
        position: absolute !important;
        bottom: -3px;
        right: -3px;
        width: 20px !important;
        height: 20px !important;
    }

    .Post_text {
        font: var(--ft-l);
        padding: 0 20px;
    }

    .Post_head {
        padding: 20px;
    }

    .Post_footer {
        display: flex;
        padding: 15px 20px 20px;
    }

    .Post_action {
        font: var(--ft-s);
        font-weight: bold;
        cursor: pointer;
        
        & + & {
            margin-left: 20px;
        }
    }

    .Post_comments {
        border-top: 1px solid var(--color-border);
        margin: 0 20px;
        padding: 20px 0;
    }

    .Post_comment {

        & + & {
            margin-top: 10px;
        }
    }

</style>