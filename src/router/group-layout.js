/*
 * @Descripttion:
 * @version:
 * @Author: JTune
 * @Date: 2020-10-23 18:08:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-05 11:41:21
 */
/*
 * @Descripttion:集团数据路由
 */
import Layout from '@/layout';

export default [
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    name: 'home',
    meta: {
      title: '集团首页'
    },
    children: [
      {
        path: '/home',
        name: 'homeIndex',
        component: () => import('@/views/home'),
        meta: {
          title: '集团首页',
          isGroupHeader: true,
          isHideTopNav: true,
          isHideBreadcrumb: true
        }
      },
      {
        path: 'generatingCapacity',
        name: 'generatingCapacity',
        component: () => import('@/views/groupOverview/generatingCapacity/index.vue'),
        meta: {
          title: '发电量分析',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'generatingCapacityTop',
        name: 'generatingCapacityTop',
        component: () => import('@/views/groupOverview/generatingCapacityTop/index.vue'),
        meta: {
          title: '发电完成率',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'electricityConsumptionTop',
        name: 'electricityConsumptionTop',
        component: () => import('@/views/groupOverview/electricityConsumptionTop/index.vue'),
        meta: {
          title: '风电场利用小时数',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'windSpeed',
        name: 'windSpeed',
        component: () => import('@/views/groupOverview/windSpeed/index.vue'),
        meta: {
          title: '风电场平均风速',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'operation',
        name: 'operation',
        component: () => import('@/views/groupOverview/operation/index.vue'),
        meta: {
          title: '运行统计',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'malfunctionPreview',
        name: 'malfunctionPreview',
        component: () => import('@/views/groupOverview/malfunctionPreview/index.vue'),
        meta: {
          title: '故障总览',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'failureEquipment',
        name: 'failureEquipment',
        component: () => import('@/views/groupOverview/failureEquipment/index.vue'),
        meta: {
          title: '设备故障',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'windPowerStation',
        name: 'windPowerStation',
        component: () => import('@/views/groupOverview/windPowerStationFailureTop/index.vue'),
        meta: {
          title: '风电场故障',
          isHideTopNav: true,
          isGroupHeader: true
        }
      },
      {
        path: 'windPowePrediction',
        name: 'windPowePrediction',
        component: () => import('@/views/groupOverview/windPowePrediction/index.vue'),
        meta: {
          title: '风功率预测',
          isHideTopNav: true,
          isGroupHeader: true
        }
      }
    ]
  }
];
