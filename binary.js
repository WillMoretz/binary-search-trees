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

  function insert(newNode, currentNode = baseNode) {
    if (newNode.value < currentNode.value) {
      if (currentNode.left === null) currentNode.setLeft(newNode);
      else insert(newNode, currentNode.left);
    } else if (currentNode.right === null) currentNode.setRight(newNode);
    else insert(newNode, currentNode.right);
  }

  function remove(
    value,
    currentNode = baseNode,
    prevNode = null,
    direction = ""
  ) {
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
    if (currentNode.value === value) return currentNode;
    if (currentNode.right === null && currentNode.left === null)
      return undefined;
    if (value < currentNode.value) return find(value, currentNode.left);
    return find(value, currentNode.right);
  }

  function levelOrder(callback) {
    const queue = [baseNode];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode.left !== null) queue.push(currentNode.left);
      if (currentNode.right !== null) queue.push(currentNode.right);
      callback(currentNode);
    }
  }

  function preOrder(callback, currentNode = baseNode) {
    if (currentNode === null) return;
    callback(currentNode);
    preOrder(callback, currentNode.left);
    preOrder(callback, currentNode.right);
  }

  function inOrder(callback, currentNode = baseNode) {
    if (currentNode === null) return;
    inOrder(callback, currentNode.left);
    callback(currentNode);
    inOrder(callback, currentNode.right);
  }

  function postOrder(callback, currentNode = baseNode) {
    if (currentNode === null) return;
    postOrder(callback, currentNode.left);
    postOrder(callback, currentNode.right);
    callback(currentNode);
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
  };
};

const tree = binaryTree([1, 2, 5, 6, 4, 8, 0, 9]);
tree.insert(node(-1));
tree.prettyPrint(tree.find(4));
const array = [];
tree.inOrder((treeNode) => array.push(treeNode.value));
console.log(array);
