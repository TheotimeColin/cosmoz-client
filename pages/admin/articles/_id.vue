<template>
    <div class="p-60">
        <entity-editor
            :_id="_id"
            entity-type="article"
            :block-type="{ type: 'block-article', classes: ['bg-bg-light p-20'] }"
            :form="form"
        />
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'
import CONSTANTS from '@/utils/constants'

export default {
    name: 'ArticleEditPage',
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
                key: 'excerpt',
                type: 'string',
                label: `Extrait`
            }, {
                key: 'content',
                type: 'paper',
                label: 'Contenu'
            }, {
                key: 'category',
                type: 'select',
                label: 'Catégorie',
                options: CONSTANTS.articleCategories
            }, {
                key: 'slug'
            }
        ]
    }),
    created () {
        this._id = this.$route.params.id
    }
}
</script>