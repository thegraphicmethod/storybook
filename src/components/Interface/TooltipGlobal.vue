<template>
  <div
    class="absolute z-50 w-fit shadow-xl rounded-md pointer-events-none"
    :style="{
      top: getPositionTop(),
      left: positionLeft,
    }"
  >
    <div
      v-show="show"
      ref="innertooltip"
      class="inner-tooltip w-48"
      :style="{ 'max-width': getMaxWidth() }"
    >
      <div
        v-if="hasHeader"
        class="header bg-slate-300 p-1 text-xs font-semibold border-b border-b-greenScl-400 rounded-t-md"
      >
        <div id="teleport-header"><slot name="header"></slot> </div>
      </div>
      <div
        v-if="hasContent"
        class="p-2 text-xs bg-white rounded-b-md"
        id="teleport-content"
      >
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  computed, ref, watch, nextTick } from "vue";
import { useTooltip } from "@/composables/useTooltip";
const tooltip = useTooltip();
const tooltipPosition= tooltip.tooltipPosition

const props = defineProps({
  hasHeader: {
    type: Boolean,
    default: true,
  },
  hasContent: {
    type: Boolean,
    default: true,
  },

  size: {
    type: String,
    default: "medium",
  },
});

const top = computed(() => {
 return tooltipPosition.value.y;
});
const left = computed(() => {
  return tooltipPosition.value.x;
});

const show = computed(() => {
  return tooltipPosition.value.show;
});


const positionLeft = ref(0);

const setPositionLeft = () => {
  if (innertooltip.value === undefined) return left.value;
  const ww = window.innerWidth;
  const tooltipRealSize = innertooltip.value.offsetWidth;
  if (left.value - tooltipRealSize < 0) return "10px"; // left overflow
  if (left.value + tooltipRealSize > ww) {
    return left.value - tooltipRealSize + "px";
  } else return left.value - tooltipRealSize + "px";
};

const getPositionTop = () => {
  return top.value + 12 + "px";
};

const getMaxWidth = () => {
  if (props.size === "small") return "200px";
  if (props.size === "medium") return "300px";
  if (props.size === "large") return "500px";
};

watch(show, (newValue, oldValue) => {
  nextTick(() => {
    
    positionLeft.value = setPositionLeft();
  });
});

const innertooltip = ref(null);

</script>

<style lang="css" scoped>
/* vue trantsition opacity */

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter, .v-leave-to /* .v-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
