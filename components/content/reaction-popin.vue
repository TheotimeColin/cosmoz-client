<template>
    <popin-base :is-active="isActive" :modifiers="['xs']" @close="$emit('close')">
        <template slot="content">
            <div class="p-30">
                <p class="ft-title-xs mb-20">Réactions <span class="ml-5 round-s bg-bg" v-if="reactions">{{ reactions.length }}</span></p>

                <div v-if="reactions">
                    <div class="mt-10" v-for="reaction in reactions" :key="reaction._id"> 
                        <user-icon v-bind="reaction.owner" :display-name="true" />
                    </div>
                </div>
                <div v-else>
                    <fa icon="far fa-spinner-third" class="spin" />
                </div>
            </div>
        </template>
    </popin-base>
</template>

<script>
export default {
    props: {
        isActive: { type: Boolean, default: false },
        reactions: { type: Array, default: () => [] }
    }
}
</script>