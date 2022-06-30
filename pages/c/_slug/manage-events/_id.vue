<template>
    <div class="Page">
        <form @submit.prevent="onSubmit" class="Page_wrapper Wrapper">
            <div class="d-flex d-block@s">
                <div class="fx-grow">
                    <!-- <div class="block">
                        <p class="ft-title-xs mb-10">Importer l'événement</p>
                        <p class="ft-s color-ft-weak mb-20">Si tu as créé l'événement sur une autre plateforme (Meetup,
                            EventBrite...), tu peux importer les informations grâce au lien.</p>

                        <input-base class="Form_input"
                            :label="`Lien de l'événement ${formData.linkRegister ? '*' : ''}`" v-model="formData.link"
                            :is-loading="metaLoading" :required="formData.linkRegister ? true : false" />

                        <div class="block-r d-flex fxa-center bg-bg-strong mt-10">
                            <input-toggle v-model="formData.linkRegister" />

                            <div class="ml-15">
                                <p class="ft-m-bold">Inscription obligatoire via le lien</p>
                                <p class="ft-s color-ft-weak">Les participants devront aussi s'inscrire sur le lien
                                    ci-dessus pour valider leur participation.</p>
                            </div>
                        </div>
                    </div> -->

                    <div class="block +mt-20 +mt-40@xs">
                        <p class="ft-title-xs mb-20">De quoi s'agit-il ?</p>

                        <input-base class="Form_input" label="Titre de la rencontre *" v-model="formData.title"
                            :required="true" />

                        <input-date-time class="Form_input" label="Date *" :required="true" v-model="formData.date" />
                    </div>

                    <div class="block +mt-20 +mt-40@xs">
                        <p class="ft-title-xs mb-20">Où cela va-t-il se passer ?</p>
                        <input-base class="Form_input" label="Nom du lieu *" :required="true"
                            v-model="formData.location" />
                        <input-base class="Form_input" label="Adresse précise" v-model="formData.address" />
                    </div>

                    <div class="block +mt-20 +mt-40@xs">
                        <block-gathering v-bind="formData" :cover="coverPreview" :no-link="true" :constellation="$constellation ? $constellation._id : ''" :status-only="true"
                            :const-only="true">
                            <button-base type="button" :modifiers="['round', 's', 'weak']" icon-before="pen" @click="options.cover = !options.cover" />
                        </block-gathering>

                        <input-pexels @select="(v) => formData.coverSelect = v" :is-active="options.cover" @close="options.cover = false" />
                    </div>

                    <div class="block +mt-20 +mt-40@xs">
                        <p class="ft-title-xs mb-20">Quel est le programme ?</p>
                        <input-paper class="Form_input" label="Description générale *" v-model="formData.description"
                            :base="true" />
                        <input-paper class="Form_input" label="Informations importantes" v-model="formData.important"
                            :base="true" />
                    </div>

                    <div class="block-r +mt-20 +mt-40@xs">
                        <div class="fx-center">
                            <p class="ft-title-2xs">Limiter le nombre de places</p>
                            <input-toggle v-model="options.max" />
                        </div>

                        <transition name="fade">
                            <div class="mt-20" v-if="options.max">
                                <input-base type="number" label="Nombre de places" v-model="formData.max"
                                    :attrs="{ min: 5, max: 999 }" />
                            </div>
                        </transition>
                    </div>

                    <div class="block +mt-20 +mt-40@xs">
                        <p class="ft-title-xs mb-20">Qui organise ?</p>
                        
                        <input-user-select placeholder="Chercher un membre..." :items="members" :min="1" v-model="formData.organizers" />
                    </div>

                    <div class="block +mt-20 +mt-40@xs" v-if="$constellation">
                        <p class="ft-title-xs mb-15">Qui peut participer ?</p>
                        
                        <input-radio-group v-model="formData.visibility" :options="[
                            { label: 'Seulement les membres de ' + $constellation.name, value: 'group' },
                            { label: 'Tout le monde', value: 'public' }
                        ]" />
                    </div>

                    <div class="+mt-20 +mt-40@xs d-flex block-r fxa-center" v-if="serverEntity">
                        <div class="width-3xs fx-no-shrink">
                            <qr-code :data="$config.baseUrl + localePath({ name: 'v-id', params: { id: serverEntity._id } })" v-if="isInit" />
                        </div>
                        
                        <div class="pl-20">
                            Fais scanner ce QR sur place pour que les participants puissent :
                            <div class="ft-m-medium pl-10 mt-5">
                                <p><fa icon="far fa-check" class="mr-5" /> Créer un compte en un clic</p>
                                <p><fa icon="far fa-check" class="mr-5" /> Rejoindre le groupe automatiquement</p>
                                <p><fa icon="far fa-check" class="mr-5" /> Obtenir le statut de Membre vérifié</p>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="block-r mt-10">
                        <div class="fx-center">
                            <p class="ft-title-2xs">Autoriser les invités</p>
                            <input-toggle v-model="options.plus" />
                        </div>

                        <transition name="fade">
                            <div class="mt-20" v-if="options.plus">
                                <p class="mb-20">Combien d’amis peuvent accompagner les participants ? Vous pouvez
                                    autoriser jusqu’à 5 invités par personne.</p>
                                <input-base type="number" label="Maximum d'invités" v-model="formData.plus"
                                    :attrs="{ min: 0, max: 5 }" />
                            </div>
                        </transition>
                    </div> -->
                </div>
                <div class="width-s fx-no-shrink ml-20 ml-0@s mt-15@s width-100@s">
                    <div class="p-sticky" style="--offset: 20px;">
                        <div class="p-15 bg-bg-weak br-s text-right">
                            <input-select label="Statut" :options="$const.status" v-model="formData.status"
                                class="mb-10" />

                            <button-base type="submit" :modifiers="['light']" :loading="isLoading">
                                Sauvegarder
                            </button-base>

                            <form-errors class="mt-20" :items="errors" />
                        </div>

                        <div class="bg-bg-weak p-15 br-s mt-15" v-if="!isNew">
                            <div class="fx-center c-pointer" @click="options.danger = !options.danger">
                                <p>Danger zone</p>
                                <fa icon="far fa-angle-down" />
                            </div>

                            <div class="mt-20" v-show="options.danger">
                                <link-base @click="deleteEntity">Annuler cet événement</link-base>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'
import EntityEditor from '@/mixins/entity-editor'

export default {
    mixins: [ ConstellationMixin, EntityEditor ],
    layout: 'app',
    async fetch () {
        await this.fetchEntity(this.$route.params.id)
        
        if (this.$constellation) {
            await this.$store.dispatch('user/softFetch', this.$constellation.members)
        }
    },
    transition (to, from) {
        if (to.name.includes('manage-events')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    data: () => ({
        entityType: 'gathering',
        inputs: ['cover', 'link', 'date', 'description', 'important', 'information', 'intro', 'location', 'address', 'max', 'status', 'subtitle', 'tags', 'title', 'venue', 'constellation', 'linkRegister', 'organizers', 'visibility'],
        metaLoading: false,
        options: {
            max: false,
            plus: false,
            danger: false,
            cover: false
        }
    }),
    computed: {
        isNew () { return this.$route.params.id == 'new' },
        defaultFormData () {
            return {
                status: 'draft',
                coverSelect: '',
                organizers: [ this.user._id ]
            }
        },
        members () {
            return this.$store.getters['user/find']({
                _id: { $in: this.$constellation?.members }
            })
        },
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
        ['formData.max'] (v) {
            this.options.max = v
        },
        ['options.max'] (v) {
            if (!v) this.formData.max = 0
        },
        async ['formData.link'] (v) {
            if (!v || v == this.serverEntity?.link || !v.includes('http')) return

            this.metaLoading = true

            const response = await this.$store.dispatch('scraper/scrape', v)

            if (response?.title && !this.formData.title) {
                this.formData = { ...this.formData, title: response.title }
            }
            
            if (response?.image && !this.formData.coverSelect) {
                this.formData = {
                    ...this.formData,
                    coverSelect: {
                        photographer: '',
                        src: {
                            medium: response.image,
                            large: response.image,
                        }
                    }
                }
            }
            
            this.metaLoading = false
        }
    },
    methods: {
        dataMerge () {
            return {
                constellation: this.$constellation._id
            }
        },
        postDelete () {
            this.$router.push({ path: this.localePath({ name: `c-slug-manage-events`, params: { slug: this.$constellation.slug } }) })
        },
        postSubmit () {
            this.formData.coverSelect = ''
        },
        postSubmitSuccess () {
            this.$router.replace({
                path: this.localePath({ name: 'c-slug-manage-events-id', params: { slug: this.$constellation.slug, id: this.currentId } })
            })
        }
    }
}
</script>