<template>
    <div class="p-60">
        <entity-editor
            :_id="_id"
            entity-type="gathering"
            :block-type="{ type: 'block-gathering', classes: 'max-width-s m-auto' }"
            :form="form"
        />
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'
import CONSTANTS from '@/utils/constants'

export default {
    name: 'GatheringEditPage',
    layout: 'admin',
    middleware: 'admin',
    components: { InputBase, SelectBase },
    data: () => ({
        _id: '',
        form: [
            {
                key: 'cover',
                type: 'media',
                label: `Couverture`
            }, {
                key: 'title',
                type: 'string',
                label: `Titre principal`
            }, {
                key: 'intro',
                type: 'textarea',
                label: `Introduction`
            }, {
                key: 'description',
                type: 'paper',
                label: `Description`
            }, {
                key: 'venue',
                type: 'paper',
                label: `Le lieu`
            }, {
                key: 'location',
                type: 'string',
                label: `Zone`
            }, {
                key: 'max',
                type: 'number',
                label: `Nombre de participants`
            }, {
                key: 'date',
                type: 'datetime-local'
            }, {
                key: 'status',
                type: 'select',
                label: 'Statut',
                options: CONSTANTS.status
            }
        ]
    }),
    created () {
        this._id = this.$route.params.id
    }
}
</script>