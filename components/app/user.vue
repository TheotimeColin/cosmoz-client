<template>
    <div class="AppUser">
        <user-icon v-bind="user" :no-link="true" :modifiers="['s']" />
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .AppUser {
        align-self: center;
    }
</style>