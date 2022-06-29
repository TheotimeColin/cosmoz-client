<template>
    <div>
        <div class="InputBase_reveal">
            <fa icon="far fa-eye-slash" v-if="isRevealed" />
            <fa icon="far fa-eye" v-else />
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelperReveal',
    props: {
        isRevealed: { type: Boolean, default: false }
    }
}
</script>