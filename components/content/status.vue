<template>
    <div class="Status">
        <div class="Status_content">
            <div class="+mt-20">
                <p class="ft-xs color-ft-weak mb-10">{{ $moment(createdAt).fromNow() }}</p>

                <p class="ft-title-xs" v-if="title">
                    {{ title }}
                </p>
                <p class="ft-m-medium mt-5" v-if="subtitle">{{ subtitle }} </p>
            </div>
            
            <content-reactions
                class="+mt-20"
                :add="true"
                :size="'m'"
                :id="_id"
                :reactions="reactions"
                :default-reactions="[
                    { type: '❤️', default: true },
                    { type: '👏', default: true },
                    { type: '🍻', default: true }
                ]"
                v-if="enableReactions"
            />

            <div class="+mt-20" v-if="actions.length > 0">
                <button-base
                    v-for="(action, i) in actions"
                    type="button"
                    class="m-3"
                    v-bind="action"
                    v-on="action.on"
                    :key="i"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        _id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        createdAt: { type: [Date, Object] },
        enableReactions: { type: Boolean, default: false },
        actions: { type: Array, default: () => [] }
    },
    computed: {
        reactions () {
            return this.$store.getters['reaction/find']({
                id: this._id
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Status {
        text-align: center;
    }

    .Status_content {
        padding: 20px;
        border-radius: 10px;
        background-color: var(--color-bg-strong);
    }

    @include breakpoint-xs {
        .Status {
            margin: 0 -20px;
            
            .Status_content {
                border-radius: 0;
            }
        }
    }
</style>