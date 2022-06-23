<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <const-create />
    </div>
</template>

<script>
export default {
    name: 'ConstellationCreate',
    middleware: ['loggedUser'],
    layout: 'app',
}
</script>