<template>
    <component :is="link ? 'nuxt-link' : 'div'" :to="localePath(link)" class="NotifItem" :class="{ 'is-read': state == 'read', 'is-gathering': gatherings[0] }" @click="$store.dispatch('notification/read', _id)" @click.native="$store.dispatch('notification/read', _id)">
        <div class="NotifItem_image" :style="{ backgroundImage: `url(${cover})` }">
            <div class="NotifItem_imageSecondary" :style="{ backgroundImage: `url(${constellationCover})` }" v-if="constellationCover"></div>
        </div>
        <div>
            <div class="ellipsis-2" v-html="text"></div>
            <div class="ft-xs color-ft-xweak">{{ $moment(createdAt).fromNow() }}</div>
        </div>
    </component>
</template>

<script>
export default {
    name: 'Notifications',
    props: {
        _id: { type: String },
        state: { type: String },
        type: { type: String },
        user: { type: String },
        status: { type: String },
        gathering: { type: String },
        constellation: { type: String },
        createdAt: { type: String },
        content: { type: String },
        origins: { type: Array, default: () => [] },
    },
    computed: {
        self () { return this.$store.getters['user/self'] },
        cover () {
            if (this.userData?.profileLarge) return this.userData.profileLarge
            if (this.users[0]?.profileLarge) return this.users[0].profileLarge
            if (this.gatherings[0]?.hero) return this.gatherings[0].hero
            if (this.constellationData?.logoSmall) return this.constellationData.logoSmall

            return this.$bg.plasticBlack
        },
        constellationCover () {
            if (this.type == 'conste-enter') return this.self.profileSmall
            if (this.constellationData?.logoSmall && this.cover !== this.constellationData?.logoSmall) return this.constellationData.logoSmall

            return null
        },
        userData () {
            if (!this.user) return null

            return this.$store.getters['user/findOne']({
                _id: this.user
            })
        },
        statusData () {
            if (!this.status) return null

            return this.$store.getters['status/findOne']({
                _id: this.status
            })
        },
        gatheringData () {
            if (!this.gathering) return null

            return this.$store.getters['gathering/findOne']({
                _id: this.gathering
            })
        },
        constellationData() {
            if (!this.constellation && !this.gatheringData) return null

            return this.$store.getters['constellation/findOne']({
                _id: this.constellation ? this.constellation : this.gatheringData.constellation
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                _id: { $in: this.origins.filter(o => o.type == 'gathering').map(o => o._id) }
            })
        },
        users () {
            return this.$store.getters['user/find']({
                _id: { $in: this.origins.filter(o => o.type == 'user').map(o => o._id) }
            })
        },
        link () {
            if (this.statusData && this.constellationData) {
                return {
                    name: 'c-slug-post-postId',
                    params: { slug: this.constellationData.slug, postId: this.statusData._id }
                }
            } else if (this.statusData) {
                return {
                    name: 'post-postId',
                    params: { postId: this.statusData._id }
                }
            } else if (this.constellationData && (this.gatherings.length > 1 || this.type == 'gathering-cancelled')) {
                return {
                    name: 'c-slug-events',
                    params: { slug: this.constellationData.slug }
                }
            } else if (this.constellationData && this.gatheringData) {
                return {
                    name: 'c-slug-events-eventId',
                    params: { slug: this.constellationData.slug, eventId: this.gatheringData.id }
                }
            } else if (this.constellationData && this.type == 'conste-application') {
                return {
                    name: 'c-slug-admin',
                    params: { slug: this.constellationData.slug }
                }
            } else if (this.constellationData && this.type == 'conste-enter') {
                return {
                    name: 'c-slug-feed',
                    params: { slug: this.constellationData.slug }
                }
            } else if (this.userData) {
                return { name: 'p-userId', params: { userId: this.userData.id } }
            }

            return null
        },
        text () {
            let count = this.users.length

            if (this.type.includes('gathering')) count = this.gatherings.length
            if (this.type.includes('event')) count = this.gatherings.lengthh
            if (this.type.includes('post')) count = this.users.length
            
            return this.$tc(`notifications.${this.type}.content`, count, {
                user: this.userData?.name,
                users: this.$pluralize(this.users.map(u => u.name)),
                status: this.statusData?.content,
                gathering: this.gatheringData?.title,
                constellation: this.constellationData?.name,
                content: this.content
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .NotifItem {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 100ms ease;
        font: var(--ft-m);
        line-height: 1.3;

        &.is-read {
            color: var(--color-ft-xweak);
            
            .NotifItem_image {
                opacity: 0.5;
            }
        }

        &:hover {
            color: var(--color-ft-light);
            background-color: var(--color-bg-weak);

            .NotifItem_image {
                opacity: 1;
            }

            .NotifItem_imageSecondary {
                border-color: var(--color-bg-weak);
            }
        }

        &.is-gathering {
            
            .NotifItem_image {
                border-radius: 5px;
            }
        }
    }

    .NotifItem_image {
        width: 55px;
        height: 55px;
        flex-shrink: 0;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        margin-right: 15px;
        transition: all 100ms ease;
        opacity: 1;
        position: relative;
    }

    .NotifItem_imageSecondary {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-size: cover;
        position: absolute;
        bottom: -8px;
        right: -8px;
        border: 2px solid var(--color-bg);
    }
</style>