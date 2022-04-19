<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s">

                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'pages-id', params: { id: 'new' } })
                    }"
                >
                    Créer un nouveau lieu
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LocationsPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {

    },
    computed: {

    }
}
</script>