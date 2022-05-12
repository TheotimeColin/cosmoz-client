<template>
    <div>
        <div class="QR" @click="zoom = true">
            <img :src="src" v-if="src">
            <canvas class="QR_canvas" ref="canvas" v-else></canvas>
        </div>

        <popin-base :is-active="zoom" :modifiers="['s']" @close="zoom = false">
            <template slot="content">
                <div class="QR p-relative">
                    <img :src="src" v-if="src">
                    <canvas class="QR_canvas" ref="zoomed" v-else></canvas>
                </div>
            </template>
        </popin-base>
    </div>
</template>

<script>

import QRCode from 'qrcode'

export default {
    name: 'QRCode',
    props: {
        src: { type: String },
        data: { type: String }
    },
    data: () => ({
        zoom: false
    }),
    mounted () {
        if (process.server) return

        if (this.$refs.canvas) QRCode.toCanvas(this.$refs.canvas, this.data)

        if (this.$refs.zoomed) QRCode.toCanvas(this.$refs.zoomed, this.data, {
            scale: 50
        })
    }
}
</script>

<style lang="scss" scoped>
    .QR {
        position: relative;
        flex-grow: 1;

        &::before {
            content: "";
            display: block;
            @include ratio(100);
        }

        canvas,
        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
        }
    }
</style>