import React, { useState, useEffect } from "react";
import image from "./img/image.png";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Node from "./Node/Node";
import { dijkstra } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { Astar } from "../algorithms/Astar";
import "./PathFindingVisualizer.css";
import Popup from "./popup";
const START_NODE_ROW = 9;
const FINISH_NODE_ROW = 5;
const START_NODE_COL = 5;
const FINISH_NODE_COL = 42;
const TOTAL_ROW = 20;
const TOTAL_COL = 50;

const PathFindingVisualizer = () => {
  const [startrow, setStartRow] = useState(START_NODE_ROW);
  const [startcol, setStartCol] = useState(START_NODE_COL);
  const [finishrow, setFinishRow] = useState(FINISH_NODE_ROW);
  const [finishcol, setFinishCol] = useState(FINISH_NODE_COL);
  const [what, setWhat] = useState();
  const [change, setChange] = useState(false);
  const temp_grid = getInitialGrid();
  const [showPopup, setShowPopup] = useState(false);
  const [grid, setGrid] = useState(temp_grid);
  const [check, setCheck] = useState(false);
  const [checkClear, setCheckClear] = useState(false);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  useEffect(() => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);
  }, [finishrow, finishcol, startrow, startcol]);
  function getInitialGrid() {
    const grid = [];

    for (let row = 0; row < TOTAL_ROW; row++) {
      const crow = [];
      for (let col = 0; col < TOTAL_COL; col++) {
        crow.push(createNode(col, row));

      }
      grid.push(crow);
    }
    return grid;
  };
  function createNode(col, row) {
    return {
      col,
      row,
      isStart: row === startrow && col === startcol,
      isFinish: row === finishrow && col === finishcol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      distanceToFinish:
        Math.abs(row - finishrow) + Math.abs(col - finishcol),
    };
  };
  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  function change_finish_node() {
    setWhat("finish");
    if (check) return;
    if (checkClear) return;
    setChange(!change);
  }
  function change_start_node() {
    setWhat("start");
    if (check) return;
    if (checkClear) return;
    setChange(!change);
  }

  function handleMouseDown(row, col) {
    if (check) return;
    if (change) {
      if (what === "finish") {
        if (row === startrow && col === startcol) {
          setFinishRow(finishrow);
          setFinishCol(finishcol);
        }
        else {
          setFinishRow(row);
          setFinishCol(col);
        }
      }
      else {
        if (row === finishrow && col === finishcol) {
          setStartRow(startrow);
          setStartCol(startcol);
        }
        else {
          setStartRow(row);
          setStartCol(col);
        }

      }

      setChange(!change);
    }
    else {
      if (grid[row][col].isStart || grid[row][col].isFinish) {
        setMouseIsPressed(true);
      }
      else {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
      }

    }
  }

  function handleMouseEnter(row, col) {
    if (check) return;
    if (change) return;
    if (!mouseIsPressed) return;
    if (!(grid[row][col].isStart || grid[row][col].isFinish)) {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  }
  function handleMouseUp() {
    if (check) return;
    if (change) return;
    setMouseIsPressed(false);
  }

  function clearGrid() {
    if (change) return;
    if (checkClear) return;
    const newGrid = getInitialGrid();
    setGrid(newGrid);


    for (const row of newGrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        node.distance = Infinity;
        node.previousNode = null;
        node.isVisited = false;
        if (nodeClassName === "node node-start" || nodeClassName === "node node-finish") {
          node.isVisited = false;
          node.isWall = false;
        }
        else {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node";
          node.isVisited = false;
          node.isWall = false;
        }
      }
    }

    setCheck(false);
  }
  function Walls() {

    if (change) return;
    if (checkClear) return;

    const newGrid = grid.slice();
    for (const row of newGrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        if (nodeClassName === "node node-wall") {
          continue;
        }
        else if (nodeClassName === "node node-start" || nodeClassName === "node node-finish") {
          node.isVisited = false;
          node.isWall = false;
        }
        else {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node";
          node.isVisited = false;
          node.isWall = false;
        }
      }
    }
    setCheck(false);
  }

  function animate(visitedNodesInOrder, shortestPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
      }, 10 * i);
    }
  }

  function animateShortestPath(shortestPath) {
    for (let i = 0; i <= shortestPath.length; i++) {
      if (i === shortestPath.length) {
        setTimeout(() => {
          setCheckClear(false);
        }, 20 * i);
        return;
      }
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
      }, 10 * i);
    }
  }

  function visualize(algo) {
    if (change) return;
    if (check) return;
    const startNode = grid[startrow][startcol];
    const finishNode = grid[finishrow][finishcol];
    let visitedNodesInOrder = [];
    setCheck(true);
    setCheckClear(true);
    switch (algo) {
      case "Dijkstra":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case "Astar":
        visitedNodesInOrder = Astar(grid, startNode, finishNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      default:
        break;
    }
    if (visitedNodesInOrder.length > 0) {
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode.previousNode);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    else {
      setCheckClear(false);
      setCheck(false);
    }
    visitedNodesInOrder = [];
  }
  function getNodesInShortestPathOrder(finishNode) {

    const nodes = [];
    let curnode = finishNode;
    while (curnode !== null) {
      nodes.unshift(curnode);
      curnode = curnode.previousNode;
    }
    if (nodes.length > 1) nodes.shift(); // removes startNode from shortest path
    return nodes;
  }


  return (
    <div>
      <nav className=" .navbar-nav navbar  navbar-dark bg-dark ">
        <a className="navbar-brand">
          <b>PathFinder</b>
          <img
            src={image}
            width="30"
            height="30"
            className="d-inline-block align-top img"
            alt=""
          ></img>
        </a>
        <div className="position">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://github.com/PrakharSharma41/PathFinder"
              >
                PathFinder code
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="position">
        <button
          type="button"
          className="btn btn-primary btn-lg "
          onClick={() => visualize("Dijkstra")}
        >
          Dijkstra
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => visualize("Astar")}
        >
          A*
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => visualize("bfs")}
        >
          BFS
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => visualize("dfs")}
        >
          DFS
        </button>
        <button
          type="button"
          className="btn btn-warning btn-lg"
          onClick={() => Walls()}
        >
          Clear Grid
        </button>
        <button
          type="button"
          className="btn btn-danger btn-lg"
          onClick={() => clearGrid()}
        >
          Reset Grid
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => togglePopup()}
        >
          Info
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => change_finish_node()}
        >
          {change && what === "finish" ? "Select any target node" : "Change Target"}
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => change_start_node()}
        >
          {change && what === "start" ? "Select any start node" : "Change Start"}
        </button>

        {showPopup ? <Popup></Popup> : null}
      </div>
      <table className="grid-container">
        <tbody className="grid">
          {grid.map((row, rowidx) => {
            return (
              <tr key={rowidx}>
                {row.map((node, nodeidx) => {
                  const { row, col, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeidx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row, col) =>
                        handleMouseDown(row, col)
                      }
                      onMouseEnter={(row, col) =>
                        handleMouseEnter(row, col)
                      }
                      onMouseUp={() => handleMouseUp()}
                    ></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default PathFindingVisualizer;