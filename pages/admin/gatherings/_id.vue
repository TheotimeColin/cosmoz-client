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
                key: 'location',
                type: 'string',
                label: `Zone`
            }
        ]
    }),
    created () {
        this._id = this.$route.params.id
    }
}
</script>