<template>
    <div class="CardDefault_steps" v-if="steps && steps.length > 1">
        <div class="CardDefault_step" :class="{ 'is-active': currentStep == i }" v-for="(step, i) in steps.length" :key="step"></div>
    </div>
</template>

<script>
export default {
    name: 'CardSteps',
    props: {
        steps: { type: Array, default: () => [] },
        currentStep: { type: Number, default: 0 }
    }
}
</script>

<style>

</style>