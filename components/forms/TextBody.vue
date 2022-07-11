<template>
    <div class="TextBody TextBody--no-edit" :class="[ ...$modifiers ]">
        <div v-if="truncate && !display">
            {{ $ellipsis($options.filters.striptags(value), truncate) }}
            <link-base v-if="$options.filters.striptags(value).length > truncate" @click="display = true">Afficher plus</link-base>
        </div>
        <template v-else>
            <div class v-html="value" v-if="!editor"></div>
            <editor-content :editor="editor" ref="text" v-if="editor" />

            <link-base class="mt-20" v-if="truncate && $options.filters.striptags(value).length > truncate" @click="display = false">Afficher moins</link-base>
        </template>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Blockquote, Image, Italic, OrderedList, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/plugins/tiptap/Link'
import StyledBlock from '@/plugins/tiptap/StyledBlock'
import Iframe from '@/plugins/tiptap/Iframe'
import Gallery from '@/plugins/tiptap/Gallery'
import InsertBlock from '@/plugins/tiptap/InsertBlock'
import LinkBase from '../base/link-base.vue'

export default {
    name: 'TextBody',
    components: { EditorContent, LinkBase },
    mixins: [ ModifiersMixin ],
    props: {
        value: { type: String, default: '' },
        truncate: { type: Number, default: 0 }
    },
    data: () => ({
        editor: null,
        display: false
    }),
    async mounted () {
        this.$data.editor = new Editor({
            editable: false,
            extensions: [
                new Heading({ levels: [1, 2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Blockquote(),
                new Image(),
                new Link(), new Iframe(), new StyledBlock(), new Gallery(),
                new InsertBlock()
            ],
            content: this.value
        })
    }
}
</script>