<template>
    <div class="BlockConstellation">
        <div class="BlockConstellation_cover" :style="{ backgroundImage: `url(${cover}` }"></div>
        <div class="BlockConstellation_logo" :style="{ backgroundImage: `url(${logo}` }"></div>
        <div class="BlockConstellation_content">
            <p class="BlockConstellation_title">{{ title }}</p>

            <p class="mt-10">{{ members }} membres</p>
            <p>{{ events }} sorties créées</p>
        </div>

    </div>
</template>

<script>
export default {
    name: 'BlockConstellation',
    props: {
        title: { type: String },
        cover: { type: String },
        logo: { type: String },
        members: { type: Number },
        events: { type: Number }
    }
}
</script>

<style lang="scss" scoped>
.BlockConstellation {
    background: var(--color-bg-weak);
    text-align: center;
}

.BlockConstellation_content {
    padding: 20px;
    font: var(--ft-s);
}

.BlockConstellation_logo {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    margin: -25px auto 0;
}

.BlockConstellation_title {
    font: var(--ft-title-2xs);
}

.BlockConstellation_cover {
    background-size: cover;
    background-position: center;

    &::before {
        content: "";
        display: block;
        background: rgba(0, 0, 0, 0.65);
        @include ratio(33);
    }
}
</style>