<template>
    <component :is="disableLink ? 'div' : 'a'" class="Embed" :class="[ ...$modifiers ]" :href="href" target="_blank">
        <div class="Embed_main">
            <div>
                <p class="ft-title-2xs ellipsis-2">
                    {{ title }}
                </p>
                <p class="ft-s mt-5 ellipsis-1 ellipsis-break d-none@xs" v-if="description">
                    {{ description }}
                </p>

                <p class="ft-s mt-10 color-ft-xweak ellipsis-1 ellipsis-break" v-if="href">
                    <fa icon="far fa-link" class="mr-5" />{{ href.replace('https://', '').replace('http://', '').replace('www.', '') }}
                </p>
            </div>
        </div>
        <div class="Embed_image" :style="{ backgroundImage: `url(${image})` }" v-if="image"></div>

        <div class="Embed_actions">
            <slot></slot>
        </div>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'Embed',
    mixins: [ ModifiersMixin ],
    props: {
        href: { type: String },
        title: { type: String },
        disableLink: { type: Boolean, default: false },
        description: { type: String },
        image: { type: String },
    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.Embed {
    display: flex;
    border: 1px solid var(--color-bg-xweak);
    background-color: var(--color-bg-xweak);
    border: 1px solid var(--color-border);
    @include shadow;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
}

.Embed_actions {
    position: absolute;
    top: 5px;
    right: 5px;
}

.Embed_image {
    width: 140px;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
    background-color: var(--color-bg);

    &::before {
        content: "";
        display: block;
        @include ratio(50);
    }
}

.Embed_main {
    display: flex;
    align-items: center;
    min-height: 140px;
    padding: 10px 20px;
    flex-grow: 1;
}

@include breakpoint-xs {

    .Embed_image {
        width: 100px;
    }

    .Embed_main {
        min-height: 100px;
        padding: 10px 15px;
    }
}
</style>