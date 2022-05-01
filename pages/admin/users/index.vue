<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="color-ft">
                    <div class="ft-m p-15 mv-10 bg-bg-light br-s" v-for="user in users" :key="user._id">
                        <div class="d-flex fx-justify-between">
                            <div>
                                <b>{{ user.name }}</b> {{ user.email }}
                            </div>
                            <div class="ml-20">
                                <span class="mr-10">
                                    {{ user.ref ? user.ref : 'Unknown' }}
                                </span>
                                <span class="color-ft-weak">{{ $moment(user.createdAt).format('DD MMM hh:mm') }}</span></p>
                            </div>
                        </div>
                        <div class="mt-5">
                            <span class="tape tape-strong mr-5" v-for="cat in user.categories" :key="cat">
                                {{ cat }}    
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsletterPage',
    layout: 'admin',
    async fetch () {
        let response = await this.$store.dispatch('user/fetch')
        this.data = response.data
    },
    data: () => ({
        data: []
    }),
    computed: {
        users () {
            return this.data.filter(u => u.role !== 'guest').sort((a, b) => this.$moment(b.createdAt).format('YYYYMMDD') - this.$moment(a.createdAt).format('YYYYMMDD'))
        }
    }
}
</script>