// mouse.js
import { ref } from 'vue';

// by convention, composable function names start with "use"
const tooltipPosition = ref({ show: false, x: 0, y: 0 });

export function useTooltip() {
  const show = (x,y) => {
    tooltipPosition.value.show = true
    tooltipPosition.value.x = x+4;
   tooltipPosition.value.y = y+4;
  };
  const hide = () => {
    tooltipPosition.value.show = false;
    
  }
 
  return { show, hide,tooltipPosition};
}