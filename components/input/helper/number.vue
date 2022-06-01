<template>
    <div>
        <div class="InputBase_minus" @click="$emit('decrement')">
            <i class="fal fa-minus"></i>
        </div>

        <div class="InputBase_plus" @click="$emit('increment')">
            <i class="fal fa-plus"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelperNumber'
}
</script>