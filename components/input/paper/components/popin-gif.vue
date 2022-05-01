<template>
    <popin-base
        :modifiers="['s', 'absolute-header']"
        :is-active="isActive"
        @close="$emit('close')"
    >
        <template slot="content">
            <form class="strong p-20" @submit.prevent>
                <p class="ft-m-bold mb-20">Insérer un GIF</p>

                <input-base
                    label="Lien"
                    v-model="formData.link"
                />
            </form>
        </template>

        <template slot="footer">
            <div></div>

            <button-base
                :modifiers="['s']"
                @click="onSubmit"
            >
                Insérer GIF
            </button-base>
        </template>
    </popin-base>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'PopinGif',
    components: { InputBase },
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        formData: {
            link: ''
        }
    }),
    methods: {
        onSubmit () {
            this.$emit('input', this.formData.link)
            this.$emit('close')
        }
    }
}
</script>