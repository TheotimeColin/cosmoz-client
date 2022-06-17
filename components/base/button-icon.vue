<template>
    <component :is="href ? 'a' : 'div'" :href="href" class="ButtonIcon" :class="{ 'is-notif': notification }"  v-on="$listeners">
        <fa class="ButtonIcon_reg" :icon="`far fa-${fa}`" fixed-width v-if="fa" />
        <fa class="ButtonIcon_solid" :icon="`fa-solid fa-${fa}`" fixed-width v-if="fa" />
    </component>
</template>

<script>
export default {
    name: 'ButtonIcon',
    props: {
        fa: { type: String },
        href: { type: String },
        notification: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>



.ButtonIcon {
    font-size: 18px;
    cursor: pointer;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-notif {

        &::before {
            content: "";
            width: 6px;
            height: 6px;
            background-color: var(--color-cosmoz);
            position: absolute;
            z-index: 5;
            right: 50%;
            bottom: 6px;
            margin: 0 -3px 0 0;
            border-radius: 50%;
        }
    }
    
    &:hover {

        .ButtonIcon_solid {
            display: block;
        }

        .ButtonIcon_reg {
            display: none;
        }
    }
}

.ButtonIcon_solid {
    display: none;
}
</style>