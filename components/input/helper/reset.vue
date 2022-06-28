<template>
    <div class="InputBase_reset" @click="$emit('click')" v-show="isActive">
        <i class="fal fa-redo fa-sm"></i>
    </div>
</template>

<script>
export default {
    name: 'HelperReset',
    props: {
        isActive: { type: Boolean, default: false }
    }
}
</script>