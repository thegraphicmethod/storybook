import BubbleItem from '@/components/Base/BubbleItem.vue';
import BubbleItem2 from '@/components/Base/BubbleItem.vue?raw';
export default {
    title: 'charts/BubbleItem',
    parameters: {
        componentSource: {
          code: BubbleItem2,
          language: 'vue',
        }
      },
    component: BubbleItem,
    decorators: [() => ({ template: '<svg style="width:90vw; height:90vh"><story/></svg>' })],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        color:{
            control: '#990000',
        }
    },
};

export const Primary = {
    args: {
        color: '#990000',
    },
};



    
       
        