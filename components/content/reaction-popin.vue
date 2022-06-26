<template>
    <popin :is-active="isActive" :modifiers="['s']" @close="$emit('close')">
        <template slot="content">
            <div class="p-20">
                <p class="ft-title-xs mb-20"><span class="mr-5 round-s bg-bg-strong" v-if="reactions">{{ reactions.reduce((t, c) => t += c[1].length, 0) }}</span> Réactions</p>

                <div v-if="reactions">
                    <div class="+mt-30" v-for="reaction in reactions" :key="reaction[0]"> 
                        <div class="fx-center mb-10">
                            <div class="ft-xl-medium">{{ reaction[0] }}</div>
                            <div class="round-xs bg-bg-strong ml-3">{{ reaction[1].length }}</div>

                            <hr class="Separator ml-10">
                        </div>


                        <div class="+mt-5" v-for="r in reaction[1]" :key="r.owner">
                            <user-icon v-bind="getOwner(r.owner)" :modifiers="['s']" :display-name="true" />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <fa icon="far fa-spinner-third" class="spin" />
                </div>
            </div>
        </template>
    </popin>
</template>

<script>
export default {
    props: {
        isActive: { type: Boolean, default: false },
        reactions: { type: Array, default: () => [] }
    },
    methods: {
        getOwner (_id) {
            return this.$store.getters['user/findOne']({ _id })
        }
    }
}
</script>