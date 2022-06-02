
import Decoders from '@/utils/decoders'

export default {
    data: () => ({
        currentId: '',
        isLoading: false,
        errors: [],
        prevFormData: {},
        formData: {}
    }),
    computed: {
        serverEntity () {
            return this.$store.getters[`${this.entityType}/findOne`]({
                _id: this.currentId
            }, true)
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
        if (this.preCreated) this.preCreated()

        this.currentId = this.$route.params.id

        this.formData = {
            ...(this.defaultFormData ? this.defaultFormData : {}),
            ...this.decodeForm(this.formData),
            ...this.decodeForm(this.serverEntity)
        }

        this.isLoading = false
    },
    methods: {
        async fetchEntity (id) {
            this.currentId = id

            this.currentId && this.currentId != 'new' ? await this.$store.dispatch(`${this.entityType}/get`, { query: { _id: this.currentId } }) : {}
        },
        decodeForm (form) {
            return Decoders[this.entityType].decode(form)
        },
        async parseForm (form) {
            return await Decoders[this.entityType].parse(form, this)
        },
        async deleteEntity () {
            let response = await this.$store.dispatch(`${this.entityType}/delete`, this.currentId)

            if (response.status == 1) {
                if (this.postDelete) this.postDelete()
            }
        },
        async onSubmit () {
            try {
                this.errors = []
                let data = await this.parseForm(this.formData)

                Object.keys(data).forEach(key => {
                    if (!this.inputs.includes(key)) delete data[key]
                })

                if (this.dataMerge) data = { ...data, ...this.dataMerge() }

                let response = await this.$store.dispatch(`${this.entityType}/create`, {
                    _id: this.currentId && this.currentId != 'new' ? this.currentId : undefined,
                    params: data,
                })

                if (response.status == 1) {
                    this.currentId = response.data._id
                    
                    if (this.$route.params.id !== this.currentId) {
                        if (this.postSubmitSuccess) this.postSubmitSuccess()
                    }
                } else {
                    this.errors = [ response.error ]
                }
            } catch (e) {
                console.error(e)
            }

            if (this.postSubmit) this.postSubmit()
        }
    }
}