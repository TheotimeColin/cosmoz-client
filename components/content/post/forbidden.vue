<template>
    <div>
        <div class="Post_forbidden" v-if="isForbidden && consteData">
            <nuxt-link :to="localePath({ name: 'c-slug-rejoindre', params: { slug: consteData.slug } })" class="Post_forbiddenMessage fx-center ft-s p-15 br-xs">
                <ripples :size="300" />

                <p class="mr-10">Ce contenu n'est visible que par les membres de {{ consteData.name }}.</p>

                <button-base :modifiers="['round', 'xs', 'light']" icon-before="arrow-right" />
            </nuxt-link>
        </div>
        <div class="Post_forbidden" v-else-if="isForbidden && ownerData">
            <div class="Post_forbiddenMessage Post_forbiddenMessage--user ft-s p-15 br-xs">
                <p>Ce contenu n'est visible que par les amis de {{ ownerData.name }}.</p>
            </div>
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'PostForbidden',
    mixins: [ PostMixin ],
    props: {
        constellation: { type: String },
        owner: { type: String },
        forbidden: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .Post_forbidden {
        padding: 25px;
        position: absolute;
        z-index: 15;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-opacity('bg-2xstrong', -50%);;
        backdrop-filter: blur(5px);
        border-radius: 10px;
    }

    .Post_forbiddenMessage {
        max-width: 400px;
        background-color: var(--color-bg-xweak);
        box-shadow: 0 3px 6px 0 color-opacity('bg-xstrong', -25%);
        overflow: hidden;
        position: relative;
        transition: all 200ms ease;

        &:hover {
            background-color: var(--color-cosmoz);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px 0 color-opacity('bg-xstrong', -10%);
        }
    }

    .Post_forbiddenMessage--user {
        text-align: center;
        pointer-events: none;
    }
</style>