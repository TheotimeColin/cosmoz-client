<template>
    <popin :is-active="isActive ? true : false" :modifiers="['s']" query="publish" @close="$store.commit('page/popin', { editor: false })">
        <div class="Editor_content" slot="content">
            <div class="d-flex fxa-center p-15">
                <button-base :modifiers="['s', 'light']" :image="gatheringData.thumbnail" :ellipsis="20" :text="gatheringData.title" v-if="gatheringData" />

                <input-conste-select placeholder="Où veux-tu publier ?" :max="1" v-model="constellation" class="fx-grow" ref="consteSelect" v-else />
            </div>
            
            <hr class="Separator bg-bg-weak" />

            <form @submit.prevent="onSubmit" class="Editor_main" v-show="constellation || read == 'public'">
                <input-area class="fx-grow" :placeholder="placeholder" v-model="formData.content" ref="input" />
            </form>

            <div class="bg-bg-strong p-20" v-if="images.length > 0 || formData.embed || isEmbedLoading">
                <div class="+mt-10" v-if="images.length > 0">
                    <content-type-images :images="images" :is-editor="true" @delete="onImageDelete" />
                </div>

                <placeholder class="+mt-10" :height="140" v-if="isEmbedLoading" />
                <div class="+mt-10" v-else-if="formData.embed">
                    <content-type-embed v-bind="formData.embed" :disable-link="true">
                        <button-base type="button" :modifiers="['xs', 'round', 'weak']" icon-before="times" @click="onDeleteEmbed" />
                    </content-type-embed>
                </div>

                <form-errors class="mt-15" :items="errors" />
            </div>
        </div>
        <template slot="footer">
            <div class="fx-grow" v-show="constellation || read == 'public'">
                <div class="p-15 bg-bg-xstrong" v-if="enableTags">
                    <input-tag-select
                        :value="formData.tags"
                        :dyn="dynTags"
                        :tags="availableTags"
                        @exclude="(v) => excludedTags = [ ...excludedTags, v]"
                        @input="(v) => formData.tags = v"
                        @focused="(v) => isTagFocused = v"
                        placeholder="Ajouter des tags..."
                    />
                </div>

                <div class="p-15" v-if="!isTagFocused || $biggerThan('s')">
                    <div class="mb-5 pv-5 pr-5 pl-15 br-xs bg-bg-weak fx-center">
                        <p class="ft-s-medium mr-10">Ajouter :</p>

                        <div>
                            <input-file icon="images" :multiple="true" @input="addImages" :disabled="images.length > 3" />
                        </div>
                    </div>

                    <div class="pv-5">
                        <button-base :modifiers="['cosmoz', 'full']" icon-before="paper-plane" type="submit" @click="onSubmit" :loading="isLoading">
                            Envoyer
                        </button-base>
                    </div>
                </div>
            </div>
        </template>
    </popin>
</template>

<script>
import * as linkify from 'linkifyjs'
import Debounce from 'lodash.debounce'

export default {
    name: 'Editor',
    data: () => ({
        excludedTags: [],
        excludedLinks: [],
        isTagFocused: false,
        isEmbedLoading: false,
        constellation: '',
        gathering: '',
        placeholder: '',
        read: '',
        defaultTags: [],
        enableTags: true,
        isLoading: false,
        errors: [],
        formData: {
            content: '',
            images: [],
            tags: [],
            embed: null
        }
    }),
    computed: {
        isActive () {
            return this.$store.state.page.popins.editor
        },
        gatheringData () {
            if (!this.gathering) return null

            return this.$store.getters['gathering/findOne']({ _id: this.gathering })
        },
        images () {
            return this.formData.images ? this.formData.images.map(image => URL.createObjectURL(image)) : []
        },
        availableTags () {
            return this.$store.getters['tag/find']({
                constellation: this.constellation,
                sort: { count: 'asc' }
            })
        },
        dynTags () {
            return []
            
            let matches = this.formData.content.match(/#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g)

            return matches ? matches.map(m => m.replace(/[-'`~!@#$%^&*()_|+=?;: '",.<>\{\}\[\]\\\/]/gi, '')).filter(m => !this.excludedTags.includes(m)) : []
        }
    },
    watch: {
        isActive (v) {
            if (v) {
                let data = {
                    placeholder: 'Publier quelque chose...',
                    ...v
                }

                Object.keys(data).forEach(key => {
                    this.$set(this, key, data[key])
                })

                if (this.$refs.consteSelect && !this.constellation) {
                    this.$refs.consteSelect.focus()
                } else if (this.$refs.input) {
                    this.$refs.input.focus()
                }
            }
        },
        constellation (v) {
            if (v && this.$refs.input) setTimeout(() => this.$refs.input.focus(), 100)
        },
        defaultTags: {
            immediate: true,
            handler (v) {
                this.formData.tags = v
            }
        },
        ['formData.content']: Debounce(async function (v) {
            let links = linkify.find(v).filter(l => !this.excludedLinks.includes(l.href))
            
            if (links[0]) {
                this.isEmbedLoading = true

                const response = await this.$store.dispatch('scraper/scrape', links[0].href)

                if (response && response.title) {
                    this.formData = { 
                        ...this.formData,
                        embed: {
                            href: links[0].href,
                            title: response.title,
                            image: response.image,
                            description: response.description,
                        }
                    }
                }

                this.isEmbedLoading = false
            }
        }, 1500)
    },
    methods: {
        reset () {
            this.formData = {
                content: '',
                tags: this.defaultTags,
                images: [],
                embed: null
            }

            this.excludedLinks = []
            this.excludedTags = []

            this.$store.commit('page/popin', { editor: false })
        },
        async onSubmit () {
            this.formData.tags = [ ...this.formData.tags, ...this.dynTags ]

            this.isLoading = true
            this.errors = []

            try {
                let data = { ...this.formData, read: this.read }

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

                if (this.formData.tags && this.formData.tags.includes('présentations')) {
                    this.$emit('introduced')
                }

                this.reset()
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        addImages (v) {
            this.formData.images = [
                ...this.formData.images,
                ...v
            ].slice(0, 4)
        },
        onImageDelete (index) {
            this.formData.images = this.formData.images.filter((c, i) => i != index)
        },
        onDeleteEmbed () {
            this.excludedLinks = [
                ...this.excludedLinks,
                this.formData.embed.href
            ]

            this.formData.embed = null
        }
    }
}
</script>

<style lang="scss" scoped>
.Editor {

}

.Editor_content {
    display: flex;
    flex-direction: column;
    min-height: 280px;
}

.Editor_main {
    padding: 10px;
    flex-grow: 1;
    display: flex;
}



@include breakpoint-xs {

}
</style>