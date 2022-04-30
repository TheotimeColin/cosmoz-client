<template>
    <div class="Insert" v-if="node">
        <component :is="component" :is-insert="true" :modifiers="['insert']" />
    </div>
</template>

<script>

export default {
    name: 'Insert',
    components: {},
    props: {
        node: { type: Object, default: null },
    },
    computed: {
        component () { return this.$props.node.attrs.id }
    }
}
</script>

<style lang="scss" scoped>
    .Insert {
        margin: 40px 0;
    }
</style>