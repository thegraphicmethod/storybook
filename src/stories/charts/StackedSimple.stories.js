import StackedSimple from '@/components/Basics/StackedSimple.vue';
import StackedSimple2 from '@/components/Basics/StackedSimple.vue?raw';
export default {
    title: 'charts/StackedSimpleHorizontal',
    parameters: {
        componentSource: {
          code: StackedSimple2,
          language: 'vue',
          
        }
      },
    component: StackedSimple,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        argTypes: { _mouseover: { action: 'clicked' } },
    },
};

export const Base = {
    args: {
        showFigures: false,
    },
};


export const withFigures = {
    args: {
        showFigures: true,
        fullWidth: 800,
        series: [
            {
              id: '2010',
              children: [
                {
                  id: '1',
                  value: 0.1
                },
                {
                  id: '2',
                  value: 0.2
                },
                {
                    id: '3',
                    value: 0.3
                },
              ],
              value: 0.6
            },
            {
              id: '2011',
              children: [
                {
                  id: '1',
                  value: 0.4
                },
                {
                  id: '2',
                  value: 0.5
                },
                {
                    id: '3',
                    value: 0.3
                },

              ],
              value: 1.2
            }
          ]
    },
};


    
       
        