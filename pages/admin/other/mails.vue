<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div v-for="mail in mails" :key="mail._id">
                    {{ mail.type }}

                    <span v-if="mail.user">{{ mail.user.name }}</span>

                    <span v-if="mail.gathering">{{ mail.gathering.title }}</span>

                    <span v-if="mail.date">{{ $moment(mail.date).format('DD MMMM à H:mm') }}</span>

                    {{ mail.status }}
                </div>
            </div>

            <div class="Page_side">
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EmailsPage',
    layout: 'admin',
    async fetch () {
        let response = await this.$store.dispatch('mails/fetch')
    },
    data: () => ({
        data: []
    }),
    computed: {
        mails () {
            return this.$store.getters['mails/find']({})
        }
    }
}
</script>