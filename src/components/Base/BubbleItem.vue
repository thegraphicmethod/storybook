<template>
    <g
      :ref="`bubble_${bubbleData.id}`"
      @mouseover="mouseover($event, bubbleData)"
      @mouseout="$emit('mouseoutEvent')"
    >
      <circle
        :cx="bubbleData.x"
        :cy="bubbleData.y"
        :r="bubbleData.r"
        :fill="color"
        class="bubble-circle"
      ></circle>
      <text v-if="bubbleData.height !==0"
        ref="texto"
        text-anchor="middle"
        style="font-size: 14px"
        :style="{
          opacity: opacity
        }"
        class="pointer-events-none"
      >
        <tspan
          v-for="(word, j) in bubbleData.label.split(/[ ,]+/)"
          :key="j"
          text-anchor="middle"
          :x="bubbleData.x"
          :y="bubbleData.y - (bubbleData.label.split(/[ ,]+/).length - 1) * 5"
          :dy="j * 1 + 'em'"
          fill="rgb(12, 31, 50)"
        >
          {{ word }}
        </tspan>
      </text>
    </g>
  </template>
  
  <script>
  export default {
    name: 'BubbleItem',
    props: {
      bubbleData: {
        type: Object,
        default: () => {
          return { x: 100, y: 100, r: 100, label: 'demo text', id: 0 }
        }
      },
      color: {
        type: String,
        default: '#fff'
      }
    },
    data() {
      return {  
        opacity: 1,      }
    },
    watch: {
      bubbleData() {        
        this.opacity = this.showOrHideTextDependingOnTextSize(
          this.bubbleData.id,
          this.bubbleData.r,
          this.bubbleData.label
        )
      }
    },
    mounted() {
     
    },
    methods: {
      mouseover(e, bubbledata) {
        this.$emit('hoverEvent', { top: e.y, left: e.x, bubbledata } )
      },
      showOrHideTextDependingOnTextSize(reference, radius) {
        // getComputedTextLength
        if (this.$refs.texto === undefined) {
          return 0
        }
        const length = this.$refs.texto.getBBox().width
        // console.log(length + ' ' + occ + ' ' + reference)
        return length < radius * 1.9 ? 1 : 0 // this number cannot be 2 because it should allow some padding
      }
    }
  }
  </script>
  
  <style scoped>
  circle {
    transition: fill 0.8s ease-in-out;
  }
  circle:hover {
    stroke-width: 2px;
    stroke: #fff;
  }
  text {
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }
  </style>