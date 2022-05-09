<template>
    <component :is="link ? 'nuxt-link' : 'div'" :to="link ? link : null" class="BlockGathering" :class="{ 'is-past': isPast, 'is-unlocked': isUnlocked }">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGatherings_hider"></div>

            <span v-html="$options.filters.verticalize(title)"></span>

            <button-base class="BlockGatherings_unlock" :modifiers="['light']" @click="() => { isUnlocked = true; $emit('unlock') }">
                Dévoiler l'expérience
            </button-base>
        </div>
        
        <div class="BlockGathering_content">
            <div class="BlockGathering_location fx-center">
                <p>Lieu secret</p>
            </div>

            <div class="BlockGathering_title" @click="isUnlocked = false">
                {{ subtitle }}
            </div>
        </div>
    </component>
</template>

<script>
export default {
    name: 'BlockGathering',
    props: {
        _id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false },
    },
    data: () => ({
        isUnlocked: false
    }),
    created () {

    },
    computed: {
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.BlockGathering {
    
    &:hover {

        .BlockGathering_cover span {
            
        }

        .BlockGathering_heart {
            transform: scale(1);
            opacity: 1;
            filter: none;
            transition-delay: 100ms;
        }

        .BlockGatherings_hider {
            transform: scale(1.1);
        }

        .BlockGathering_title {
            filter: blur(2px);
        }
    }

    &.is-unlocked {

        .BlockGatherings_unlock {
            opacity: 0;
            transform: scale(0.5);
            pointer-events: none;
        }

        .BlockGatherings_hider {
            opacity: 0;
            transform: scaleX(10);
            transition: all 200ms ease-in;
        }

        .BlockGathering_coverImage {
            opacity: 0.75;
            transform: scale(1.05);
            transition: all 1400ms ease-in-out;
        }

        .BlockGathering_cover span {
            position: relative;
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
            transition: all 800ms ease-out;
            transition-delay: 100ms;
        }

        .BlockGathering_title {
            opacity: 1;
            filter: blur(0px);
            transition: all 800ms ease-out;
            transition-delay: 100ms;
        }
    }
}

.BlockGathering_coverImage,
.BlockGatherings_hider {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.05;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockGathering_coverImage {
    transform: scale(1);
}

.BlockGatherings_hider {
    opacity: 0.9;
    background-image: url('@/assets/img/texture/holo.webp');
}

.BlockGathering_favs {
    cursor: pointer;
}

.BlockGatherings_unlock {
    z-index: 10;
    position: absolute;
    top: 50%;
    left: auto;
    right: auto;
    margin: -20px auto 0;
}

.BlockGathering_cover {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font: var(--ft-title-l);
    line-height: 1;
    background-color: var(--color-bg-xstrong);
    text-align: center;
    position: relative;
    overflow: hidden;

    span {
        position: absolute;
        transform: scale(0.95);
        padding: 0 20px;
        opacity: 0;
        color: var(--color-ft-light);
        filter: blur(2px);
        transition: all 150ms ease;
    }
    
    &::before {
        @include ratio(60);
    }
}

.BlockGathering_content {
    margin-top: 10px;
}

.BlockGathering_title {
    font: var(--ft-title-xs);
    filter: blur(3px);
    opacity: 0.5;
    line-height: 1.2;
    transition: all 150ms ease; 
}

.BlockGathering_location {
    margin-bottom: 5px;
    font: var(--ft-xs);
    color: var(--color-ft-weak);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.BlockGathering_dates {
    margin-top: 10px;
}

.BlockGathering_date {
    font: var(--ft-s);
    line-height: 1;
    min-height: 43px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    padding: 3px 3px 3px 12px;
    border: 1px solid var(--color-border);
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    margin: 5px 10px 0 0;

    b {
        font: var(--ft-s);
        line-height: 1;
    }

    &.is-past {
        
        b {
            font: var(--ft-s);
        }
        
        span {
            color: var(--color-ft-weak);
            text-decoration: line-through;
        }

        .BlockGathering_tag {
            opacity: 0.5;
        }
    }

    &:hover {
        color: var(--color-ft);
        background-color: var(--color-bg-light);

        span {
            text-decoration: none;
        }

        .BlockGathering_tag {
            opacity: 1;
        }
    }
}

@include breakpoint-s {
    .BlockGathering {
        
        &:hover {

            .BlockGathering_coverImage {
                opacity: 0.5;
            }

            .BlockGathering_cover span {
                transform: none;
                opacity: 1;
                filter: none;
                color: var(--color-ft-light);
            }

            .BlockGathering_heart {
                display: none;
            }
        }
    }
}

</style>