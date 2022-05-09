<template>
    <div class="Accordion" :class="{ 'is-active': isActive }">
        <div class="Accordion_title" @click="isActive = !isActive">
            <span>{{ title }}</span>

            <i class="Accordion_icon fal fa-angle-right"></i>
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
    border: 1px solid var(--color-border);
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
    font: var(--ft-m-bold);
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-style: italic;
    padding: 15px;
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
    padding: 0px 15px 15px 15px;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-5px);
}
</style>