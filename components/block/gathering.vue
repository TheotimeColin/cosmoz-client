<template>
    <component :is="link ? 'nuxt-link' : 'div'" :to="link ? link : null" class="BlockGathering" :class="{ 'is-past': isPast }">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <span v-html="$options.filters.verticalize(title)"></span>

            <div class="BlockGathering_heart" @click="onFavorite">
                <icon-base name="icon/heart-light" width="25" /> <b class="ft-title-s ml-10" v-if="favorites">{{ favorites }}</b>
            </div>
        </div>
        
        <div class="BlockGathering_content">
            <p class="BlockGathering_location">{{ isPast ? 'De retour bientôt' : location }}</p>
            <h3 class="BlockGathering_title">
                {{ subtitle }}
            </h3>
        </div>

        <div class="BlockGathering_dates" v-if="!hideDates">
            <a
                v-for="(date, i) in dates"
                :href="date.link"
                class="BlockGathering_date"
                :class="{ 'is-past': $moment(date.date).isBefore($moment()) }"
                :key="i"
            >
                <span>
                    {{ $moment(date.date).format('dddd DD') }}

                    <b> · {{ $moment(date.date).format('H:mm') }}</b>
                </span>

                <div class="ml-10">
                    <tag-category class="BlockGathering_tag" :category="date.category" v-if="date.category != 0" />
                </div>
            </a>
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
        place: { type: String },
        location: { type: String },
        favorites: { type: Number, default: 0 },
        dates: { type: Array, default: () => [] },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false },
        hideDates: { type: Boolean, default: false }
    },
    computed: {
        isPast () {
            return this.dates.length == 0 || !this.dates.reduce((hasDate, date) => {
                return this.$moment(date.date).isAfter(this.$moment()) ? true : hasDate
            }, false)
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        }
    },
    methods: {
        async onFavorite () {
            await this.$store.dispatch('gathering/create', {
                _id: this._id,
                params: { favorites: '$inc' }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockGathering {
    
    &:hover {

        .BlockGathering_coverImage {
            opacity: 0.5;
        }

        .BlockGathering_cover span {
            transform: scale(0.95);
        }

        .BlockGathering_heart {
            transform: scale(1);
            opacity: 1;
            filter: none;
            transition-delay: 100ms;
        }
    }

    &.is-past {

        // .BlockGathering_cover {
        //     background-color: var(--color-bg-weak);
        //     color: var(--color-ft-weak);
        // }

        // .BlockGathering_coverImage {
        //     opacity: 0.25;
        // }

        // .BlockGathering_title {
        //     color: var(--color-ft-weak);
        // }

        &:hover {

            .BlockGathering_cover span {
                // transform: none;
                opacity: 0.35;
                color: var(--color-ft-light);
                filter: blur(2px);
            }

            .BlockGathering_title {
                color: var(--color-ft-light);
            }

            // .BlockGathering_coverImage {
            //     opacity: 0.25;
            // }
        }
    }
}

.BlockGathering_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.9;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockGathering_cover {
    display: flex;
    align-items: center;
    justify-content: center;
    font: var(--ft-title-l);
    line-height: 1;
    background-color: var(--color-bg-strong);
    text-align: center;
    position: relative;

    span {
        padding: 0 15px;
        position: relative;
        transition: all 150ms ease;
    }
    
    &::before {
        @include ratio(60);
    }
}

.BlockGathering_heart {
    position: absolute;
    top: 50%;
    left: auto;
    right: auto;
    font-size: 25px;
    fill: var(--color-ft-light);
    margin: -12px auto 0;
    cursor: pointer;
    display: inline-flex;
    filter: blur(1px);
    transform: scale(1.2);
    opacity: 0;
    transition: all 150ms ease;
}

.BlockGathering_content {
    margin-top: 10px;
}

.BlockGathering_title {
    font: var(--ft-title-xs);
    transition: all 150ms ease; 
}

.BlockGathering_location {
    margin-bottom: 10px;
    font: var(--ft-s-medium);
    color: var(--color-ft-weak);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.BlockGathering_dates {
    margin-top: 10px;
}

.BlockGathering_date {
    font: var(--ft-s-medium);
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
</style>