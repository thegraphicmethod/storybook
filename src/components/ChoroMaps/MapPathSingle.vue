<template>
  <path
    class="transition-all duration-500 ease-in-out"
    :d="d"
    :style="{ fill: color }"
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
    id: {
      type: String,
      required: true
    }
  },

  updated() {},
  methods: {
    emitThis(event, type) {
      this.$emit(type, event, this.id)
    },

  }
}
</script>

<style>

</style>