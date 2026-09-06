import {defineConfig} from 'vite';

export default defineConfig({
  build:{
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('node_modules/three/examples/')||id.includes('node_modules/three/addons/'))return 'three-addons';
          if(id.includes('node_modules/three'))return 'three-core';
          if(id.includes('/src/quiz-data.js'))return 'quiz-data';
          if(id.includes('/src/lesson-data.js'))return 'lesson-data';
        }
      }
    }
  }
});
