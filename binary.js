const mergeSort = require("./merge");

const node = (data) => ({
  value: data,
  left: null,
  right: null,
  setValue(newValue) {
    this.value = newValue;
  },
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
    if (input === null) return null;
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

  const prettyPrint = (treeNode, prefix = "", isLeft = true) => {
    if (treeNode === null || treeNode === undefined) {
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

  function insert(value, currentNode = baseNode) {
    if (baseNode === null) {
      baseNode = node(value);
      return;
    }

    if (value < currentNode.value) {
      if (currentNode.left === null) currentNode.setLeft(node(value));
      else insert(value, currentNode.left);
    } else if (currentNode.right === null) currentNode.setRight(node(value));
    else insert(value, currentNode.right);
  }

  function remove(
    value,
    currentNode = baseNode,
    prevNode = null,
    direction = ""
  ) {
    if (baseNode === null) return null;
    if (value < currentNode.value) {
      return remove(value, currentNode.left, currentNode, "left");
    }
    if (value > currentNode.value) {
      return remove(value, currentNode.right, currentNode, "right");
    }
    // Remove Leaf Node
    if (currentNode.left === null && currentNode.right === null) {
      if (direction === "left") {
        prevNode.setLeft(null);
        return currentNode;
      }
      if (direction === "right") {
        prevNode.setRight(null);
        return currentNode;
      }
      baseNode = null;
      return null;
    }
    // Remove Left Branch Node
    if (currentNode.left !== null && currentNode.right === null) {
      if (direction === "left") {
        prevNode.setLeft(currentNode.left);
        return currentNode;
      }
      if (direction === "right") {
        prevNode.setRight(currentNode.left);
        return currentNode;
      }
    }
    // Remove Right Branch Node
    if (currentNode.left === null && currentNode.right !== null) {
      if (direction === "left") {
        prevNode.setLeft(currentNode.right);
        return currentNode;
      }
      if (direction === "right") {
        prevNode.setRight(currentNode.right);
        return currentNode;
      }
    }
    // Remove Left and Right Branch Node
    function replaceNode(replacementNode, parentNode) {
      let rNode = replacementNode;
      let pNode = parentNode;
      while (rNode.left !== null) {
        pNode = rNode;
        rNode = rNode.left;
      }
      if (rNode.right === null) {
        if (pNode.right === rNode) {
          pNode.setRight(null);
        } else {
          pNode.setLeft(null);
        }
      } else if (pNode.right === rNode) {
        pNode.setRight(rNode.right);
      } else {
        pNode.setLeft(rNode.right);
      }

      currentNode.setValue(rNode.value);
      return rNode;
    }
    return replaceNode(currentNode.right, currentNode);
  }

  function find(value, currentNode = baseNode) {
    if (baseNode === null) return undefined;

    if (currentNode.value === value) return currentNode;
    if (currentNode.right === null && currentNode.left === null)
      return undefined;
    if (value < currentNode.value) return find(value, currentNode.left);
    return find(value, currentNode.right);
  }

  // eslint-disable-next-line consistent-return
  function levelOrder(callback) {
    const defaultResult = [];
    const queue = [baseNode];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode.left !== null) queue.push(currentNode.left);
      if (currentNode.right !== null) queue.push(currentNode.right);
      // eslint-disable-next-line no-unused-expressions
      if (callback === undefined) defaultResult.push(currentNode.value);
      else callback(currentNode);
    }
    if (callback === undefined) return defaultResult;
  }

  function preOrder(callback) {
    if (baseNode === null) return;
    const defaultResult = [];
    let newCallback;
    if (callback === undefined)
      newCallback = (treeNode) => defaultResult.push(treeNode.value);
    else newCallback = callback;

    function recur(cb, currentNode) {
      if (currentNode === null) return;
      cb(currentNode);
      recur(cb, currentNode.left);
      recur(cb, currentNode.right);
    }
    recur(newCallback, baseNode);
    // eslint-disable-next-line consistent-return
    if (callback === undefined) return defaultResult;
  }

  function inOrder(callback) {
    if (baseNode === null) return;
    const defaultResult = [];
    let newCallback;
    if (callback === undefined)
      newCallback = (treeNode) => defaultResult.push(treeNode.value);
    else newCallback = callback;

    function recur(cb, currentNode) {
      if (currentNode === null) return;
      recur(cb, currentNode.left);
      cb(currentNode);
      recur(cb, currentNode.right);
    }
    recur(newCallback, baseNode);
    // eslint-disable-next-line consistent-return
    if (callback === undefined) return defaultResult;
  }

  function postOrder(callback) {
    if (baseNode === null) return;
    const defaultResult = [];
    let newCallback;
    if (callback === undefined)
      newCallback = (treeNode) => defaultResult.push(treeNode.value);
    else newCallback = callback;

    function recur(cb, currentNode) {
      if (currentNode === null) return;
      recur(cb, currentNode.left);
      recur(cb, currentNode.right);
      cb(currentNode);
    }
    recur(newCallback, baseNode);
    // eslint-disable-next-line consistent-return
    if (callback === undefined) return defaultResult;
  }

  function height(targetNode) {
    if (targetNode === undefined) return undefined;
    if (baseNode === null) return 0;
    let i = 0;
    function recur(currentNode) {
      if (currentNode === null) return undefined;
      i += 1;
      if (currentNode.value === targetNode.value) return i;
      if (targetNode.value < currentNode.value) return recur(currentNode.left);
      return recur(currentNode.right);
    }
    return recur(baseNode);
  }

  return {
    buildTree,
    prettyPrint,
    insert,
    remove,
    find,
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    height,
  };
};

const tree = binaryTree([1, 2, 5, 6, 4, 8, 0, 9]);
tree.insert(-1);
tree.prettyPrint(tree.find(4));
console.log(tree.height(tree.find(9)));
