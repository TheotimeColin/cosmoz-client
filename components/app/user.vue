<template>
    <div class="AppUser">
        <div class="AppUser_list" :class="{ 'is-active': isActive }">
            <nav-list :items="userItems" @nav="isActive = false" />
        </div>
        
        <user-icon v-bind="user" :no-link="true" :modifiers="['s']" @click.native="isActive = !isActive" />
    </div>
</template>

<script>
export default {
    data: () => ({
        isActive: false,
        listeners: {
            close: null,
        }
    }),
    computed: {
        userItems () {
            if (!this.user) return []

            return [
                {
                    label: `Mon réseau`,
                    fa: 'sparkles',
                    to: { name: 'constellation' }
                }, {
                    label: `Voir mon profil`,
                    fa: 'user',
                    to: { name: 'p-userId', params: { userId: this.user.id } }
                }, {
                    label: `Mes paramètres`,
                    fa: 'cog',
                    to: { name: 'compte' }
                }, {
                    label: `Me déconnecter`,
                    fa: 'arrow-right-from-bracket',
                    to: { name: 'compte-logout' }
                }
            ]
        },
    },
    mounted () {
        this.listeners.close = (e) => {
            if (!this.$el.contains(e.target)) this.isActive = false
        }

        document.addEventListener('click', this.listeners.close)
    },
    beforeDestroy () {
        document.removeEventListener('click', this.listeners.close)
    }
}
</script>

<style lang="scss" scoped>
    .AppUser {
        align-self: center;
        position: relative;
        width: 55px;
        text-align: center;
    }

    .AppUser_list {
        width: 300px;
        position: absolute;
        top: -8px;
        right: 10px;
        width: 250px;
        transform: translate3d(0%, calc(-100% + 10px), 0);
        padding: 6px;
        border-radius: 6px;
        background-color: var(--color-bg-2xstrong);
        @include shadow;

        pointer-events: none;
        opacity: 0;
        transition: all 150ms ease;
        
        &.is-active {
            pointer-events: all;
            opacity: 1;
            transform: translate3d(0%, -100%, 0);
        }
    }
</style>