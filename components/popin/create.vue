<template>
    <popin class="CreatePopin" :is-active="isActive" :modifiers="['s']" @close="onClose">
        <div class="CreatePopin_wrapper" slot="content">
            <div class="row-xs">
                <div class="col-4 text-center CreatePopin_item">
                    <button-base :modifiers="['round', 'l', 'bordered']" icon-before="calendar" @click="$store.commit('page/popin', { eventCreate: 'new', reset: true })" />
                    <p class="ft-s-medium mt-5 color-ft-weak">Sortie</p>
                </div>
                <div class="col-4 text-center CreatePopin_item">
                    <button-base :modifiers="['round', 'l', 'bordered']" icon-before="message-plus" @click="$store.commit('page/popin', { editor: {}, reset: true })" />
                    <p class="ft-s-medium mt-5 color-ft-weak">Publication</p>
                </div>
                <div class="col-4 text-center CreatePopin_item">
                    <button-base :modifiers="['round', 'l', 'bordered']" icon-before="sparkles" @click="$store.commit('page/popin', { constellationCreate: true, reset: true })" />
                    <p class="ft-s-medium mt-5 color-ft-weak">Groupe</p>
                </div>
            </div>
        </div>
    </popin>
</template>

<script>

export default {
    name: 'CreatePopin',
    data: () => ({
        
    }),
    computed: {
        isActive () {
            return this.$store.state.page.popins.create ? true : false
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { create: false })
        }
    }
}
</script>

<style lang="scss" scoped>
.CreatePopin {
    // position: fixed;
    // z-index: 75;
    // top: -200%;
    // height: calc(100% - var(--sticky-height, 60px)); 
    // width: 100%;
    // background-color: color-opacity('bg-xstrong', -10%);
    // backdrop-filter: blur(10px);
    // opacity: 0;
    // transition: opacity 150ms ease;

    &.is-active {

        .CreatePopin_item {
            transform: translateY(0) scale(1);
            opacity: 1;

            @for $i from 0 through 10 {

                &:nth-child(#{$i}) {
                    transition-delay: #{$i * 100}ms;
                }
            }
        }
    }
}

.CreatePopin_wrapper {
    padding: 40px;
}

.CreatePopin_item {
    transform: translateY(10px) scale(0.95);
    transform-origin: center;
    transition: all 150ms ease;
    opacity: 0;
}
</style>