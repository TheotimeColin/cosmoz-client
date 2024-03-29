<template>
    <popin :is-active="isActive" :modifiers="['s']" query="publish" @close="$emit('close')" @open="$emit('open')" v-if="user">
        <div class="Editor_content" slot="content">
            <div class="fx-center p-15">
                <user-icon :display-name="true" :no-link="true" v-bind="user" />

                <div></div>
            </div>
            
            <hr class="Separator bg-bg-weak" />

            <form @submit.prevent="onSubmit" class="Editor_main">
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
            <div class="fx-grow">
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

                    <div class="mb-15 pv-5 pr-5 pl-15 br-xs bg-bg-weak fx-center">
                        <p class="ft-s-medium mr-10">Visible par :</p>

                        <div>
                            <button-base :modifiers="['s']" :image="consteData.logoSmall" :ellipsis="20" :text="consteData.name" v-if="consteData" />

                            <button-base :modifiers="['s']" icon-before="earth" v-else-if="read == 'public'">
                                Tout le monde
                            </button-base>

                            <button-base :modifiers="['s']" :image="user.profileSmall" v-else>
                                Mes amis
                            </button-base>
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
    props: {
        constellation: { type: String },
        isActive: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false },
        placeholder: { type: String },
        read: { type: String, default: 'public' },
        constellation: { type: String },
        defaultTags: { type: Array, default: () => ['présentations'] },
        enableTags: { type: Boolean, default: false },
        errors: { type: Array, default: () => [] }
    },
    computed: {  
        images () {
            return this.formData.images ? this.formData.images.map(image => URL.createObjectURL(image)) : []
        },
        consteData () {
            if (!this.constellation) return null

            return this.$store.getters['constellation/findOne']({ _id: this.constellation })
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
    data: () => ({
        excludedTags: [],
        excludedLinks: [],
        isTagFocused: false,
        isEmbedLoading: false,
        formData: {
            content: '',
            images: [],
            tags: [],
            embed: null
        }
    }),
    watch: {
        isActive (v) {
            if (v && this.$refs.input) this.$refs.input.focus()
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
        },
        onSubmit () {
            this.formData.tags = [ ...this.formData.tags, ...this.dynTags ]
            this.$emit('submit', this.formData)
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
    min-height: 100%;
}

.Editor_main {
    padding: 10px;
    flex-grow: 1;
    display: flex;
}



@include breakpoint-xs {

}
</style>