<template>
    <div class="UserList">
        <div class="UserList_icons">
            <div class="UserList_iconContainer" v-for="item in items" :key="item._id">
                <user-icon class="UserList_icon" v-bind="item" :no-link="true"  />
            </div>
        </div>
        <div class="ft-title-3xs ml-5 fx-no-shrink">
            {{ items.length }} participent
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .UserList {
        display: flex;
        align-items: center;
        padding: 5px;
        background-color: var(--color-bg);
        border-radius: 50px;
        padding-right: 15px;
    }

    .UserList_icons {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        padding-right: 35px;
    }

    .UserList_iconContainer {
        position: relative;
        height: 35px;
        width: 1px;
    }

    .UserList_icon {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>