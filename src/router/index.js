import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/lookPPT',
      name: 'lookPPT',
      component: ()=>import('@/views/lookPPT')
    },
    {
      path: '/beforeCourse',
      name: 'beforeCourse',
      component: ()=>import('@/views/beforeCourse')
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: ()=>import('@/components/canvas')
    },
    
  ]
})
