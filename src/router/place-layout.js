/*
 * @Author: JTune
 * @Description: 数据概览路由
 * @FilePath: \centralized-control-sys-web\src\router\place-layout.js
 */

import Layout from '@/layout';

export default [
  {
    path: '/dataOverview',
    component: Layout,
    redirect: '/dataOverview',
    name: 'dataOverview',
    meta: {
      title: '数据概览',
      isGroupHeader: false,
      isHideTopNav: false
    },
    children: [
      {
        path: '/dataOverview',
        name: 'dataOverviewIndex',
        component: () => import('@/views/dataOverview'),
        meta: {
          title: '数据概览',
          isGroupHeader: false,
          isHideBreadcrumb: true,
          isHideTopNav: false,
          isOverview: true
        }
      },
      {
        path: '/runCondition',
        name: 'runCondition',
        component: () => import('@/views/overviewPage/runCondition'),
        meta: {
          title: '运行情况',
          isHideBreadcrumb: true,
          isHideTopNav: false,
          isGroupHeader: false
        }
      },
      {
        path: '/runningStatus',
        name: 'runningStatus',
        component: () => import('@/views/overviewPage/runningStatus'),
        meta: {
          title: '运行',
          isHideBreadcrumb: true,
          isHideTopNav: false,
          isGroupHeader: false
        }
      },
      {
        path: '/windGenerator/:deviceId/:deviceCode',
        name: 'windGenerator',
        component: () => import('@/views/overviewPage/windGenerator'),
        meta: {
          title: '运行情况',
          isHideTopNav: true,
          isHideBreadcrumb: true,
          isGroupHeader: false,
          isWindGeneratorHeader: true,
          isWind: true
        }
      },
      {
        path: '/failureWarning/:type/:faultType',
        name: 'failureWarning',
        component: () => import('@/views/overviewPage/failureWarning'),
        meta: {
          title: '故障报警',
          isHideTopNav: true,
          isGroupHeader: false,
          isOverview: true
        }
      },
      {
        path: '/generatingCapacityDetails',
        name: 'generatingCapacityDetails',
        component: () => import('@/views/overviewPage/generatingCapacityDetails'),
        meta: {
          title: '发电量',
          isGroupHeader: false,
          isHideTopNav: true,
          isOverview: true
        }
      },
      {
        path: '/windPowePredictionDetails',
        name: 'windPowePredictionDetails',
        component: () => import('@/views/overviewPage/windPowePredictionDetails'),
        meta: {
          title: '风功率预测',
          isGroupHeader: false,
          isHideTopNav: true,
          isOverview: true
        }
      },
      {
        path: '/electricityConsumptionDetails',
        name: 'electricityConsumptionDetails',
        component: () => import('@/views/overviewPage/electricityConsumptionDetails'),
        meta: {
          title: '风电场等效利用小时',
          isGroupHeader: false,
          isHideTopNav: true,
          isOverview: true
        }
      },
      {
        path: '/faultOverviewDetails',
        name: 'faultOverviewDetails',
        component: () => import('@/views/overviewPage/faultOverviewDetails'),
        meta: {
          title: '故障总览',
          isGroupHeader: false,
          isHideTopNav: true,
          isOverview: true
        }
      },
      {
        path: '/faultRankingDetails',
        name: 'faultRankingDetails',
        component: () => import('@/views/overviewPage/faultRankingDetails'),
        meta: {
          title: '设备故障',
          isGroupHeader: false,
          isHideTopNav: true,
          isOverview: true
        }
      }
    ]
  }
];
