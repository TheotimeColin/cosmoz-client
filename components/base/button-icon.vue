<template>
    <component :is="href ? 'a' : 'div'" :href="href" class="ButtonIcon" v-on="$listeners">
        <div class="ButtonIcon_notif" v-if="notification">{{ notification > 99 ? '+' : notification }}</div>

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
        notification: { type: Number, default: 0 }
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
    
    &:hover {

        .ButtonIcon_solid {
            display: block;
        }

        .ButtonIcon_reg {
            display: none;
        }
    }
}

.ButtonIcon_notif {
    font: var(--ft-3xs-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-bg-strong);
    box-sizing: content-box;
    background-color: var(--color-cosmoz);
    position: absolute;
    z-index: 5;
    right: 50%;
    top: 12px;
    margin: 0 -18px 0 0;
    border-radius: 50%;
}

.ButtonIcon_solid {
    display: none;
}
</style>