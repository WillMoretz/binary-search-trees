function mergeSort(array) {
  if (array.length <= 1) return array;
  const halfLength = Math.ceil(array.length / 2);
  let left = array.slice(0, halfLength);
  let right = array.slice(halfLength);
  if (left.length > 1) {
    left = mergeSort(left);
  }
  if (right.length > 1) {
    right = mergeSort(right);
  }
  let result = [];
  while (true) {
    if (left.length === 0 && right.length === 0) break;

    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());

    if (left.length === 0) {
      result = result.concat(right);
      break;
    }
    if (right.length === 0) {
      result = result.concat(left);
      break;
    }
  }
  return result;
}

module.exports = mergeSort;
