<template>
    <div class="Wrapper--s pv-100">
        <div v-for="i in 15" :key="i">
            {{ getName() }}
        </div>
    </div>
</template>

<script>
import userId from '@/utils/user-id'
export default {
    methods: {
        getName () {
            return this.$random(userId.names) + '.' + this.$random(userId.adjectives)
        }
    }
}
</script>

<style>

</style>