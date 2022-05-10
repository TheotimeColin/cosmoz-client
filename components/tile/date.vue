<template>
    <div class="TileDate">
        <div>
            <div>
                <p class="ft-bold text-upper">{{ day }}</p>
                <p>{{ $moment(date).format('DD MMM')}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TileDate',
    props: {
        date: { type: [Date, String] }
    },
    computed: {
        day () {
            let day = this.$moment(this.date)

            if (this.$moment().format('YYYYMMD') == day.format('YYYYMMD')) {
                return `Aujourd'hui`
            } else if (this.$moment().add(1, 'day').format('YYYYMMD') == day.format('YYYYMMD')) {
                return `Demain`
            } else {
                return day.format('dddd')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.TileDate {
    position: relative;
    border: 2px solid var(--color-bg-light);
    color: var(--color-ft-light);
    border-radius: 3px;
    text-align: center;
    font: var(--ft-s);
    line-height: 1.2;

    &::before {
        content: "";
        display: block;
        @include ratio(100);
    }

    & > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
    }
}
</style>