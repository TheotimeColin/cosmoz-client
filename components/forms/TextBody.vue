<template>
    <div class="TextBody TextBody--no-edit" :class="[ ...$modifiers ]">
        <div class v-html="value" v-if="!editor"></div>
        <editor-content :editor="editor" ref="text" v-if="editor" />
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

export default {
    name: 'TextBody',
    components: { EditorContent },
    mixins: [ ModifiersMixin ],
    props: {
        value: { type: String, default: '' }
    },
    data: () => ({
        editor: null
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
            content: this.$props.value,
        })
    }
}
</script>