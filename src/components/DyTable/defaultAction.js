
export function deleteDataAction(select) {
  this.$emit('delete', select);
}

export function filterAction() {
  this.isadvance = !this.isadvance;
  return 0;
}
