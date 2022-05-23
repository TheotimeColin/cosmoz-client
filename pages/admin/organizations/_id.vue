<template>
    <div class="p-60">
        <entity-editor
            :_id="_id"
            entity-type="organization"
            :block-type="{ type: 'block-orga', classes: 'max-width-s m-auto' }"
            :form="form"
        >
        </entity-editor>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'OrganizationEditPage',
    layout: 'admin',
    middleware: 'admin',
    components: { InputBase, SelectBase },
    data: () => ({
        _id: '',
        form: [ {
                key: 'slug'
            }, {
                key: 'cover',
                type: 'media',
                label: `Couverture`,
                col: '6'
            }, {
                key: 'logo',
                type: 'media',
                label: `Logo`,
                col: '6'
            }, {
                key: 'name',
                type: 'string',
                label: `Nom de l'organisation`
            }, {
                key: 'intro',
                type: 'textarea',
                label: `Court texte d'introduction`
            }, {
                key: 'location',
                type: 'string',
                label: `Zone`
            }
        ]
    }),
    computed: {
        organization () {
            return this.$store.getters[`organization/findOne`]({ _id: this._id }, true)
        },
    },
    created () {
        this._id = this.$route.params.id
    }
}
</script>