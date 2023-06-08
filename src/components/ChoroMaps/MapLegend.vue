
<template>
    <div class="legend flex justify-start flex-row">
        <div v-for="(item, index) in items" :key="index" class="legend-item ">
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <div class="legend-label">{{ item.thresholds }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MapLegend',
    props: {
        items: {
            type: Array,
            default: () => [
                { thresholds: '0 - 10', color: '#f7fcf5' },
                { thresholds: '10 - 20', color: '#e5f5e0' },
                { thresholds: '20 - 30', color: '#c7e9c0' },
                { thresholds: '30 - 40', color: '#a1d99b' },
                { thresholds: '40 - 50', color: '#74c476' },
                { thresholds: '50 - 60', color: '#41ab5d' },
                { thresholds: '60 - 70', color: '#238b45' },
                { thresholds: '70 - 80', color: '#006d2c' },
                { thresholds: '80 - 90', color: '#00441b' },
        ],
    },
    }
}
</script>

<style lang="css" scoped>
.legend {
    display: flex;
    flex-direction: column;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.legend-color {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.legend-label {
    font-size: 14px;
}
</style>

