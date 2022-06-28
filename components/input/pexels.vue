<template>
    <popin :is-active="isActive" :modifiers="['m']" @close="$emit('close')">
        <template slot="content">
            <form @submit.prevent="() => search(query)" class="PexelsGallery">
                <div class="PexelsGallery_list p-20">
                    <div ref="container">
                        <div class="PexelsGallery_row" v-for="(row, i) in rows" :key="i">
                            <div class="PexelsGallery_photo" v-for="photo in row.photos" :key="photo.id" :style="{ '--width': photo.width + 'px', '--height': photo.height + 'px' }" @click="() => { $emit('select', photo.original); $emit('close') }">
                                <img :src="photo.original.src.medium" :width="Math.min(photo.original.width * 0.8, photo.width)" :height="Math.min(photo.original.height * 0.8, photo.height)" />
                            </div>
                        </div>
                    </div>

                    <div class="mt-20 text-center">
                        <button-base type="button" :modifiers="['s', 'light']" 
                        :loading="isLoading" @click="offset += 1">
                            Charger plus
                        </button-base>
                    </div>
                </div>

                <div class="PexelsGallery_search fx-no-shrink">
                    <div class="p-20">
                        <input-base type="text" class="mr-15" :modifiers="['light']" v-model="query" placeholder="Restaurant, groupe, atelier..." />

                        <button-base type="submit" :modifiers="['s', 'light']" :class="{ 'is-loading': isLoading }">
                            Rechercher
                        </button-base>
                    </div>
                </div>
            </form>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'PexelsGallery',
    data: () => ({
        query: '',
        prevQuery: '',
        isLoading: false,
        photos: [],
        rows: [],
        offset: 1,
        maxWidth: 0
    }),
    props: {
        isActive: { type: Boolean, default: false },
        height: { type: Number, default: 150 },
        maxRows: { type: [Number, Boolean], default: 5 },
        maxPhotos: { type: [Number, Boolean], default: false }
    },
    mounted () {
        this.$data.maxWidth = this.$refs.container.offsetWidth
        this.search(this.query ? this.query : 'friends')
    },
    watch: {
        offset () {
            this.search(this.query ? this.query : 'friends')
        }
    },
    methods: {
        async search (v = null) {
            this.isLoading = true

            if (this.prevQuery != v) this.rows = []

            this.prevQuery = v

            try {
                let params = {
                    query: { per_page: 30, page: this.offset }
                }

                if (v) params.query = { ...params.query, query: v }

                let response = await this.$store.dispatch('pexels/fetch', params)

                this.photos = response

                this.rows = [
                    ...this.rows,
                    ...this.arrangePhotos(this.photos)
                ]
            } catch (e) {

            }
            
            this.isLoading = false
        },
        arrangePhotos (items) {
            let photos = items.slice()
            
            let rows = []
            let safeguard = 0

            while (photos.length > 0 && safeguard < 100) {
                safeguard++

                let currentRow = {
                    width: 0,
                    photos: []
                }

                while (currentRow.width < this.maxWidth && photos.length > 0 && safeguard < 100) {
                    safeguard++
                    
                    let current = photos[0]
                    let width = (this.height / current.height) * current.width

                    currentRow.photos.push({
                        ...current,
                        id: current.id,
                        original: current,
                        width: width,
                        height: this.$props.height
                    })

                    currentRow.width += width
                    photos.shift()
                }

                rows.push(currentRow)
            }

            rows.forEach((row, i) => {
                if (i == rows.length - 1 && (row.width - 5) < this.maxWidth) return

                let diff = this.maxWidth / (row.width - 5)

                row.photos = row.photos.map(photo => ({
                    ...photo,
                    width: Math.round(photo.width * diff) - 5,
                    height: Math.round(photo.height * diff) - 5
                }))
            })

            return rows.filter(r => r.photos.length > 0)
        }
    }
}
</script>

<style lang="scss" scoped>
    .PexelsGallery {
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .PexelsGallery_search {
        position: relative;
        background-color: var(--color-bg-strong);
        overflow: hidden;

        &::before {
            display: none;
            content: "";
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            background-size: cover;
            background-position: center;
            background-image: var(--background);
            opacity: 0.2;
            filter: blur(2px);
        }

        & > div {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
        }
    }

    .PexelsGallery_list {
        min-height: 300px;
        max-height: 400px;
        overflow: auto;
        flex-grow: 1;
    }

    .PexelsGallery_row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 5px;
        justify-content: center;
    }

    .PexelsGallery_photo {
        margin-right: 5px;
        width: var(--width);
        height: var(--height);
        border-radius: 4px;
        cursor: pointer;
        transition: all 150ms ease;
        overflow: hidden;

        &:active {
            opacity: 0.5;
            transform: scale(0.95);
        }

        &:hover {
            opacity: 0.75;
            transform: scale(0.98);
        }

        &:last-child {
            margin-right: 0;
        }

        img {
            display: block;
        }
    }

    @include breakpoint-xs {
        .PexelsGallery_list {
            max-height: 9999px;
        }
    }
</style>