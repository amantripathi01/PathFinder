export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  let nodes = [startNode];
  while (nodes.length) {
    const currNode = nodes.pop();
    if (currNode.isWall || currNode.isVisited) continue;
    if (currNode === finishNode) {
      return visitedNodesInOrder;
    }
    currNode.isVisited = true;
    if (!currNode.isStart) {
      visitedNodesInOrder.push(currNode);
    }
    const visitNodes = getNeighbors(currNode, grid);
    for (let i = 0; i < visitNodes.length; i++) {
      visitNodes[i].previousNode = currNode;
      nodes.push(visitNodes[i]);
    }
  }
  return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
}
