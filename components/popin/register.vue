<template>
    <popin :is-active="isActive" :modifiers="['s']" @close="onClose">
        <template slot="content">
            <div class="p-30">
                <register-form class="strong" :type="$store.state.page.popins.register == 'login' ? 'login' : 'register'" @success="onClose" />
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
            return this.$store.state.page.popins.register ? true : false
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/register', null)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Insta {
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: cover;
        background-position: center;

        &::before {
            content: "";
            display: block;
            @include ratio(33.33);
        }
    }
</style>