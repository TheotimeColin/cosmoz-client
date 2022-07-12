<template>
    <div class="TextEditor">
        <editor-menu-bar class="TextEditor_bar" :editor="editor" v-slot="{ isActive, getMarkAttrs, getNodeAttrs }" v-if="editable">
            <div class="TextEditor_menu">
                <div class="TextEditor_first">
                    <p class="ft-s color-ft-weak ml-5">{{ label }}</p>

                    <div class="fx-center">
                        <div class="TextEditor_group" v-for="(group, i) in groups" :key="i">
                            <component
                                v-for="command in group"
                                :is="command.component || 'button-editor'"
                                :is-active="isActive[command.id] ? isActive[command.id]() : false"
                                :icon="command.icon"
                                :current-node="command.isNode ? getNodeAttrs(command.value) : (command.isMark ? getMarkAttrs(command.value) : null)"
                                @click="command.setCurrent ? state.current = command.id : (command.command ? command.command() : editor.commands[command.id]())"
                                @update="(v) => command.onUpdate(v) || undefined"
                                :key="command.id"
                            />

                            <div class="TextEditor_separator" v-if="i !== groups.length - 1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </editor-menu-bar>

        <popin-link
            :is-active="state.current == 'linkSelect'"
            @input="editor.commands.link"
            @close="state.current = ''"
            v-if="editor"
        />

        <popin-youtube
            :is-active="state.current == 'iframe'"
            @input="insertIframe"
            @close="state.current = ''"
        />

        <popin-gif
            :is-active="state.current == 'gifSelect'"
            @input="(v) => insertImage(null, v)"
            @close="state.current = ''"
        />

        <media-library v-bind="libraryProps" @input="libraryProps.onInput" v-if="libraryProps" @close="libraryProps = false" />

        <div class="TextBody" v-html="value" v-if="!editor"></div>
        <editor-content class="TextEditor_content TextBody" :editor="editor" ref="text" v-if="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Italic, OrderedList, BulletList, ListItem, Placeholder } from 'tiptap-extensions'
import Link from '@/plugins/tiptap/Link'
import Iframe from '@/plugins/tiptap/Iframe'

import Gallery from '@/plugins/tiptap/Gallery'
import InsertBlock from '@/plugins/tiptap/InsertBlock'
import StyledBlock from '@/plugins/tiptap/StyledBlock'
import ButtonEditor from './components/button-editor'
import ButtonHeadings from './components/button-headings'
import ButtonInsert from './components/button-insert'
import ButtonBlocks from './components/button-blocks'
import MediaLibrary from '@/components/interactive/media-library.vue'
import PopinLink from './components/popin-link.vue'
import PopinYoutube from './components/popin-youtube.vue'
import PopinGif from './components/popin-gif.vue'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, ButtonEditor, ButtonHeadings, ButtonInsert, ButtonBlocks, MediaLibrary, PopinLink, PopinYoutube, PopinGif },
    props: {
        value: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        label: { type: String, default: '' },
        base: { type: Boolean, default: false },
        editable: { type: Boolean, default: true }
    },
    data: () => ({
        state: {
            current: 'styleSelect'
        },
        libraryProps: false,
        editor: null,
        link: {
            href: '',
            blank: true
        },
        style: [],
        block: 'StyledBlock--pink',
        groups: []
    }),
    async mounted () {
        this.$data.editor = new Editor({
            editable: this.$props.editable,
            content: this.$props.value,
            extensions: [
                new Placeholder({ placeholder: 'lol' }),
                new Heading({ levels: [1, 2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Blockquote(),
                new Image(),
                new History(),
                new Link(), new StyledBlock(), new Iframe, new Gallery(),
                new InsertBlock()
            ],
        })

        this.$data.groups = this.base ? [
            [
                { id: 'undo', label: 'Annuler', icon: 'undo-alt' },
                { id: 'redo', label: 'Rétablir', icon: 'redo-alt' }
            ], [
                { id: 'bold', label: 'Gras', icon: 'bold' },
                { id: 'italic', label: 'Italique', icon: 'italic' }
            ],
        ] : [
            [
                { id: 'undo', label: 'Annuler', icon: 'undo-alt' },
                { id: 'redo', label: 'Rétablir', icon: 'redo-alt' }
            ], [
                { id: 'styleSelect', component: 'button-headings', value: 'heading', isNode: true, onUpdate: (v) => this.$data.editor.commands.heading({ level: v }) },
                { id: 'bold', label: 'Gras', icon: 'bold' },
                { id: 'italic', label: 'Italique', icon: 'italic' },
            ], [
                { id: 'fileSelect', label: 'Image', icon: 'image', command: () => this.libraryProps = {
                    isActive: true, max: 1, onInput: (v) => this.insertImage(v)
                } },
                { id: 'linkSelect', icon: 'link', setCurrent: true },
                { id: 'gifSelect', icon: 'gif', setCurrent: true },
                // { id: 'iframe', icon: 'play', setCurrent: true },
                { id: 'blockquote', label: 'Citation', icon: 'quote-right' },
                { id: 'bullet_list', label: 'Liste', icon: 'list-ul' },
                { id: 'ordered_list', label: 'Liste numérotée', icon: 'list-ol' },
                // { id: 'gallery', label: 'Galerie', icon: 'images', command: () => this.$emit('open-library', {
                //     props: { max: 3 }, onInput: (v) => this.insertGallery(v)
                // }) },
            ], [
                // { id: 'styledBlock', component: 'button-blocks', value: 'styledBlock', isNode: true, onUpdate: (v) => this.$data.editor.commands.styledBlock(v) },
                { id: 'insertBlock', component: 'button-insert', value: 'insertBlock', isNode: true, onUpdate: (v) => this.$data.editor.commands.insertBlock(v) },
            ]
        ]

        this.$data.editor.on('update', () => this.onUpdate())
        setTimeout(() => this.onUpdate(), 100)
    },
    methods: {
        onUpdate () {
            this.$emit('input', this.$data.editor.getHTML())
        },
        onInsertImage (command, image) {
            this.$data.state.fileSelect = false
            command({ src: image.src })
        },
        onInsertLink (command) {
            command(this.$data.link)
        },
        insertBlock () {
            this.$data.editor.commands.styledBlock()
        },
        insertIframe (data) {
            this.$data.editor.commands.iframe(data)
        },
        insertImage (media, absolute) {
            this.$data.editor.commands.image({
                src: absolute ? absolute : media.sizes.m.src,
                alt: media ? media.alt : '',
                title: media ? media.title : ''
            })
        },
        insertGallery (medias) {
            this.$data.editor.commands.gallery({ medias })
        }
    }
}
</script>

<style lang="scss">
.TextEditor {

}

.TextEditor_content {
    outline: none;

    .ProseMirror {
        min-height: 100px;
        border: 1px solid var(--color-border);
        outline: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        transition: all 100ms ease;

    }

    .ProseMirror-focused {
        border-color: var(--color-ft-xweak);
    }
}

.TextEditor_menu {
    position: sticky;
    z-index: 5;
    top: var(--header-height);
}

.TextEditor_first,
.TextEditor_second {
    background-color: var(--color-bg-xweak);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.TextEditor_first {
    position: relative;
    z-index: 2;
}

.TextEditor_second {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-bg-strong);
    border: 1px solid var(--color-border);
    transform: translateY(0%);
    transition: all 100ms ease;

    &.is-active {
        transform: translateY(100%);
    }
}

.TextEditor_group {
    display: flex;
    align-items: center;
}

.TextEditor_button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    width: 30px;
    height: 30px;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0;
    transition: all 150ms ease;
    border-bottom: 2px solid transparent;
    position: relative;
    color: var(--color-ft-weak);
    
    &.is-active {
        color: var(--color-ft-light);
        border-color: var(--color-ft-light);
    }

    &:hover {
        background-color: var(--color-bg-weak);
        color: var(--color-ft-light);
    }
}

.TextEditor_button--sub {

    &:hover {
        
        .TextEditor_list {
            opacity: 1;
            pointer-events: all;
            transform: translateY(100%);
        }
    }
}

.TextEditor_list {
    position: absolute;
    z-index: 5;
    bottom: -2px;
    left: 0;
    width: 350px;
    background-color: var(--color-bg-light);
    border: 1px solid var(--color-border);
    transform: translateY(calc(100% - 10px));
    opacity: 0;
    pointer-events: none;
    border-radius: 6px;
    transition: all 100ms ease;
}

.TextEditor_separator {
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background-color: var(--color-border);
}
</style>