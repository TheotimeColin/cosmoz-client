<template>
    <div class="BlockInterest" :class="[ ...$modifiers ]">
        <div class="BlockInterest_cover">
            <div class="BlockInterest_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockInterest_content">
                <div>
                    <!-- <span class="tag-s mb-3 mr-3" v-for="tag in tags" :key="tag">
                        {{ $t(`interests.${tag}`) }}
                    </span> -->
                </div>

                <h3 class="BlockInterest_title ellipsis-3">
                    {{ title|specials }}
                </h3>
            </div>
        </div>
        <div class="BlockInterest_footer">
            <div class="BlockInterest_action" @click="$emit('ignore')">
                <fa icon="far fa-times" />
            </div>
            <div class="BlockInterest_action BlockInterest_action--like" @click="$emit('like')">
                <fa icon="far fa-heart" /> <span class="ft-title-3xs ml-10">Intéressé</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'BlockInterest',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String },
        tags: { type: Array, default: () => [] },
        thumbnail: { type: String }
    },
    data: () => ({

    }),
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>
.BlockInterest {
    position: relative;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &:hover {
    
    }
}

.BlockInterest_cover {
    display: block;
    overflow: hidden;
    line-height: 1;
    background-color: var(--color-black);
    text-align: left;
    position: relative;
    flex-grow: 1;
    
    &::before {
        @include ratio(100);
    }
}

.BlockInterest_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-size: cover;
    background-position: center;
    transition: all 100ms ease;
}

.BlockInterest_content {
    @include absolute-fill;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.BlockInterest_footer {
    padding: 0px;
    display: flex;
    background-color: var(--color-bg-light);
}

.BlockInterest_action {
    height: 50px;
    flex-grow: 1;
    color: var(--color-ft);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 100ms ease;

    svg {
        transition: all 100ms ease;
    }

    &:hover {
        color: var(--color-ft-xweak);
        background-color: var(--color-bg-2xweak);

        svg {
            transform: scale(0.9);
        }
    }
}

.BlockInterest_action--like {

    &:hover {
        color: var(--color-love);
    }
}

.BlockInterest_title {
    font: var(--ft-title-xs);
    transition: all 150ms ease; 
}

</style>