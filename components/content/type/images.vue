<template>
    <div class="Images" :class="[ `is-${images.length}`, { 'is-editor': isEditor }, ...$modifiers ]">
        <div class="Images_image" v-for="(image, i) in thumbnails" :key="image" :style="{ '--image': `url(${image})`, '--color': color }">
            <img :src="image">

            <div class="Images_actions" v-if="isEditor">
                <button-base type="button" :modifiers="['xs', 'round', 'weak']" icon-before="times" @click="$emit('delete', i)" />
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'Images',
    mixins: [ ModifiersMixin ],
    props: {
        images: { type: Array, default: () => [] },
        isEditor: { type: Boolean, default: false }
    },
    computed: {
        color () {
            return this.images[0]?.color
        },
        thumbnails () {
            return this.isEditor ? this.images : this.images.map(i => {
                let thumb = i.medias?.find(m => m.size == 'm')
                return thumb ? thumb.src : null
            }).filter(i => i)
        }
    }
}
</script>

<style lang="scss" scoped>
.Images {
    display: grid;
    grid-gap: 5px;
}

.Images_image {
    background-color: var(--color, var(--color-bg-strong));
    position: relative;
    overflow: hidden;

    &::after {
        content: "";
        display: block;
        background-image: var(--image);
        background-size: cover;
        background-position: center;
        opacity: 0.25;
        filter: blur(5px);
        @include absolute-fill(120);
    }

    &::before {
        content: "";
        @include ratio(50);
    }

    img {
        @include absolute-fill;
        display: block;
        object-fit: cover;
        z-index: 5;
    }
}

.Images_actions {
    position: absolute;
    padding: 10px;
    right: 0;
    top: 0;
    z-index: 5;
}

.Images.is-editor {
    display: grid;

    .Images_image {
        border-radius: 5px;
    }
}

.Images.is-1 {
    display: block;

    .Images_image {
        
        &::before {
            display: none;
        }

        img {
            position: relative;
            object-fit: revert;
            height: auto;
            width: auto;
            max-width: 100%;
            max-height: 60vh;
            margin: 0 auto;
        }
    }
}

.Images.is-2 {
    grid-template-columns: repeat(2, 1fr);
    
    .Images_image {
        grid-column: auto;

        &::before {
            @include ratio(100);
        }
    }
}

.Images.is-3 {
    grid-template-columns: repeat(2, 1fr);
    
    .Images_image {
        grid-column: auto;

        &::before {
            @include ratio(100);
            display: none;
        }

        &:nth-child(1) {
            grid-column: auto / span 1;
            grid-row: auto / span 2;

            &::before {
                display: block;
            }
        }

        &:nth-child(2) {
            grid-column: auto / span 1;
            grid-row: auto / span 1;
        }

        &:nth-child(3) {
            grid-column: auto / span 1;
            grid-row: auto / span 1;
        }
    }
}

.Images.is-4 {
    grid-template-columns: repeat(2, 1fr);
    
    .Images_image {
        grid-column: auto;

        &::before {
            @include ratio(100);
        }
    }
}

.Images--s {
    display: flex;

    .Images_image {
        width: 50%;
        max-height: 200px;
        border-radius: 5px;
        
        &::before {
            content: "";
            @include ratio(25);
        }
    }

    &.is-3 {
        
        .Images_image {
            width: 33.33%;
        }
    }
}
</style>