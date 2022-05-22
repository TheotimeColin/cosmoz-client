<template>
    <popin :is-active="isActive" @close="$store.commit('page/register', null)">
        <template slot="content">
            <div class="strong p-30">
                <register-form />
            </div>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'RegisterPopin',
    computed: {
        isActive () {
            return this.$store.state.page.popins.register ? true : false
        }
    }
}
</script>