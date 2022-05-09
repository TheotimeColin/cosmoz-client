<template>
    <div class="InputBase InputDate">
        <label class="InputBase_label">{{ label }}</label>
        <input class="InputBase_element" type="datetime-local" v-model="localValue">
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'InputDate',
    components: { InputBase },
    props: {
        label: { type: String, default: '' },
        value: { type: [String, Date] }
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
                this.localValue = (v ? this.$moment(v) : this.$moment()).format('yyyy-MM-DDThh:mm')
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                // console.log(v)
                if (this.changesMade) this.$emit('input', v)
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>