<template>
    <form @submit.prevent="onSubmit" class="Wrapper pv-40">
        <div class="d-flex d-block@s">
            <div class="fx-grow">
                <div class="block">
                    <p class="ft-title-s mb-30">De quoi s'agit-il ?</p>

                    <input-base class="Form_input" label="Lien de l'événement *" v-model="formData.link" :required="true" :is-loading="metaLoading" />

                    <input-base class="Form_input" label="Titre de la rencontre *" v-model="formData.title" :required="true" />
                    
                    <input-base class="Form_input" label="Qu'allez-vous faire ? *" v-model="formData.intro" placeholder="Se balader dans un parc et profiter du soleil !" :required="true" v-if="!isLink" />

                    <input-date-time class="Form_input" label="Date *" :required="true" v-model="formData.date" />
                </div>

                <div class="block mt-20 mt-40@xs">
                    <p class="ft-title-s mb-30">Où cela va-t-il se passer ?</p>
                    <input-base class="Form_input" label="Nom du lieu *" :required="true" v-model="formData.location"/>
                    <input-base class="Form_input" label="Adresse précise" v-model="formData.address" v-if="!isLink" />
                    <input-paper class="Form_input" label="Description du lieu" v-model="formData.venue" :base="true" v-if="!isLink" />
                </div>

                <div class="block mt-20 mt-40@xs">
                    <block-gathering
                        v-bind="formData"
                        :cover="coverPreview"
                        :no-link="true"
                        :status-only="true"
                        :const-only="true"
                        :constellation="false"
                    >
                        <button-base type="button" :modifiers="['round', 's', 'weak']" icon-before="pen" @click="options.cover = !options.cover" />
                    </block-gathering>

                    <transition name="fade">
                        <div class="mt-20 b p-15 br-s" v-if="options.cover">
                            <input-pexels @select="(v) => formData.coverSelect = v" />
                        </div>
                    </transition>
                </div>

                <div class="block mt-20 mt-40@xs" v-if="!isLink">
                    <p class="ft-title-s mb-30">Quel est le programme ?</p>
                    <input-paper class="Form_input" label="Description générale *" v-model="formData.description" :base="true" />
                    <input-paper class="Form_input" label="Informations importantes" v-model="formData.important" :base="true" />
                </div>

                <div class="block-r mt-20" v-if="!isLink">
                    <div class="fx-center">
                        <p class="ft-title-2xs">Limiter le nombre de places</p>
                        <input-toggle v-model="options.max" />
                    </div>

                    <transition name="fade">
                        <div class="mt-20" v-if="options.max">
                            <input-base type="number" label="Nombre de places" v-model="formData.max" :attrs="{ min: 5, max: 999 }" />
                        </div>
                    </transition>
                </div>

                <div class="block-r mt-10" v-if="!isLink">
                    <div class="fx-center">
                        <p class="ft-title-2xs">Autoriser les invités</p>
                        <input-toggle v-model="options.plus" />
                    </div>

                    <transition name="fade">
                        <div class="mt-20" v-if="options.plus">
                            <p class="mb-20">Combien d’amis peuvent accompagner les participants ? Vous pouvez autoriser jusqu’à 5 invités par personne.</p>
                            <input-base type="number" label="Maximum d'invités" v-model="formData.plus" :attrs="{ min: 0, max: 5 }" />
                        </div>
                    </transition>
                </div>
            </div>
            <div class="width-s fx-no-shrink ml-20 ml-0@s mt-15@s width-100@s">
                <div class="p-sticky" style="--offset: 20px;">
                    <div class="p-15 bg-bg-weak br-s text-right">
                        <input-select label="Statut" :options="$const.status" v-model="formData.status" class="mb-10" />

                        <button-base type="submit" :modifiers="['light']" :loading="isLoading">
                            Sauvegarder
                        </button-base>

                        <form-errors class="mt-20" :items="errors" />
                    </div>

                    <div class="bg-bg-weak p-15 br-s mt-15">
                        <div class="fx-center c-pointer" @click="options.danger = !options.danger">
                            <p>Danger zone</p> <fa icon="far fa-angle-down" />
                        </div>

                        <div class="mt-20" v-show="options.danger">
                            <link-base @click="deleteEntity">Annuler cet événement</link-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import EntityEditor from '@/mixins/entity-editor'

export default {
    mixins: [ EntityEditor ],
    props: {
        constellation: { type: Object }
    },
    async fetch () {
        await this.fetchEntity(this.$route.params.id)
    },
    data: () => ({
        entityType: 'gathering',
        inputs: ['cover', 'link', 'date', 'description', 'important', 'information', 'intro', 'location', 'address', 'max', 'status', 'subtitle', 'tags', 'title', 'venue', 'constellation'],
        metaLoading: false,
        options: {
            max: false,
            plus: false,
            danger: false,
            cover: false
        },
        defaultFormData: {
            status: 'draft',
            coverSelect: ''
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isLink () { return this.$route.query.link == 'true' || this.formData.link },
        coverPreview () {
            let preview = {}

            if (this.formData.coverSelect) {
                preview = {
                    medias: [ { size: 's', src: this.formData.coverSelect.src.medium } ]
                }
            } else if (this.formData.cover) {
                preview = this.formData.cover
            }
            
            return preview
        }
    },
    watch: {
        async ['formData.link'] (v) {
            if (!v || v == this.serverEntity?.link || !v.includes('http')) return

            this.metaLoading = true

            const response = await this.$store.dispatch('scraper/scrape', v)

            if (response?.title && !this.formData.title) {
                this.formData.title = response.title
            }
            
            if (response?.image && !this.formData.coverSelect) {
                this.formData.coverSelect = {
                    photographer: '',
                    src: {
                        small: response.image,
                        medium: response.image,
                    }
                }
            }
            
            this.metaLoading = false
        }
    },
    methods: {
        dataMerge () {
            return {
                constellation: this.constellation._id
            }
        },
        postCreated () {
            if (!this.formData.cover) this.options.cover = true
        },
        postDelete () {
            this.$router.push({ path: this.localePath({ name: `c-slug-manage-events`, params: { slug: this.constellation.slug } }) })
        },
        postSubmit () {
            this.formData.coverSelect = ''
        },
        postSubmitSuccess () {
            this.$router.push({
                path: this.localePath({ name: 'c-slug-manage-events-id', params: { slug: this.constellation.slug, id: this.currentId } })
            })
        }
    },
    async mounted () {
        
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Organiser une rencontre`, fa: 'calendar-plus'
        })

        this.$emit('page', {            
            subtitle: `Organiser une rencontre`, fa: 'calendar-plus'
        })

        let meta = {
            title: `Organiser une rencontre ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>