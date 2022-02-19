<!--
 * @Descripttion:封装动态表格组件
 * @version:
 * @Date: 2020-10-28 09:08:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-15 10:27:53
-->
<template>
  <div :class="{'dytable-view-container': true, 'data-overview-view':dataOverviewView,'wind-generator-view':windGeneratorView}">
    <!-- 只用于单个风机详情页 -->
    <div
      class="tit"
      v-if="windGeneratorView"
    >
      <div :color="['#164F76','#164F76']"> {{tableTit}} </div>
    </div>
    <!-- 自定义头部 搜索栏等 -->
    <div
      class="dytable-header mb-10"
      v-if="showHeader"
    >
      <slot name="header"></slot>
    </div>
    <div
      class="dytable-view-body"
      ref="dytableBody"
    >
      <el-table
        v-loading="loading"
        :max-height="maxTableHeight"
        element-loading-spinner="aaa"
        ref="multipleTable"
        :data="isPagination?list:list.slice((pagination.start-1)*pagination.size,pagination.start*pagination.size)"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @select="handleSelect"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        @sort-change="handleChangeSort"
      >
        <el-table-column
          v-if=" showSerial"
          label="序号"
          type="index"
          width="100"
        >
        </el-table-column>
        <template v-for="(value, key) in keys">
          <el-table-column
            :label="(typeof value === 'string')?value:value.label"
            :sortable="value.sortable != undefined ? value.sortable : sortable"
            :prop="key"
            :class-name="value.className"
            :key="'col' + key"
            :width="value.width||''"
            :show-overflow-tooltip="value.showTooltip"
          >

            <template slot-scope="scope">
              <dyitem
                v-if="value.handle"
                :render-item="(createElement) => value.handle(scope, createElement)"
              />
              <div v-else>{{scope.row[key]}}</div>
            </template>

          </el-table-column>
        </template>
        <!-- 操作栏 -->
        <el-table-column
          v-if="actions.length"
          label="操作"
          :class="'op'"
          :width="actions[0].width||''"
        >
          <template slot-scope="scope">
            <div class="action-list">
              <template v-for="(action, index) in actions">
                <el-button
                  v-if="!action.handle"
                  :key="'action' + index"
                  @click="e => { e.stopPropagation();action.action(scope.row, e);}"
                  type="text"
                  size="small"
                  style="text-align: left"
                >{{action.label}}</el-button>
                <dyitem
                  v-else
                  :key="'action' + index"
                  :render-item="(createElement) => actionHandle(action, scope, createElement)"
                />
              </template>

            </div>
          </template>
        </el-table-column>
        <!-- 无数据展示内容 -->
        <template slot="empty">
          <div
            class="dytable-view-empty"
            v-if="list.length <=0 && !loading"
          >
            <img :src="require('../../assets/image/empty.png')" />
            <p>{{emptyText}}</p>
          </div>
        </template>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div
      class="dytable-view-paging"
      v-show="list.length > 0 &&showPagination"
    >
      <el-pagination
        v-show="pagination"
        :total="pagination.total"
        :page-sizes="[20, 50,100]"
        background
        :current-page="pagination.start"
        layout="total, sizes, prev, pager, next"
        @size-change="handlePageSize"
        @current-change="handlePageCurrent"
        style="margin-top: 20px;text-align: right"
        :popper-class="dataOverviewView?'':'group-el-pagination'"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import Dyitem from './dyitem';
import { handlePageSize, handlePageCurrent } from './pageAction';
export default {
  components: {
    Dyitem
  },

  props: {
    maxTableHeight: {
      type: [String, Number],
      default: '1000'
    },
    /**
    * 是否需要前端自己分页
    * @param {Boolean}
    * @example
    */
    isPagination: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
    * table是否展示序号
    * @param {Boolean}
    * @example
    */
    showSerial: {
      type: Boolean,
      default: false
    },
    /**
    * 是否展示头部 slot组件
    * @param {Boolean}
    * @example 可自行加入搜索框选项
    */
    showHeader: {
      type: Boolean,
      default: false
    },
    /**
    * table 数据
    * @param {Array}
    * @example 可自行加入搜索框选项
    */
    list: Array,
    pagination: Object,
    /**
     * actions:自定义操作
     */
    actions: {
      type: Array,
      default: () => []
    },
    /**
    * 是否展示分页器
    * @param {Boolean}
    */
    showPagination: {
      type: Boolean,
      default: true
    },
    /**
    * 是否显示排序
    * @param {Boolean}
    */
    sortable: {
      type: Boolean,
      default: false
    },
    /**
  * 排序方法
  * @param {Function}
  */
    changeSort: {
      type: Function,
      default: null
    },
    /**
    * table表头
    * @param {Object}
    * @example
    * keys个格式有两种
     * 1. 普通形式
     * {
     *   name: '名称',
     *   age: '年龄'
     * }
     * 2. 可以自定义的形式
     * {
     *   name: '名称',
     *   age: '年龄'
     *   dance: {
     *     label: '跳舞',
     *     handle: function(scope, createElement) {
     *        return createElement('h1', 'hello, world');
     *     }
     *   }
     * }
     *  @param {Object} label 表头名称
     *  @param {Boolean} sortable 是否展示排序
     *  @param {String} className 自定义class
     *  @param {String} width 自定义宽度
     *  @param {Function} handle 自定义rander函数
    */
    keys: {
      type: Object,
      default: () => ({})
    },
    /**
    * 数据请求方法
    * @param {Function}
    */
    fetchData: {
      type: Function,
      default: null
    },
    /**
    * 无数据时展示文案
    * @param {String}
    */
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    /**
    * table样式模板展示,默认为集团看板样式
    * @param {Boolean} true 为数据概况模板
    */
    dataOverviewView: {
      type: Boolean,
      default: false
    },
    /**
   * 风机详情是否展示
   * @param {Boolean}
   */
    windGeneratorView: {
      type: Boolean,
      default: false
    },
    tableTit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      datas: [],
      selectDatas: []

    };
  },
  created() {
    this.fetchData();
  },

  mounted() {

  },

  updated() {
  },
  methods: {
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.limit = size;
      this.fetchData();
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.page = current;
      this.fetchData();
    },

    handleSelectionChange(val) {
      this.selectDatas = val;
      this.$emit('selectDataEvent', this.selectDatas);
    },

    handleSelect(select, row) {
      // console.log(select, row);
    },
    // 排序方法
    handleChangeSort(val) {
      // console.log('changeSort', val.order);
      // this.changeSort(val.order);
      // this.$emit('changeSort', val.order);
    },
    handleClick(row) {
      // console.log(row);
    },
    handlePageSize,

    handlePageCurrent,
    rowClick(row, event, column) {
      this.$emit('rowClick', { row, event, column });
    },

    actionHandle(action, scope, createElement) {
      return action.handle(scope, createElement, this);
    }
  }
};
</script>

<style lang="scss">
// ::v-deep .el-table .cell {
//   text-overflow: ellipsis;
//   overflow: hidden;
//   white-space: nowrap;
// }
.dytable-view-container {
  position: relative;
  min-height: 500px;
  margin-top: 20px;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: $group-item-bg;
  .el-table--mini td,
  .el-table--mini th {
    padding: 8px 0;
  }
  .dytable-view-body {
    flex-grow: 2;
    overflow-y: hidden;
  }
  .el-table__header-wrapper {
    background: #131d4a !important;
  }
  .el-table__body-wrapper {
    background: #131d4a !important;
  }
  .el-table {
    color: #ffffff;
  }
  .el-table .cell div,
  .el-table .cell span {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    white-space: nowrap !important;
  }
  .el-table th,
  .el-table tr {
    background: #131d4a !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #2a3460 !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #3c4984 !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: 0;
  }
  .el-table thead th,
  .el-table thead tr {
    height: 39px !important;
    background: #2a3460 !important;
    color: #ffffff;
    padding: 0 !important;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: transparent;
  }
  .dytable-view-paging {
    margin-top: 20px;
    .btn-next,
    .btn-prev {
      color: #ffffff;
      background: #1f2955;
      &:hover {
        color: #3350d4;
      }
    }
    .el-pager {
      .number,
      .btn-quicknext {
        color: #ffffff;
        background: #1f2955;
      }
    }
    .el-pagination__total,
    .el-pagination__sizes {
      color: #ffffff;
      float: left;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #3350d4;
    }
  }
  .dytable-view-empty {
    img {
      margin-top: 50px;
      width: 100px;
    }
    p {
      line-height: normal;
    }
  }
  //loading
  .el-table__empty-block {
    background: #131d4a !important;
    padding-top: 40px;
  }
  .el-loading-mask {
    background: rgba($color: #000000, $alpha: 1) !important;
  }
  .el-pagination.is-background .el-pager li {
    background-color: #1f2955;
  }
  //数据概况
  &.data-overview-view {
    background-color: $data-item-bg;
    .el-table__header-wrapper {
      background: #ffffff !important;
    }
    .el-table__body-wrapper {
      background: #ffffff !important;
    }
    .el-table {
      color: #333333;
    }
    .el-table th,
    .el-table tr {
      background: #ffffff !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #f4f4f4 !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #d9ecff !important;
    }
    .el-pagination.is-background .el-pager li {
      background-color: #fff;
      border: 1px solid #e1e3e4;
    }

    .el-table td,
    .el-table th.is-leaf {
      border: 0;
    }
    .el-table thead th,
    .el-table thead tr {
      background: #f4f4f4 !important;
      color: #333333;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: transparent;
    }
    .dytable-view-paging {
      margin-top: 20px;
      .btn-next,
      .btn-prev {
        color: #333333;
        background: #ffffff;
        border: 1px solid #e1e3e4;
        &:hover {
          color: #3350d4;
        }
      }
      .el-pager {
        .number,
        .btn-quicknext {
          color: #333333;
          background: #ffffff;
          border: 1px solid #e1e3e4;
        }
      }
      .el-pagination__total,
      .el-pagination__sizes {
        color: #333333;
        float: left;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #3350d4;
      }
    }
    .dytable-view-empty {
      img {
        margin-top: 50px;
        width: 100px;
      }
      p {
        line-height: normal;
      }
    }
    .el-table__empty-block {
      background: #ffffff !important;
    }
    .el-loading-mask {
      background: rgba($color: #ffffff, $alpha: 1) !important;
    }
  }
  // 风机详情页的样式
  &.wind-generator-view {
    background-color: $wind-item-bg;
    box-shadow: rgb(22, 79, 118) 0px 0px 40px inset;
    // border: 1px solid rgb(22, 79, 118);
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 6px;

    .tit {
      font-size: 16px;
      text-align: center;
      padding-top: 5px;
    }
    .dytable-view-body {
      border: 0 !important;
    }
    .el-table__empty-text {
      padding-bottom: 40px;
    }
    .el-table__header-wrapper {
      background: #060c23 !important;
    }
    .el-table__body-wrapper {
      background: #060c23 !important;
    }
    .el-table {
      border: 0 !important;
      color: #7c919b;
      background-color: rgb(6, 12, 35);
    }
    .el-table th,
    .el-table tr {
      background: #060c23 !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #060c23 !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #060c23 !important;
    }
    .el-table td,
    .el-table th.is-leaf {
      border: 0;
    }
    .el-table thead th,
    .el-table thead tr {
      background: #060c23 !important;
      color: #7c919b;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: transparent;
      // background-color: rgb(6, 12, 35);
    }
    .dytable-view-paging {
      margin-top: 20px;
      .btn-next,
      .btn-prev {
        color: #7c919b;
        background: #060c23;
        border: 1px solid #7c919b;
        &:hover {
          color: #3350d4;
        }
      }
      .el-pager {
        .number,
        .btn-quicknext {
          color: #7c919b;
          background: #060c23;
          border: 1px solid #7c919b;
        }
      }
      .el-pagination__total,
      .el-pagination__sizes {
        color: #7c919b;
        float: left;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #3350d4;
      }
    }
    .dytable-view-empty {
      img {
        margin-top: 50px;
        width: 100px;
      }
      p {
        line-height: normal;
      }
    }
    .el-table__empty-block {
      background: #060c23 !important;
      border: none !important;
    }
    .el-loading-mask {
      background: rgba($color: #7c919b, $alpha: 1) !important;
    }
  }
}
</style>
