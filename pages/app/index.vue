<template>
    <div class="">
        <app-banner :background="$bg.iceCream">
            Envie de sortir ?
        </app-banner>
        <div class="Wrapper">
            <p class="ft-title-l mt-30">Commencent bientôt</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: 'onboarded',
    layout: 'app'
}
</script>

<style lang="scss" scoped>
</style>