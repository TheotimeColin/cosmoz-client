<template>
    <div class="EntityEditor">
        <div class="row">
            <div class="col-8">
                <div>
                    <component
                        v-for="input in form"
                        class="EntityEditor_input"
                        :is="getInput(input)"
                        v-model="formData[input.key]"
                        v-bind="input"
                        :key="input.key"
                    />
                </div>
            </div>
            <div class="col-4">
                <div class="p-sticky" style="--offset: 40px;">
                    <component
                        :is="blockType.type"
                        :class="blockType.classes"
                        v-bind="formData"
                        v-if="blockType.type"
                    />

                    <hr class="Separator mv-20">

                    <div class="text-right">
                        <button-base @click="update">
                            Sauvegarder
                        </button-base>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'
import Decoders from '@/utils/decoders'

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
        changesMade () {
            return JSON.stringify(this.parseForm(this.formData)) != JSON.stringify(this.parseForm(this.prevFormData))
        },
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
        defaultForm () {
            return this.form.reduce((form, input) => {
                let result = null

                if (input.type == 'string') result = ''
                if (input.type == 'medias' || input.type == 'gathering-date') result = []

                return { ...form, [input.key]: result }
            }, {})
        },
        getInput (input) {
            let type = 'input-base'

            if (input.type == 'media') type = 'input-media'
            if (input.type == 'gathering-date') type = 'input-gathering-date'

            return type
        },
        decodeForm (form) {
            return Decoders[this.entityType].decode(form)
        },
        parseForm (form) {
            return Decoders[this.entityType].parse(form)
        },
        async deleteEntity () {
            // let response = await this.$store.dispatch('articles/delete', this.$data._id)

            // if (response.status == 1) {
            //     this.$router.push({ path: this.localePath({ name: 'admin-articles' }) })
            // }
        },
        async update () {
            let response = await this.$store.dispatch(`${this.entityType}/create`, {
                _id: this._id && this._id != 'new' ? this._id : undefined,
                params: this.parseForm(this.formData),
            })

            if (response.status == 1) {
                this._id = response.data._id
                
                this.$router.push({ path: this.localePath({ name: `${this.entityType}s-id`, params: { id: this._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.EntityEditor_input {

    & + & {
        margin-top: 10px;
    }
}
</style>