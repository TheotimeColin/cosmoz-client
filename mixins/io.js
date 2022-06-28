import io from 'socket.io-client'

export default {
    data: () => ({
        $socket: null
    }),
    beforeMount () {
        if (!this.user) return

        this.$socket = io(process.env.NUXT_ENV_API_URL, {
            extraHeaders: {
                'Authorization': this.$auth.strategy.token.get()
            }
        })
        
        if (this.$socket) {
            this.$socket.on('new-message', (message) => {
                this.$store.commit('messages/updateOne', message)
            })

            this.$socket.on('new-channel', (channel) => {
                this.$store.commit('channel/updateOne', channel)
            })

            this.$socket.on('channel-writing', (value) => {
                this.$store.commit('channel/setWriting', {
                    action: true, value
                })
            })

            this.$socket.on('channel-writing-stop', (value) => {
                this.$store.commit('channel/setWriting', {
                    action: false, value
                })
            })
        }
    },
    watch: {
        ['$store.state.channel.current'] (v) {
            this.$socket.emit('join-room', { id: v, type: 'channel', unique: true })
        },
        ['$store.state.channel.currentWriting'] (v) {
            if (v) {
                this.$socket.emit('channel-writing', {
                    channel: this.$store.state.channel.current,
                    user: this.user._id
                })
            } else {
                this.$socket.emit('channel-writing-stop', {
                    channel: this.$store.state.channel.current,
                    user: this.user._id
                })
            }
        }
    }
}