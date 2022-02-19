/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-10-29 09:03:50
 */
/**
 * 修改一页显示的数量
 * @param {integer} size 一页显示的数量
 */
export function handlePageSize(size) {
  this.pagination.size = size;
  if (this.isPagination) {
    this.fetchData();
  }
}
/**
 * 点击分页时的事件
 * @param {*} current 当前页码
 */
export function handlePageCurrent(current) {
  this.pagination.start = current;
  if (this.isPagination) {
    this.fetchData();
  }
}
