/*
 * @Author: JTune
 * @Description: 接线图路由
 * @FilePath: \centralized-control-sys-web\src\router\connection-diagram.js
 */

import Layout from '@/layout';

export default [
  {
    path: '/connectionDiagram',
    component: Layout,
    redirect: '/connectionDiagram',
    name: 'connectionDiagram',
    meta: {
      title: '接线图',
      isGroupHeader: false
    },
    children: [
      {
        path: '/connectionDiagram',
        name: 'connectionDiagramIndex',
        component: () => import('@/views/connectionDiagram'),
        meta: {
          title: '接线图',
          isGroupHeader: false,
          isHideBreadcrumb: true,
          isDiagram: true
        }

      }
    ]
  }
];
