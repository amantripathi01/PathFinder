import React from "react";
import start from "./img/start.png";
import wall from "./img/wall.png";
import visit from "./img/visit.png";
import finish from "./img/finish.png";
import short from "./img/short.png";
import "./pop.css";

const Popup = () => {
  return (
    <div>
      <table className=" table-hover size table table-bordered table-dark">
        <tbody>
          <tr>
            <th scope="row">Node</th>

            <td>
              <img src={start} className="start pos" alt="white color"></img>
            </td>
            <td>
              <img
                src={finish}
                className="finish pos"
                alt="dark red color"
              ></img>
            </td>
            <td>
              <img
                src={wall}
                className="wall change "
                alt="black color"
              ></img>
            </td>
            <td>
              <img
                src={short}
                className="wall change "
                alt="black color"
              ></img>
            </td>
            <td>
              <img src={visit} className="visited  " alt="black color"></img>
            </td>
          </tr>
          <tr>
            <th scope="row">Functionality</th>
            <td>Start</td>
            <td>Finish</td>
            <td>Wall (Double click & scroll to create wall)</td>
            <td>Shortest Path Node</td>
            <td>Visited Node</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Popup;
