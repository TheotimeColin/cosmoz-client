<template>
    <div class="Page" v-if="$constellation">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <content-post
                v-bind="status"
                :no-link="true"
                :max-comments="8"
                :display-comments="true"
                @submit="onSubmit"
                v-if="status"
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
</style>
