<template>
    <div class="InputBase_errors" :class="{ 'is-active': isActive }">
        <i class="InputBase_errorValid fal fa-check" v-show="isValid"></i>
        <i class="InputBase_errorInvalid fal fa-times" v-show="!isValid"></i>

        <div class="InputBase_errorPopin">
            <template v-for="error in errors">
                {{ error }}
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelperErrors',
    props: {
        errors: { type: Array, default: () => [] },
        isValid: { type: Boolean, default: true },
        isActive: { type: Boolean, default: false }
    }
}
</script>

<style>
</style>