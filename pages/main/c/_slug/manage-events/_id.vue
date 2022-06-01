<template>
    <form @submit.prevent="onSubmit" class="Wrapper pv-40">
        <p class="ft-title-s mb-30">De quoi s'agit-il ?</p>

        <input-base class="mv-15" label="Titre de la rencontre" v-model="formData.title"/>
        <input-base class="mv-15" label="Qu'allez-vous faire ?" v-model="formData.intro"/>

        
        <p class="ft-title-s mt-40 mb-30">Où cela va-t-il se passer ?</p>
        <input-base class="mv-15" label="Nom du lieu" v-model="formData.location"/>
        <input-base class="mv-15" label="Adresse précise" v-model="formData.address"/>
        <input-paper class="mv-15" label="Description du lieu" v-model="formData.venue" :base="true" />

        <div class="text-right">
            <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
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
        prevFormData: {},
        formData: {}
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