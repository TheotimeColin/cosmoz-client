<template>
    <div>
        <button-base :modifiers="['round', 'xs']" type="button" @click="$emit('decrement')" icon-before="plus" />
        <button-base :modifiers="['round', 'xs']" type="button" @click="$emit('increment')" icon-before="plus" />
    </div>
</template>

<script>
export default {
    name: 'HelperNumber'
}
</script>