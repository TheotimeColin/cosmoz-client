<template>
    <div class="Comment">
        <div class="Comment_head">
            <user-icon class="fx-no-shrink" :modifiers="['s']" v-bind="owner" />
        </div>
        <div class="Comment_main">
            <div class="fx-grow">
                <div class="ft-s line-1">
                    <span class="subtitle">{{ owner.name }}</span>
                    <span class="ft-xs line-1 ft-italic color-ft-weak ml-5">{{ $moment(createdAt).fromNow() }}</span>
                </div>

                <div class="Comment_text" v-html="content"></div>
            </div>
            
            <div class="Comment_actions">
                <div class="Comment_action">
                    <i class="fal fa-heart mr-3"></i> {{ reactions.length ? reactions.length : '' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Comment',
    props: {
        _id: { type: String },
        content: { type: String },
        owner: { type: Object },
        reactions: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] }
    }
}
</script>

<style lang="scss" scoped>
    .Comment {
        display: flex;
    }

    .Comment_main {
        display: flex;
        padding: 10px;
        background: var(--color-bg);
        border-radius: 5px;
        flex-grow: 1;
    }

    .Comment_text {
        font: var(--ft-m);
        margin-top: 10px;
    }

    .Comment_head {
        flex-shrink: 0;
        margin-right: 10px;
    }

    .Comment_actions {
        flex-shrink: 0;
    }

    .Comment_action {
        font: var(--ft-s);
        font-weight: bold;
        
        & + & {
            margin-left: 20px;
        }
    }
</style>