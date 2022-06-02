<template>
    <form @submit.prevent="onSubmit" class="Wrapper pv-40">
        <div class="d-flex">
            <div class="fx-grow">
                <div class="block">
                    <p class="ft-title-s mb-20">De quoi s'agit-il ?</p>

                    <input-base class="mv-15" label="Titre de la rencontre *" v-model="formData.title" :required="true" />
                    <input-base class="mv-15" label="Qu'allez-vous faire ? *" v-model="formData.intro" placeholder="Se balader dans un parc et profiter du soleil !" :required="true" />
                    <input-date-time class="mt-15" label="Date *" :required="true" v-model="formData.date" />
                </div>

                <div class="block mt-20">
                    <p class="ft-title-s mb-20">Où cela va-t-il se passer ?</p>
                    <input-base class="mv-15" label="Nom du lieu *" :required="true" v-model="formData.location"/>
                    <input-base class="mv-15" label="Adresse précise" v-model="formData.address"/>
                    <input-paper class="mt-15" label="Description du lieu" v-model="formData.venue" :base="true" />
                </div>

                <div class="block mt-20">
                    <block-gathering
                        v-bind="formData"
                        :cover="coverPreview"
                        :no-link="true"
                        :status-only="true"
                        :const-only="true"
                        class="mb-20"
                    />

                    <input-pexels @select="(v) => formData.coverSelect = v" />
                </div>

                <div class="block mt-20">
                    <p class="ft-title-s mb-20">Quel est le programme ?</p>
                    <input-paper class="mv-15" label="Description générale *" v-model="formData.description" :base="true" />
                    <input-paper class="mt-15" label="Informations importantes" v-model="formData.important" :base="true" />
                </div>

                <div class="block mt-20">
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

                <div class="block mt-10">
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

                <div class="text-right mt-20">
                    <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
                </div>
            </div>
            <div class="width-xs fx-no-shrink ml-20">
                Heu
            </div>
        </div>
    </form>
</template>

<script>
import Decoders from '@/utils/decoders'

export default {
    async fetch () {
        this.currentId = this.$route.params.id

        this.currentId && this.currentId != 'new' ? await this.$store.dispatch(`gathering/get`, { query: { _id: this.currentId } }) : {}
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        currentId: '',
        isLoading: false,
        options: {
            max: false,
            plus: false
        },
        prevFormData: {},
        formData: {
            coverSelect: '',
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        serverEntity () {
            return this.$store.getters[`gathering/findOne`]({
                _id: this.currentId
            }, true)
        },
        changesMade () {
            return JSON.stringify(this.parseForm(this.formData)) != JSON.stringify(this.parseForm(this.prevFormData))
        },
        coverPreview () {
            let preview = ''

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
        serverEntity: {
            immediate: true,
            deep: true,
            handler (v) {
                let form = this.decodeForm(v)

                this.formData = {
                    ...this.formData,
                    ...form
                }

                this.prevFormData = { ...this.formData }
            }
        }
    },
    created () {
        this.currentId = this.$route.params.id

        this.formData = {
            ...this.decodeForm(this.formData),
            ...this.decodeForm(this.serverEntity)
        }

        this.isLoading = false
    },
    methods: {
        decodeForm (form) {
            return Decoders['gathering'].decode(form)
        },
        parseForm (form) {
            return Decoders['gathering'].parse(form)
        },
        async deleteEntity () {
            let response = await this.$store.dispatch(`gathering/delete`, this.currentId)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: `c-slug-manage-events`, params: { slug: this.constellation.slug } }) })
            }
        },
        async onSubmit () {
            let data = this.parseForm(this.formData)

            if (this.formData.coverSelect) {
                
            }

            let response = await this.$store.dispatch(`gathering/create`, {
                _id: this.currentId && this.currentId != 'new' ? this.currentId : undefined,
                params: data,
            })

            if (response.status == 1) {
                this.currentId = response.data._id
                
                this.$router.push({ path: this.localePath({ name: `c-slug-manage-events-id`, params: { slug: this.constellation.slug, id: this.currentId } }) })
            }
        }
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Organiser une rencontre`, fa: 'calendar-plus'
        })

        let meta = {
            title: `Organiser une rencontre ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>