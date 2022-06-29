<template>
    <div>
        <transition-group name="transition-list" tag="div" class="p-relative">
            <button-base
                :modifiers="[size == 'm' ? 'xs' : '2xs', 'no-s', isReacted(reaction[0]) ? 'highlight-strong' : '']"
                class="m-3"
                :emoji-before="reaction[0]"
                v-for="reaction in reactionTypes.slice(0, maxDisplayedReactions)" :key="reaction[0]"
                :text="isDefaultReaction(reaction[1]) ? '' : reaction[1].length"
                @mouseenter="(e) => onMouseEnter(e, reaction)"
                @mouseleave="$tClose"
                @click.stop="addReaction({ type: reaction[0] })"
            />

            <button-base
                icon-before="plus"
                class="m-3"
                :modifiers="[size == 'm' ? 'xs' : '2xs']"
                key="plus"
                type="button"
                @click.stop="isSeeReactions = true"
                v-if="reactionTypes.length - maxDisplayedReactions > 0"
            >
                {{ reactionTypes.length - maxDisplayedReactions }}
            </button-base>
        </transition-group>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import PostReactionsMixin from '@/mixins/post-reactions'

export default {
    name: 'Post',
    mixins: [ PostMixin, PostReactionsMixin ],
    props: {
        _id: { type: String },
        staticId: { type: String },
        size: { type: String },
        defaultReactions: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
    },
    data: () => ({

    }),
    computed: {
        reactionTypes () {
            return this.$groupBy([ ...this.defaultReactions, ...this.reactions], 'type', { orderBy: true })
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 8 : 12
        }
    },
    methods: {
        isDefaultReaction (reactions) {
            return !reactions.find(r => !r.default)
        },
        onMouseEnter (e, reaction) {
            if (this.isDefaultReaction(reaction[1])) return

            let text = reaction[0]
            let users = this.$pluralize(reaction[1].map(r => this.$getUser(r.owner) ? this.$getUser(r.owner).name : null).filter(v => v))

            if (users.length > 0) text += ' : ' + users

            this.$tOpen(text, e)
        }
    }
}
</script>

<style lang="scss" scoped>


</style>