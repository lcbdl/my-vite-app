import { Card } from "@/components/ui/card";

class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// Helper function to create a binary tree from an array
const createBinaryTree = (arr: number[]): TreeNode | null => {
  if (arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];

  let i = 1;
  while (i < arr.length) {
    const current = queue.shift()!;
    if (arr[i] !== null) {
      current.left = new TreeNode(arr[i]);
      queue.push(current.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      current.right = new TreeNode(arr[i]);
      queue.push(current.right);
    }
    i++;
  }

  return root;
};

/* Helper function to print a binary tree in console log in a tree structure like this
             1
            / \
           2   3
          / \   \
         4   5   6
*/
const printBinaryTree = (root: TreeNode | null): void => {
  if (!root) {
    console.log("Empty tree");
    return;
  }

  const getHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const height = getHeight(root);
  const width = Math.pow(2, height) - 1;

  // Create a 2D array to store the tree representation
  const treeArray: (string | null)[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));

  const fillTreeArray = (node: TreeNode | null, row: number, col: number, levelWidth: number) => {
    if (!node) return;

    treeArray[row][col] = node.value.toString();

    if (node.left) {
      fillTreeArray(node.left, row + 1, col - Math.floor(levelWidth / 2), Math.floor(levelWidth / 2));
    }
    if (node.right) {
      fillTreeArray(node.right, row + 1, col + Math.floor(levelWidth / 2), Math.floor(levelWidth / 2));
    }
  };

  fillTreeArray(root, 0, Math.floor(width / 2), Math.floor(width / 2));

  // Print the tree
  for (let i = 0; i < height; i++) {
    let line = "";
    for (let j = 0; j < width; j++) {
      if (treeArray[i][j] !== null) {
        line += treeArray[i][j];
      } else {
        line += " ";
      }
    }
    console.log(line);
  }
};

// Alternative simpler approach for basic tree visualization
const printTreeSimple = (root: TreeNode | null, prefix: string = "", isLeft: boolean = true): void => {
  if (!root) return;

  console.log(prefix + (isLeft ? "└── " : "┌── ") + root.value);

  if (root.left) {
    printTreeSimple(root.left, prefix + (isLeft ? "    " : "│   "), true);
  }
  if (root.right) {
    printTreeSimple(root.right, prefix + (isLeft ? "    " : "│   "), false);
  }
};

// Binaary tree BFS traversal example
const bfsTraverse = (root: TreeNode): number[][] => {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
};

const bfsTraverseRecursive = (root: TreeNode | null): number[][] => {
  const result: number[][] = [];

  const traverse = (node: TreeNode | null, level: number) => {
    if (!node) return;

    // If result.length === level, it means we are visiting this level for the first time.
    // Therefore, we need to create a new array (bucket) in result for this level, so we can start collecting node values at that depth.
    if (result.length === level) {
      result.push([]);
    }

    result[level].push(node.value);

    traverse(node.left, level + 1);
    traverse(node.right, level + 1);
  };

  traverse(root, 0);
  return result;
};

export const TreeGraphExamPage = () => {
  /* Example binary tree: 
             1
            / \
           2   3
          / \   \
         4   5   6
    */
  const root1 = createBinaryTree([1, 2, 3, 4, 5, 6]);

  const output1 = bfsTraverse(root1!);
  const output2 = bfsTraverseRecursive(root1);

  console.log(output1);
  console.log(output2);

  return (
    <div>
      <h1>Tree Graph Example</h1>

      <div className="grid w-full grid-cols-1 gap-6 p-4">
        <Card title="1. BFS Traversal of a Binary Search Tree">
          <h3>Input Tree Structure</h3>
          <pre>
            {`
           1
          / \\
         2   3
        / \\   \\
       4   5   6
        `}
          </pre>
          <h3>BFS Traversal Output</h3>
          <pre>{JSON.stringify(output2)}</pre>
        </Card>
      </div>
    </div>
  );
};
