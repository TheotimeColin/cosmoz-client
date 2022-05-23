<template>
    <footer class="Footer">
        <div class="Wrapper">
            <div class="Footer_container d-flex d-block@s">
                <div class="fx-grow">
                    <nuxt-link :to="localePath({ name: '' })" class="ft-title-m logo-sparkle-p">cosmoz</nuxt-link>

                    <div class="mt-20 row-xs">
                        <div class="col-6 col-12@xs">
                            <link-base class="Footer_navItem" :href="$config.baseUrl">C'est quoi Cosmoz ?</link-base>

                            <link-base class="Footer_navItem" :href="$config.baseUrl + '/events'">Cosmoz Events</link-base>

                            <link-base class="Footer_navItem" :href="$config.blogUrl">Le super blog</link-base>
                        </div>
                        <div class="col-6 col-12@xs mt-15@xs">
                            <link-base class="Footer_navItem" :href="$config.baseUrl + '/faq'">Foire aux Questions</link-base>
                        </div>
                    </div>
                </div>

                <a href="https://www.instagram.com/gatheringsfr/" target="_blank" class="Insta" :style="{ backgroundImage: `url(${assets.socials})` }">
                    <span class="ft-title-xs tape ft-title-2xs@xs">Passe nous voir sur Insta @gatheringsfr</span>
                </a>
            </div>
        </div>
    </footer>
</template>

<script>
import socials from '@/assets/img/social/banner_1.gif'

export default {
    name: 'DefaultFooter',
    data: () => ({
        assets: { socials }
    })
}
</script>

<style lang="scss" scoped>
.Footer {
    color: var(--color-ft-light);
    background: var(--color-bg-xstrong);
}

.Footer_container {
    padding: 30px 0;
}

.Footer_navItem {
    display: block;

    & + & {
        margin-top: 15px;
    }
}

.Insta {
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    width: 500px;
    padding: 0 20px;

    &::before {
        content: "";
        display: block;
        @include ratio(33.33);
    }
}

@include breakpoint-s {

    .Insta {
        width: auto;
        margin-top: 30px;
    }
}
</style>
