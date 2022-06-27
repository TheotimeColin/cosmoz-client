<template>
    <div class="Message">
        <div class="Message_author">
            <user-icon v-bind="author" />
        </div>
        <div class="Message_container">
            <div class="Message_item" v-for="message in items" :key="message.content">
                {{ message.content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        author: { type: Object },
        items: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss">
.Message {
    display: flex;
}

.Message_container {
    margin-left: 5px;
}

.Message_item {
    background: var(--color-cosmoz);
    padding: 10px;
    border-radius: 6px;
}

</style>