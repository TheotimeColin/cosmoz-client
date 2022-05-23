<template>
    <div>
        <div class="Wrapper p-relative pb-100">
            <div class="row-s fx-nowrap">
                <div class="col-grow">
                    Hello
                </div>
                <div class="col-no-shrink width-xs">
                    <div class="p-15">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardPage',
    layout: 'admin',
    middleware: 'admin',
    computed: {
        user () { return this.$store.getters['user/self'] }
    }
}
</script>