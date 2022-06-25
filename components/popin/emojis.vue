<template>
    <popin :is-active="isActive" query="emojis" :modifiers="['s']" @close="onClose">
        <template slot="content">
            <div class="d-flex height-100">
                <reaction-emoji-selector :is-active="isActive" @input="(v) => {
                    action(v); onClose(); 
                }" />
            </div>
        </template>
    </popin>
</template>

<script>

export default {
    name: 'RegisterPopin',
    data: () => ({

    }),
    computed: {
        isActive () {
            return this.$store.state.page.popins.emojis?.action ? true : false
        },
        action () {
            return this.isActive ? this.$store.state.page.popins.emojis.action : () => {}
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { emojis: false })
        }
    }
}
</script>