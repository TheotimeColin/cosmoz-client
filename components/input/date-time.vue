<template>
    <div class="InputBase InputDate is-value">
        <label class="InputBase_label">{{ label }}</label>
        <input class="InputBase_element" type="datetime-local" v-model="localValue" :required="required">
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'InputDate',
    components: { InputBase },
    props: {
        label: { type: String, default: '' },
        value: { type: [String, Date] },
        required: { type: Boolean, default: false }
    },
    data: () => ({
        localValue: null
    }),
    computed: {
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.localValue = (v ? this.$moment(v) : this.$moment()).format('yyyy-MM-DDTHH:mm')
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                if (this.changesMade) this.$emit('input', v)
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>