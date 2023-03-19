const mergeSort = require("./merge");

const node = (data) => ({
  value: data,
  left: null,
  right: null,
  setLeft(newleft) {
    this.left = newleft;
  },
  setRight(newRight) {
    this.right = newRight;
  },
});

const binaryTree = (array) => {
  // Removes duplicates, then sorts
  function sanitizeArray(input) {
    return mergeSort([...new Set(input)]);
  }

  function buildTree(input) {
    const arr = sanitizeArray(input);

    function recur(start, end) {
      if (start > end) return null;
      const middle = Math.floor((start + end) / 2);
      const treeNode = node(arr[middle]);
      treeNode.setLeft(recur(start, middle - 1));
      treeNode.setRight(recur(middle + 1, end));
      return treeNode;
    }

    return recur(0, arr.length - 1);
  }

  let baseNode = buildTree(array);
  console.log(baseNode);

  const prettyPrint = (treeNode, prefix = "", isLeft = true) => {
    if (treeNode === null) {
      return;
    }
    if (treeNode.right !== null) {
      prettyPrint(
        treeNode.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${treeNode.value}`);
    if (treeNode.left !== null) {
      prettyPrint(treeNode.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  return { buildTree, prettyPrint, baseNode };
};

const tree = binaryTree([1, 2, 5, 6, 4, 8, 0, 9]);
tree.prettyPrint(tree.baseNode);
