<template>
    <div class="Feed">
        <content-editor
            class="Feed_editor Feed_item p-15 mb-20 br-s bg-bg-weak"
            :placeholder="placeholder"
            :read="read"
            :constellation="constellation"
            :loading="isSubmitLoading"
            :errors="errors"
            @submit="onSubmit"
            v-if="!disableCreate"
            ref="editor"
        />

        <transition-group name="fade">
            <div class="Feed_item ft-s color-ft-xweak bg-bg-strong br-s p-15 text-center" v-if="isLoading || isSubmitLoading" key="loader">
                <fa icon="far fa-spinner-third" class="spin mr-5" /> Mise à jour du fil...
            </div>

            <content-post
                v-for="status in displayedStatuses"
                class="Feed_item"
                v-bind="status"
                @submit="onSubmit"
                :active-gathering="gathering"
                :active-constellation="constellation"
                :disableCreate="disableInteract"
                :key="status._id"
                ref="posts"
            />
        </transition-group>

        <div class="Feed_item color-ft-xweak ft-s mt-20 text-center" v-if="statusesData.length <= 0 && !isLoading">
            Aucun message sur ce fil.
        </div>

        <div class="text-center mt-20" v-if="displayedStatuses.length < statusesData.length">
            <button-base :modifiers="['light']" @click="page++">Afficher la suite</button-base>
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
        max: { type: Number, default: 5 },
        gathering: { type: String },
        constellation: { type: String },
        author: { type: String },
        placeholder: { type: String, default: 'Publier quelque chose...' },
        disableInteract: { type: Boolean, default: false },
        disableCreate: { type: Boolean, default: false }
    },
    data: () => ({
        statusesData: [],
        errors: [],
        isSubmitLoading: false,
        isLoading: true,
        page: 0
    }),
    async fetch () {
        this.isLoading = true

        let query = { parent: '$null' }

        if (this.gathering) {
            query.gathering = this.gathering
            await this.$store.dispatch('status/fetch', { query })
        } else if (this.constellation) {
            query.constellation = this.constellation
            query.gathering = '$null'
            await this.$store.dispatch('status/fetch', { query })
        } else if (this.author) {
            query.owner = this.author
            query.gathering = '$null'
            await this.$store.dispatch('status/fetch', { query })
        } else {
            await this.$store.dispatch('status/fetchFeed')
        }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        statuses () {
            let query = {}
        
            if (this.gathering) query.gathering = this.gathering
            if (this.author) query.owner = this.author

            return this.$store.getters['status/find']({
                ...query
            })
        },
        displayedStatuses () {
            return this.statusesData.slice(0, this.max * (this.page + 1))
        }
    },
    watch: {
        statuses: {
            immediate: true,
            deep: true,
            async handler (v) {
                this.isLoading = true
                
                if (v) {
                    if (this.statusesData.length !== v.length) this.statusesData = []

                    let statuses = await this.$store.dispatch('user/mapUsers', {
                        items: v, property: 'owner'
                    })

                    this.statusesData = await Promise.all(statuses.map(async s => {
                        let children = s.children ? await this.$store.dispatch('user/mapUsers', { items: s.children, property: 'owner' }) : []

                        return { ...s, children }
                    }))

                }

                this.isLoading = false
            }
        }
    },
    methods: {
        async onSubmit (formData) {
            this.isSubmitLoading = true

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

                if (this.$refs.editor) this.$refs.editor.reset()
                
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