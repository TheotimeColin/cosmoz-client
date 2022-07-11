<template>
    <div class="EmojiButton">
        <button-base
            icon-before="face-smile"
            :modifiers="['s', text ? '' : 'round', isActive ? 'light' : 'xweak']"
            @click="$smallerThan('s') ? $store.commit('page/popin', { emojis: { action: (v) => $emit('input', v) } }) : {}"
            :text="text"
            @mouseenter="isActive = true"
            @mouseleave="isActive = null"
        />

        <div class="EmojiButton_popin" :class="{ 'is-active': isActive, 'is-disabled': isActive === false }" @mouseenter="isActive = true" @mouseleave="isActive = null" v-if="$biggerThan('s')">
            <div class="EmojiButton_popinContainer bg-bg-strong br-s shadow">
                <reaction-emoji-selector :is-active="isActive" @input="(v) => { $emit('input', v); isActive = false }" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {  
        text: { type: String }
    },
    data: () => ({
        isActive: false
    })
}
</script>

<style lang="scss" scoped>
.EmojiButton {
    display: inline-block;
    position: relative;
}

.EmojiButton_popin {
    pointer-events: none;
    opacity: 0;

    position: absolute;
    box-sizing: content-box;
    border: 20px solid transparent;
    z-index: 50;
    bottom: 20px;
    right: 0;
    transform: translateY(calc(100% + 5px));
    transition: all 100ms ease;
    
    &.is-active,
    &:hover:not(.is-disabled) {
        opacity: 1;
        pointer-events: all;
        transform: translateY(100%);
    }
}

.EmojiButton_popinContainer {
    width: 400px;
    overflow: hidden;
    height: 350px;
    display: flex;
}
</style>