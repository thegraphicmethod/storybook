<template>
    <div>
        <GenericMap
        :width="width"
        :height="height"
        :geoMap="worldmapGeo"
        :data="worldData"
        :metricObject="metricObject"
        @_mouseover="onMouseOver"
        @_mouseout="onMouseOut"
        ></GenericMap>
        <TooltipGlobal>
            <template #header>                
                <h1 class="text-2xl font-bold">Global</h1>                
            </template>
            <template #content>                
                    <p class="text-xl font-bold">Total</p>                
            </template>
        </TooltipGlobal>
    </div>
</template>

<script setup>
import GenericMap from './GenericMap.vue'
import TooltipGlobal from '../interface/TooltipGlobal.vue'
import * as worldmapGeo from '../../assets/world-110m.json'
import { useTooltip } from "@/composables/useTooltip";
const tooltip = useTooltip();

import { useWindowSize } from '@vueuse/core';

console.log(worldmapGeo)

const { width, height } = useWindowSize();
      
const metricObject = {
    name: '_id',
    value: 'Total'
}

const worldData =  [
        {_id: "AFG", Total: 32358260},
        {_id: "AGO", Total: 15941390},
        {_id: "ALB", Total: 2947314},
        {_id: "AND", Total: 72766},
        {_id: "ARE", Total: 9214175},
        {_id: "ARG", Total: 43416755},
        {_id: "ARM", Total: 3017712},
        {_id: "ATG", Total: 96453},
        {_id: "AUS", Total: 23781169},
        {_id: "AUT", Total: 8479823},
        {_id: "AZE", Total: 9753968},
        {_id: "BDI", Total: 10524117},
        {_id: "BEL", Total: 11348159},
        {_id: "BEN", Total: 10872298},
    ]  

const onMouseOver = ({payload, x,y}) => {
    console.log(x)
    console.log(y)
    tooltip.show(x,y)
}
const onMouseOut = () => {
    tooltip.hide()
}

</script>

<style lang="scss" scoped>

</style>