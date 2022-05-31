<template>
    <div class="bg-bg-weak p-20 br-s p-sticky" style="--offset: 40px;">
        <link-base icon-before="house" :to="{ name: 'c-slug', params: { slug } }">Page d'accueil</link-base><br>
        <link-base icon-before="calendar" :to="{ name: 'c-slug-events', params: { slug } }">Rencontres prévues</link-base><br>

        <p class="ft-s color-ft-weak mt-20">Sorties</p>
        <link-base icon-before="party-horn">Rejoindre une sortie</link-base><br>
        <link-base icon-before="lightbulb">Idées de sortie</link-base><br>

        <p class="ft-s color-ft-weak mt-20">Discussions</p>
        <link-base :to="{ name: 'c-slug-feed', params: { slug} }" icon-before="hashtag">annonces</link-base><br>
        <link-base :to="{ name: 'c-slug-feed', params: { slug} }" icon-before="hashtag">général</link-base><br>
        <link-base :to="{ name: 'c-slug-feed', params: { slug} }" icon-before="hashtag">détente</link-base><br>
        <link-base :to="{ name: 'c-slug-feed', params: { slug} }" icon-before="hashtag">entraide</link-base><br>
    </div>
</template>

<script>
export default {
    name: 'PageConstNav',
    props: {
        slug: { type: String }
    }
}
</script>

<style>

</style>