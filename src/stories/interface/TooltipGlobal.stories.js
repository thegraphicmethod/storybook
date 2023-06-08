import TooltipGlobal from '@/components/interface/TooltipGlobal.vue'
import TooltipGlobalRaw from '@/components/interface/TooltipGlobal.vue?raw'
// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
export default {
  title: 'Interface/TooltipGlobal',
  component: TooltipGlobal,
  tags: ['autodocs'],
  argTypes: {
   
  },
  parameters: {
    componentSource: {
      code: TooltipGlobalRaw,
      language: 'vue',
    },
    
  },
};

// More on writing stories with args: https://storybook.js.org/docs/vue/writing-stories/args
export const Default = {
    render: (args) => ({
      components: { TooltipGlobal },
      setup() {
        return { args };
      },
      template: `<TooltipGlobal v-bind="args">
          <template #head>
          head template
          </template> 
          <template #content>
          body template
          </template>
        </TooltipGlobal>
      `,
    }),
  };