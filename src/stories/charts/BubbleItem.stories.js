import BubbleItem from '@/components/Base/BubbleItem.vue';

export default {
    title: 'charts/BubbleItem',
    component: BubbleItem,
    decorators: [() => ({ template: '<svg style="width:90vw; height:90vh"><story/></svg>' })],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
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



    
       
        