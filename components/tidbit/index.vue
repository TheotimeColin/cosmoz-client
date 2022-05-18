<template>
    <form @submit.prevent="onSubmit" class="Tidbit">
        <div class="Tidbit_title d-flex fx-align-center">
            <h2 class="ft-title-s fx-grow">{{ $t(`tidbits.${type}.title`) }}</h2>
                
            <div class="d-flex fxa-center">
                <button-base icon-before="pen" :modifiers="['xs', 'round', 'xweak']" @click="isEdit = true" v-if="!isEdit && editable"/>
            </div>
        </div>

        <component
            :is="`tidbit-${type}`"
            :is-edit="isEdit"
            :read="read"
            :editable="editable"
            :is-redacted="isRedacted"

            @lock="isLocked = true"
            @unlock="isLocked = false"

            v-model="formData.value"
        />

        <div class="Tidbit_footer fx-center" v-if="editable && isEdit && !isLocked">
            <div>
                <p class="ft-bold mb-10">Visible par :</p>

                <input-radio-group
                    v-model="formData.read"
                    :options="[
                        { label: 'Tout le monde', value: 'user', disabled: ['socials'].includes(type) },
                        { label: `Les personnes que j'ai rencontrées`, value: 'encountered' },
                        { label: 'Mes affinités', value: 'affinity' },
                    ]"
                />
            </div>
            
            <div>
                <link-base class="mr-5" @click="reset">Annuler</link-base>

                <button-base :modifiers="['light']" :loading="isLoading" :disabled="isDisabled">
                    Sauvegarder
                </button-base>
            </div>
        </div>

        <div class="bg-bg-xstrong pv-5 pv-10" v-if="value && editable && !isEdit">
            <div class="ft-s color-ft-xweak ml-10">
                <fa icon="far fa-eye" class="mr-3" /> {{ $t(`permissions.${formData.read ? formData.read : read}.subtitle`) }}
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'Tidbit',
    props: {
        type: { type: String },
        title: { type: String },
        read: { type: String },
        value: { type: [String, Object] },
        editable: { type: Boolean, default: false }
    },
    data: () => ({
        isEdit: false,
        isLoading: false,
        isLocked: false,
        formData: {
            read: 'affinity',
            value: {}
        }
    }),
    computed: {
        isRedacted () {
            return this.value == 'REDACTED'
        },
        isDisabled () {
            return this.isLocked
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                if (v) this.formData = { ...this.formData, value: v }
            }
        },
        read: {
            immediate: true,
            handler (v) {
                if (v) this.formData = { ...this.formData, read: v }
            }
        }
    },
    methods: {
        reset () {
            this.isEdit = false
            this.isLoading = false

            if (this.read) this.formData = { ...this.formData, read: this.read }
            if (this.value) this.formData = { ...this.formData, value: this.value }
        },
        async onSubmit () {
            this.isLoading = true

            await this.$store.dispatch('user/updateTidbit', {
                type: this.type,
                ...this.formData
            })
            
            this.reset()
        }
    }
}
</script>

<style lang="scss" scoped>
.Tidbit {
    background-color: var(--color-bg);
    position: relative;
    overflow: hidden;
    border-radius: 10px;
}

.Tidbit_title {
    min-height: 50px;
    padding: 5px 5px 0 20px;
}

.Tidbit_footer {
    background-color: var(--color-bg-xstrong);
    padding: 15px;
}
</style>