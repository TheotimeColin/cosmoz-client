<template>
    <div class="Accordion" :class="{ 'is-active': isActive }">
        <div class="Accordion_title" @click="isActive = !isActive">
            <span>{{ title|specials }}</span>

            <fa class="Accordion_icon" icon="far fa-angle-right" />
        </div>

        <div class="Accordion_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Accordion',
    props: {
        title: { type: String }
    },
    data: () => ({
        isActive: false
    })
}
</script>

<style lang="scss" scoped>
.Accordion {
    background-color: var(--color-bg);
    overflow: hidden;
    border-radius: 3px;

    &.is-active {

        .Accordion_title,
        .Accordion_icon {
            color: var(--color-ft-weak);
        }
        
        .Accordion_content {
            position: relative;
            opacity: 1;
            transform: translateY(0px);
            pointer-events: all;
            transition: all 150ms ease;
        }

        .Accordion_icon {
            transform: rotate(90deg);
        }
    }

    &:hover {

        .Accordion_icon {
            transform: rotate(90deg);
        }
    }
}

.Accordion_title {
    font: var(--ft-title-2xs);
    padding: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;

    span {
        flex-grow: 1;
    }
}

.Accordion_icon {
    transition: all 150ms ease;
    margin: 0 10px 0 20px;
}

.Accordion_content {
    padding: 0px 20px 20px 20px;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-5px);
}
</style>