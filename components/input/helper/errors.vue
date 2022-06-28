<template>
    <div class="InputBase_errors" :class="{ 'is-active': isActive }">
        <fa icon="far fa-check" class="InputBase_errorValid" v-show="isValid"></fa>
        <fa icon="far fa-times" class="InputBase_errorInvalid" v-show="!isValid"></fa>

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

<style lang="scss" scoped>

.InputBase_errorInvalid,
.InputBase_errorValid {
    color: var(--color-ft-light);
}
</style>