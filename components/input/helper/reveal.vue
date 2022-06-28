<template>
    <div>
        <div class="InputBase_reveal">
            <i class="fal fa-eye-slash" v-if="isRevealed"></i>
            <i class="fal fa-eye" v-else></i>
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