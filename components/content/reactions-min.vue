<template>
    <div class="ReactionsMin">
        {{ reactions.length }}
        <div class="ReactionsMin_container">
            <div
                class="ReactionsMin_item"
                v-for="reaction in reactionTypes.slice(0, 3)" :key="reaction[0]"
            >
                <span>{{ reaction[0] }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import PostReactionsMixin from '@/mixins/post-reactions'

export default {
    name: 'Post',
    mixins: [ PostMixin, PostReactionsMixin ],
    props: {
        reactions: { type: Array, default: () => [] },
    },
    computed: {
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
    }
}
</script>

<style lang="scss" scoped>
.ReactionsMin {
    background: var(--color-bg);
    padding: 5px 6px 8px 10px;
    border-radius: 30px;
    line-height: 1;
    font: var(--ft-title-3xs);
    display: flex;
    align-items: flex-end;
}

.ReactionsMin_container {
    position: relative;
    font: var(--ft-emoji-l);
    margin-left: 3px;
    line-height: 1;
    display: flex;
    align-items: center;
    padding-right: 10px;
}

.ReactionsMin_item {
    width: 12px;
    position: relative;
}
</style>