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
                key: 'subtitle',
                type: 'string',
                label: `Sous-titre`
            }, {
                key: 'meetup',
                type: 'string',
                label: `Lien Meetup`
            }, {
                key: 'price',
                type: 'number',
                label: `Prix`
            }, {
                key: 'included',
                type: 'string',
                label: `Ce qui est inclus`
            },  {
                key: 'location',
                type: 'string',
                label: `Zone`
            }, {
                key: 'dates',
                type: 'gathering-date'
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