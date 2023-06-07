/** @type { import('@storybook/vue3').Preview } */
import '../src/assets/maintailwind.css';
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    
    
  },
  
};

export default preview;
