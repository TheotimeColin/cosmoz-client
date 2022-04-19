<template>
    <div class="p-60">
        <entity-editor
            :_id="_id"
            entity-type="location"
            :form="form"
        />
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'LocationEditPage',
    layout: 'admin',
    middleware: 'admin',
    components: { InputBase, SelectBase },
    data: () => ({
        _id: '',
        form: [
            {
                key: 'title',
                type: 'string',
                label: `Nom de l'établissement`
            }
        ]
    }),
    created () {
        this._id = this.$route.params.id
    }
}
</script>