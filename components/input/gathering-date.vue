<template>
    <div class="InputDate">
        <div class="fx-center mb-10" v-for="(row, i) in localValue" :key="i">
            <input-base type="datetime-local" class="mr-5" v-model="row.date" />

            <select-base class="mr-5" v-model="row.category" :options="CATEGORIES" />

            <input-base type="text" placeholder="Lien Meetup" class="mr-5" v-model="row.link" />

            <input-base type="number" label="Restant" class="mr-5" v-model="row.left" />

            <button-base :modifiers="['round', 'xs']" icon-before="trash-alt" @click="onDelete(i)" />
        </div>

        <div class="text-center">
            <button-base icon-before="plus" :modifiers="['s']" @click="onAdd">
                Ajouter date
            </button-base>
        </div>
    </div>
</template>

<script>
const CATEGORIES = [
    { id: 0, label: `Ouvert à tous`, value: 0 },
    { id: 1, label: `-35 ans`, value: 1 },
    { id: 2, label: `Queer`, value: 2 },
    { id: 3, label: `Girls`, value: 3 },
]

import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'InputDate',
    components: { InputBase, SelectBase },
    props: {
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        CATEGORIES,
        localValue: []
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
                this.localValue = v ? JSON.parse(JSON.stringify(v)) : []
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                if (this.changesMade) this.$emit('input', v)
            }
        }
    },
    methods: {
        onDelete (id) {
            this.localValue.splice(id, 1)
        },
        onAdd () {
            this.localValue = [
                ...this.localValue,
                { date: new Date(), category: 1, link: '', left: 0 }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.InputDate {
    padding: 15px;
    border: 1px solid var(--color-border);
    border-radius: 5px;
}
</style>