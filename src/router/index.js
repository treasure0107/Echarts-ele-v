/*
 * @Author: JTune
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\router\index.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import GroupLayoutRouter from './group-layout';
import PlaceLayoutRouter from './place-layout';
import ConnectionDiagramRouter from './connection-diagram';
import {
  localstorageGet
} from '@/utils/utils';
Vue.use(Router);

const router = new Router({
  // hash history
  mode: 'hash',
  routes: [
    ...GroupLayoutRouter,
    ...PlaceLayoutRouter,
    ...ConnectionDiagramRouter,
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login'),
      meta: {
        title: '登录',
        isHeaderHide: true,
        isMenuHide: true
      }
    },
    {
      path: '*',
      name: 'Error404',
      component: r => require(['@/views/error404.vue'], r),
      meta: {
        isHeaderHide: true,
        isFooterHide: true,
        isMenuHide: true
      }
    }

  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  var sid = localstorageGet('sid');
  // 如果没登录,都导向登录页
  if (!sid) {
    if (to.path !== '/login') {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    if (to.path == '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  }
});

export default router;
