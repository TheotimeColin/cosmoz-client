<template>
    <div class="bg-bg-weak p-20 br-s p-sticky" style="--offset: 40px;">
        <link-base :to="{ name: 'o-slug', params: { slug } }">Page d'accueil</link-base><br>

        <p class="mt-20">Sorties</p>
        <link-base>Rejoindre une sortie</link-base><br>
        <link-base>Propositions de sortie</link-base><br>

        <p class="mt-20">Discussion</p>
        <link-base :to="{ name: 'o-slug-feed', params: { slug} }"><fa icon="far fa-hashtag" class="mr-3" /> annonces</link-base><br>
        <link-base :to="{ name: 'o-slug-feed', params: { slug} }"><fa icon="far fa-hashtag" class="mr-3" /> général</link-base><br>
        <link-base :to="{ name: 'o-slug-feed', params: { slug} }"><fa icon="far fa-hashtag" class="mr-3" /> funny-cute</link-base><br>
        <link-base :to="{ name: 'o-slug-feed', params: { slug} }"><fa icon="far fa-hashtag" class="mr-3" /> bons-plans</link-base><br>
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