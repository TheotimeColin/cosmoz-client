<template>
    <div class="Page" v-if="$constellation">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <div v-if="originPost">
                <content-post
                    v-bind="originPost"
                    :display-comments="false"
                    @submit="onSubmit"
                />
                
                <div class="pt-20 p-relative text-center@xs" v-if="originPost.children">
                    <div class="anchor" ref="child"></div>

                    <link-base :to="originLink" v-if="originPost.children.length > 1">Voir les autres {{ originPost.children.length - 1 }} autres réponses</link-base>
                    <link-base :to="originLink" v-else>Retour à la publication originale</link-base>
                </div>

                <div class="Comment_child">

                    <content-post
                        v-bind="status"
                        :no-link="true"
                        :is-child="true"
                        :max-comments="8"
                        :display-comments="true"
                        @submit="onSubmit"
                        ref="post"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostIdMixin from '@/mixins/post-id'
import ConstellationMixin from '@/mixins/constellation'

export default {
    layout: 'app',
    mixins: [ PostIdMixin, ConstellationMixin ],
    methods: {
        onLoaded () {
            setTimeout(() => {
                if (this.$refs.child) this.$refs.child.scrollIntoView()
            }, 300)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }

    .Comment_child {
        margin-top: 20px;
        padding-top: 20px;
        padding-left: 40px;
        border-left: 2px solid var(--color-border);
    }

    @include breakpoint-xs {
        .Comment_child {
            margin-top: 0px;
            padding-left: 0px;
            border: none;
        }
    }
</style>
