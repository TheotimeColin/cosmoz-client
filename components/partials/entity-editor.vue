<template>
    <form @submit.prevent class="EntityEditor strong">
        <div class="row">
            <div class="col-8">
                <slot name="left-before"></slot>

                <div class="bg-bg-xstrong p-30 br-s">
                    <div class="row-s">
                        <div class="EntityEditor_input" :class="[ `col-${input.col ? input.col : '12'}` ]" v-for="input in form.filter(i => getInput(i))" :key="input.key">
                            <component
                                :is="getInput(input)"
                                v-model="formData[input.key]"
                                v-bind="input"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="p-sticky" style="--offset: 40px;">
                    <component
                        :is="blockType.type"
                        :class="blockType.classes"
                        :modifiers="blockType.modifiers"
                        v-bind="formData"
                        v-if="blockType && blockType.type"
                    />

                    <hr class="Separator mv-20">

                    <div class="d-flex fxa-center mb-20" v-if="form.find(i => i.key == 'slug')">
                        <input-base
                            label="ID de la page"
                            v-model="formData.slug"
                        />

                        <div @click="generateSlug" class="ml-10">
                            <fa icon="far fa-redo" />
                        </div>
                    </div>

                    <div class="d-flex fxa-center mb-20" v-if="form.find(i => i.key == 'id')">
                        <input-base
                            label="ID de la page"
                            v-model="formData.id"
                        />

                        <div @click="generateId" class="ml-10">
                            <fa icon="far fa-redo" />
                        </div>
                    </div>

                    <div class="text-right">
                        <button-base @click="update">
                            Sauvegarder
                        </button-base>
                    </div>

                    <div class="bg-bg-weak p-15 br-s mt-20" v-if="!isNew">
                        <div class="fx-center c-pointer" @click="isDangerZone = !isDangerZone"><p>Danger zone</p> <fa icon="far fa-angle-down" /></div>

                        <div class="mt-20" v-show="isDangerZone">
                            <link-base @click="deleteEntity">Supprimer cet élément</link-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'
import Decoders from '@/utils/decoders'
import slugify from 'slugify'
import shortId from 'shortid'

export default {
    name: 'EntityEditor',
    components: { InputBase, SelectBase },
    async fetch () {
        this._id && this._id != 'new' ? await this.$store.dispatch(`${this.entityType}/get`, { query: { _id: this._id } }) : {}
    },
    props: {
        _id: { type: String, default: '' },
        entityType: { type: String },
        blockType: { type: Object, default: () => {} },
        form: { type: Array, default: () => [] }
    },
    data: () => ({
        isDangerZone: false,
        state: {
            isLoading: true,
        },
        prevFormData: {},
        formData: {}
    }),
    computed: {
        serverEntity () {
            return this.$store.getters[`${this.entityType}/findOne`]({ _id: this._id }, true)
        },
        async changesMade () {
            let current = await this.parseForm(this.formData)
            let prev = await this.parseForm(this.prevFormData)

            return JSON.stringify(current) != JSON.stringify(prev)
        },
        isNew () {
            return this._id == 'new'
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
        this.formData = {
            ...this.defaultForm(),
            ...this.decodeForm(this.formData),
            ...this.decodeForm(this.serverEntity)
        }

        this.state.isLoading = false
    },
    methods: {
        generateSlug () {
            let slug = this.$data.formData.title || this.$data.formData.name

            if (!slug) slug = 'no-data'

            this.formData.slug = slugify(slug, { lower: true, strict: true })
        },
        generateId () {
            this.formData.id = shortId.generate()
        },
        defaultForm () {
            return this.form.reduce((form, input) => {
                let result = null

                if (input.type == 'number') result = 0
                if (input.key == 'id') result = shortId.generate()
                if (input.type == 'date' || input.type == 'datetime-local') result = new Date()
                if (input.type == 'string' || input.type == 'paper') result = ''
                if (input.type == 'medias' || input.type == 'gathering-date') result = []

                return { ...form, [input.key]: result }
            }, {})
        },
        getInput (input) {
            let type = 'input-base'

            if (input.type == 'media') type = 'input-media'
            if (input.type == 'gathering-date') type = 'input-gathering-date'
            if (input.type == 'paper') type = 'input-paper'
            if (input.type == 'select') type = 'select-base'
            if (input.type == 'date' || input.type == 'datetime-local') type = 'input-date-time'
            if (input.key == 'slug' || input.key == 'id') type = null

            return type
        },
        decodeForm (form) {
            return Decoders[this.entityType].decode(form)
        },
        parseForm (form) {
            return Decoders[this.entityType].parse(form)
        },
        async deleteEntity () {
            let response = await this.$store.dispatch(`${this.entityType}/delete`, this._id)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: `${this.entityType}s` }) })
            }
        },
        async update () {
            let data = await this.parseForm(this.formData)

            Object.keys(data).forEach(key => {
                if (!this.form.find(f => f.key == key)) delete data[key]
            })

            let response = await this.$store.dispatch(`${this.entityType}/create`, {
                _id: this._id && this._id != 'new' ? this._id : undefined,
                params: data,
            })

            if (response.status == 1) {
                this._id = response.data._id
                
                this.$router.push({ path: this.localePath({ name: `${this.entityType}s-id`, params: { id: this._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })

            this.$emit('update', this.formData)
        }
    }
}
</script>

<style lang="scss" scoped>
.EntityEditor_input {
    margin-bottom: 15px;
}
</style>