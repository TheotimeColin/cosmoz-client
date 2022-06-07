<template>
    <label :for="id" class="InputFile" :class="{ 'is-icon': icon }">
        <button-base tag="div" :modifiers="['round', 'xs', 'xweak']" :icon-before="icon" v-if="icon" />
        <div class="InputFile_title" v-else>
            <p class="ft-3xl">
                <fa class="color-ft-xweak mb-20" icon="far fa-cloud-upload" />
            </p>

            {{ label }}
        </div>

        <input type="file" :id="id" @change="onChange" ref="input" :multiple="multiple" :accept="accept.join(', ')">
    </label>
</template>

<script>
export default {
    name: 'InputFile',
    props: {
        id: { type: [String, Number], default: 'input-file' },
        multiple: { type: Boolean, default: false },
        accept: { type: Array, default: () => ['image/png', 'image/jpeg'] },
        max: { type: Number, default: 4 },
        label: { type: String, default: 'Sélectionner un fichier' },
        icon: { type: String, default: '' },
    },
    methods: {
        onChange (e) {
            let files = Object.keys(e.target.files).map(key => e.target.files[key])
            
            this.$emit('input', this.multiple ? files.slice(0, this.max) : files[0])
        }
    }
}
</script>

<style lang="scss" scoped>
.InputFile {
    background-color: var(--color-bg-weak);
    border: 2px dotted var(--color-border);
    border-radius: 4px;
    min-height: 150px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 100ms ease;

    &:hover {
        background-color: var(--color-bg-weak);
    }
    
    input {
        opacity: 0;
        pointer-events: none;
        position: absolute;
        width: 1px;
        height: 1px;
    }

    &.is-icon {
        min-height: 0;
        background-color: transparent;
        border: none;
        padding: 0;
        display: block;
        border-radius: 0;
    }
}

.InputFile_title {
    font: var(--ft-s-medium);
    text-align: center;
}
</style>