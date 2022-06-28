<template>
    <div v-if="$constellation">
        <form @submit.prevent="onSubmit" class="Wrapper Wrapper--xs pv-40">
            <div class="block">
                <button-base :modifiers="['s', 'xweak']" type="button" @click="leaveConste" :loading="isLoading">
                    Quitter la constellation
                </button-base>
            </div>
        </form>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ConstellationMixin],
    layout: 'app',
    async fetch() {
        await this.$preFetch()
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    methods: {
        async leaveConste () {
            this.isLoading = true

            await this.$store.dispatch('constellation/leave', this.$constellation._id)
            
            this.isLoading = false

            this.$router.push(this.localePath({ name: 'c-slug', params: { slug: this.$constellation.slug } }))
        }
    }
}
</script>

<style lang="scss" scoped>
.Image {
    background-size: cover;
    background-position: center;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;

    &::before {
        @include ratio(50);
    }
}

.Logo {
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    position: relative;
    overflow: hidden;
}

.Logo_edit {
    @include absolute-fill;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all 200ms ease;
    opacity: 0;

    .InputFile {
        position: absolute;
    }

    &:hover {
        opacity: 1;
    }
}
</style>