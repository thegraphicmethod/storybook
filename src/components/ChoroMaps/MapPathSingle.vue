<template>
  <path
    :d="d"
    style="transition: color 0.5s ease-in-out;"
    :style="{ 
      fill: isHovered?hoveredColor:color,
      'stroke-width': showStrokeHovered&&isHovered?2:0,
      stroke: showStrokeHovered&&isHovered?strokeHoveredColor:'none'
    }"
    @mouseover="emitThis($event, '_mouseover')"
    @mouseout="emitThis($event, '_mouseout')"
    @click="emitThis($event, '_click')"
  >
  </path>
</template>

<script>
export default {
  emits: ['_mouseover', '_mouseout','_click'],
  props: {
    /** 
     * The path of the map
    */
    d: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    hoveredColor: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    showHoverState: {
      type: Boolean,
      default: true
    },
    showStrokeHovered: {
      type: Boolean,
      default: false
    },
    strokeHoveredColor: {
      type: String,
      default: 'black'
    },

  },
  data() {
    return {
      hovered: false
    }
  },
  computed: {
    isHovered() {
      return this.hovered && this.showHoverState 
    },

  },

  updated() {},
  methods: {
    emitThis(event, type) {
      this.$emit(type, event, this.id)
      if(type === '_mouseover') {
        this.hovered = true
      } else if(type === '_mouseout') {
        this.hovered = false
      }
    },

  }
}
</script>

<style>

</style>