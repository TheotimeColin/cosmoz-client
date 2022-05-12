<template>
    <div class="Post">
        <div class="Post_head">
            <div class="d-flex fxa-center">
                <user-icon class="fx-no-shrink" :modifiers="['s']" v-bind="owner" />

                <div class="ml-10 ft-s line-1">
                    <p class="subtitle">{{ owner.name }}</p>
                    <p class="ft-italic color-ft-weak mt-3">{{ $moment(createdDate).fromNow() }}</p>
                </div>
            </div>
        </div>
        <div class="Post_main">
            <div class="Post_text" v-html="content"></div>
        </div>
        <div class="Post_footer">
            <div class="Post_action">
                <i class="fal fa-heart mr-3"></i> 12
            </div>
            <div class="Post_action">
                <i class="fal fa-comment-lines mr-3"></i> 2
            </div>
        </div>
        <div class="Post_comments">
            <content-comment
                v-for="post in comments"
                v-bind="post"
                :key="post._id"
            />

            <content-editor
                @submit="onSubmit"
                placeholder="Ajouter un commentaire..."
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
        _id: { type: String },
        content: { type: String },
        owner: { type: Object },
        children: { type: Array, default: () => [] },
        createdDate: { type: [String, Date] }
    },
    computed: {
        comments () {
            return this.$store.getters['status/find']({
                '$in': this.children
            })
        }
    },
    methods: {
        onSubmit (data) {
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
        
        & + & {
            margin-left: 20px;
        }
    }

    .Post_comments {
        border-top: 1px solid var(--color-border);
        margin: 0 20px;
        padding: 10px 0;
    }
</style>