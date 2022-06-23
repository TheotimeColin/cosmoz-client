<template>
    <popin :is-active="isActive" query="conste-create" :modifiers="['s']" @close="onClose">
        <template slot="content">
            <div class="p-30">
                <const-create />
            </div>
        </template>
    </popin>
</template>

<script>

export default {
    name: 'RegisterPopin',
    data: () => ({
        errors: [],
        isSuccess: false,
        formData: {
            name: '',
            email: ''
        }
    }),
    computed: {
        isActive () {
            return this.$store.state.page.popins.constellationCreate ? true : false
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { constellationCreate: false })
        }
    }
}
</script>