<template>
    <div class="CreatePopin" :class="{ 'is-active': isActive }">
        <div class="fx-grow">
            
        </div>
        <div class="row-xs">
            <div class="col-4 text-center CreatePopin_item">
                <button-base :modifiers="['round', 'l', 'transparent', 'bordered']" icon-before="calendar" @click="$store.commit('page/popin', { eventCreate: 'new', reset: true })" />
                <p class="ft-s-medium mt-5 color-ft-weak">Sortie</p>
            </div>
            <div class="col-4 text-center CreatePopin_item">
                <button-base :modifiers="['round', 'l', 'transparent', 'bordered']" icon-before="message-plus" @click="$store.commit('page/popin', { editor: {}, reset: true })" />
                <p class="ft-s-medium mt-5 color-ft-weak">Publication</p>
            </div>
            <div class="col-4 text-center CreatePopin_item">
                <button-base :modifiers="['round', 'l', 'transparent', 'bordered']" icon-before="sparkles" @click="$store.commit('page/popin', { constellationCreate: true, reset: true })" />
                <p class="ft-s-medium mt-5 color-ft-weak">Groupe</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CreatePopin',
    data: () => ({
        
    }),
    watch: {
        isActive (v) {
            if (v) {
                this.$router.push({ query: { ...this.$route.query, create: 'true' } })
            } else {
                this.$router.replace({ query: { ...this.$route.query, create: undefined } })
            }

            this.$store.commit('page/toggleOverflow',  !v)
        }
    },
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
    position: fixed;
    z-index: 75;
    top: -200%;
    height: calc(100% - var(--sticky-height, 60px)); 
    width: 100%;
    background-color: color-opacity('bg-xstrong', -10%);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 150ms ease;
    padding: 40px;
    display: flex;
    flex-direction: column;

    &.is-active {
        top: 0%;
        opacity: 1;

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

.CreatePopin_item {
    transform: translateY(10px) scale(0.95);
    transform-origin: center;
    transition: all 150ms ease;
    opacity: 0;
}
</style>