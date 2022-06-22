<template>
    <div class="InputBase InputDate is-value">
        <label class="InputBase_label">{{ label }}</label>
        <input class="InputBase_element" v-bind="attrs" type="date" v-model="localValue">
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
        attrs: { type: Object, default: () => {} }
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
                this.localValue = v ? this.$moment(v).format('yyyy-MM-DD') : null
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