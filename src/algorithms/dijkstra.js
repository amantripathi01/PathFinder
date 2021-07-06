export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  if (!startNode || !finishNode || startNode === finishNode) return false;
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    } // if we cannot reach finish node
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    if (!closestNode.isStart) {
      visitedNodesInOrder.push(closestNode);
    }

    updateNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNeighbors) {
  unvisitedNeighbors.sort((a, b) => a.distance - b.distance);
}

function updateNeighbors(node, grid) {
  const unvisitedNeighbors = getNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
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

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
