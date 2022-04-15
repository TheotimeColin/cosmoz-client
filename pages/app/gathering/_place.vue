<template>
    <div class="Page bg-cream-xweak">
        <p class="color-cream-xstrong ft-title-m mb-30">Bienvenue à {{ placeId }}</p>

        <card :items="items" />
    </div>
</template>

<script>
export default {
    name: 'GatheringPlace',
    data: () => ({
        placeId: '',
        items: []
    }),
    created () {
        this.placeId = this.$route.params.place

        this.items = [
            { steps: [
                { title: "Bienvenue au Liquorium.", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît." },
                
                { title: "Sinon, tant pis." }
            ] },
            { steps: [
                { title: "Bienvenue au Liquorium.", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît." }
            ] }
        ]
    },
}
</script>

<style lang="scss" scoped>
.Page {
    padding: 30px;
    min-height: 100vh;
}
</style>