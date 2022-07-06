<template>
    <div class="Feed">
        <content-input
            class="Feed_editor Feed_item p-15 mb-20 br-s bg-bg-weak shadow-s"
            :placeholder="placeholder"
            :read="read"
            :constellation="constellation"
            :is-trigger="true"
            @focus="isEditorActive = true"
            v-if="!disableCreate"
        />

        <client-only>
            <content-editor
                :is-active="isEditorActive"
                :placeholder="placeholder"
                :read="read"
                :constellation="constellation"
                :is-loading="isSubmitLoading"
                :errors="errors"
                :enable-tags="enableTags"
                :default-tags="tags"
                @submit="onSubmit"
                @open="isEditorActive = true"
                @close="isEditorActive = false"
                v-if="!disableCreate"
                ref="editor"
            />
        </client-only>

        <transition-group name="fade">
            <component
                :is="'content-' + status.type"
                v-for="status in displayedStatuses.filter(c => !isLoading)"
                class="Feed_item"
                v-bind="status"
                :active-gathering="gathering"
                :active-constellation="constellation"
                :disableCreate="disableInteract"
                :key="status._id"
                ref="posts"
            />

            <placeholder class="Feed_item outflow@xs" v-for="i in 10" :ratio="$smallerThan('xs') ? 65 : 45" v-show="isLoading" :key="i" />
        </transition-group>

        <div class="Feed_item color-ft-xweak ft-s mt-20 text-center" v-if="displayedStatuses.length <= 0 && !isLoading">
            Aucun message sur ce fil.
        </div>
        
        <div class="Feed_loader mt-20" v-if="isLoading || isSubmitLoading">
            <button-base :modifiers="['light']" >
                <fa icon="far fa-spinner-third" class="spin mr-5" /> Mise à jour du fil...
            </button-base>
        </div>

        <div class="text-center mt-20" v-if="checkingNext">
            <button-base :modifiers="['light']" :loading="true">Chargement</button-base>
        </div>
        <div class="text-center color-ft-xweak mt-20" v-else-if="displayedStatuses.length > 0">
            <p>Fin du fil.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Feed',
    props: {
        read: { type: String, default: 'friends' },
        max: { type: Number, default: 10 },
        gathering: { type: String },
        tag: { type: String },
        constellation: { type: String },
        author: { type: String },
        enableTags: { type: Boolean, default: false },
        placeholder: { type: String, default: 'Publier quelque chose...' },
        disableInteract: { type: Boolean, default: false },
        disableCreate: { type: Boolean, default: false },
        autoStatuses: { type: Array, default: () => [] }
    },
    data: () => ({
        isEditorActive: false,
        statusesData: [],
        errors: [],
        tags: [],
        isSubmitLoading: false,
        isLoading: true,
        page: 0,
        checkedNext: false,
        checkingNext: false
    }),
    async fetch () {
        if (this.tag) this.tags = [ this.tag ]
        
        if (this.$store.getters['status/isFetched'](this.feedType)) {
            this.isLoading = false

            this.softRefresh()
        } else {
            this.isLoading = true

            await this.refresh()

            this.isLoading = false
        }
    },
    computed: {
        statuses () {
            let statuses = []

            let userPosts = this.$store.getters['status/find']({
                ...this.query
            }).map(s => ({ ...s, type: 'post' }))

            statuses = [
                ...userPosts,
                ...this.autoStatuses
            ].filter(s => s.createdAt && this.$moment(s.createdAt).isBefore(this.$moment().add(30, 'seconds')))

            return statuses.sort((a, b) => {
                return this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()
            })
        },
        displayedStatuses () {
            return this.statuses.slice(0, this.max * (this.page + 1))
        },
        feedType () {
            if (this.gathering) return 'gathering'
            if (this.constellation) return 'constellation'
            return 'feed'
        },
        query () {
            let query = { parent: '$null' }

            if (this.tag) query.tags = { $broad: this.tag }

            if (this.gathering) {
                query.gathering = this.gathering
            } else if (this.constellation) {
                query.constellation = this.constellation
                query.gathering = '$null'
            }

            return query
        }
    },
    watch: {
        async ['$store.state.page.isEnd'] (v) {
            if (v && !this.checkingNext) {
                this.checkingNext = true

                await this.$store.dispatch('status/fetch', {
                    type: this.feedType,
                    query: this.query, softRefresh: true,
                    options: { sort: { createdAt: 'desc' }, limit: this.max * (this.page + 2), skip: this.max * (this.page + 1) }
                })

                this.page += 1
                this.checkingNext = false
            }
        },
        page (v) {
            this.checkedNext = false
        }
    },
    methods: {
        openEditor (params = {}) {
            if (params.tags) this.tags = params.tags
            
            this.isEditorActive = true
        },
        async softRefresh () {
            await this.$store.dispatch('status/fetch', {
                type: this.feedType, query: this.query, softRefresh: true,
                options: {
                    sort: { createdAt: 'desc' },
                    limit: this.max * (this.page + 1), skip: this.max * this.page
                }
            })
        },
        async refresh () {
            return new Promise(async resolve => {
                try {
                    await this.$store.dispatch('status/fetch', {
                        type: this.feedType, query: this.query,
                        options: {
                            sort: { createdAt: 'desc' },
                            limit: this.max * (this.page + 1), skip: this.max * this.page
                        }
                    })

                    if (this.statuses) {
                        await this.$store.dispatch('user/softFetch', 
                            this.statuses.reduce((all, s) => [
                                ...all, s.owner, 
                                ...(s.reactions ? s.reactions : []).map(r => r.owner),
                                ...(s.children ? s.children : []).reduce((children, c) => [
                                    ...children, c.owner,
                                    ...c.reactions.map(r => r.owner)
                                ], [])
                            ] , [])
                        )
                    }
                } catch (e) {
                    console.error(e)
                }

                resolve(true)
            })
        },
        async onSubmit (formData) {
            this.isSubmitLoading = true
            this.errors = []

            try {
                let data = { ...formData, read: this.read }

                if (this.gathering) {
                    data.gathering = this.gathering
                    data.read = 'public'
                }

                if (this.constellation) {
                    data.constellation = this.constellation
                }

                const response = await this.$store.dispatch('status/create', data)

                if (response.status == 0) {
                    this.errors = [ response.error ]
                    throw Error(response.error)
                }

                if (formData.tags && formData.tags.includes('présentations')) {
                    this.$emit('introduced')
                }

                if (this.$refs.editor) this.$refs.editor.reset()
                this.isEditorActive = false
                
                if (response.data.parent) { // RESET COMMENT EDITOR
                    let parent = this.$refs.posts.find(p => p._id == response.data.parent._id)

                    if (parent) parent.reset()
                }
            } catch (e) {
                console.error(e)
            }

            this.isSubmitLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Feed_item {

    & + & {
        margin-top: 20px;
    }
}

.Feed_loader {
    position: sticky;
    z-index: 15;
    bottom: calc(var(--sticky-height) + 20px);
    text-align: center;
}

@include breakpoint-xs {

    .Feed_editor {
        margin: 0 -20px 10px;
        border-radius: 0;
        padding: 20px;
        background-color: var(--color-bg-weak);
    }

    .Feed_item {

        & + & {
            margin-top: 10px;
        }
    }
}
</style>