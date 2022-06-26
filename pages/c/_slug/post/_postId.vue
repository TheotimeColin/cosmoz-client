<template>
    <div class="Page" v-if="$constellation">
        <div class="Page_wrapper Wrapper Wrapper--xs">
            <div v-if="originPost">
                <content-post
                    v-bind="originPost"
                    :display-comments="false"
                    @submit="onSubmit"
                />
                
                <link-base class="mt-20" v-if="originPost.children && originPost.children.length - 1 > 0" :to="originLink">Voir les autres {{ originPost.children.length - 1 }} autres réponses</link-base>

                <div class="Comment_child mt-20 pt-20 pl-40">

                    <content-post
                        v-bind="status"
                        :no-link="true"
                        :max-comments="8"
                        :display-comments="true"
                        @submit="onSubmit"
                        ref="post"
                    />
                </div>
            </div>

            <content-post
                v-bind="status"
                :no-link="true"
                :max-comments="8"
                :display-comments="true"
                @submit="onSubmit"
                v-else-if="status"
                ref="post"
            />
        </div>
    </div>
</template>

<script>
import PostIdMixin from '@/mixins/post-id'
import ConstellationMixin from '@/mixins/constellation'

export default {
    layout: 'app',
    mixins: [ PostIdMixin, ConstellationMixin ]
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }

    .Comment_child {
        border-left: 2px solid var(--color-border);
    }
</style>
