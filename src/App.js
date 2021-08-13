import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  var colors = ["red", "blue", "yellow", "green", "pink", "purble", "brown", "orange", "gray"];
  const [size, setSize] = useState("");
  const [numberOfIslands, setnumberOfIslands] = useState(0);
  var counter = 0, isStepColored = "false", rows, cols, Islands, visited, colored;

  function setUp() {
    const myMatrix = size.split(",");
    rows = myMatrix[0];
    cols = myMatrix[1];
    Islands = new Array(rows);
    visited = new Array(rows);
    colored = new Array(rows);
    for (var i = 0; i < rows; i++) {
      Islands[i] = new Array(cols);
      visited[i] = new Array(cols);
      colored[i] = new Array(cols);
    }
    for (var x = 0; x < rows; x++) {
      for (var y = 0; y < cols; y++) {
        Islands[x][y] = 0
        visited[x][y] = "false";
        colored[x][y] = -1;
      }
    }
  }

  function draw() {
    setUp();
    document.getElementById("canvas").width = rows * 30;
    document.getElementById("canvas").height = cols * 30;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        Islands[i][j] = 0
        visited[i][j] = "false";
        colored[i][j] = -1;
        ctx.fillStyle = "white"
        ctx.fillRect(i * 30, j * 30, 30, 30);
        ctx.strokeRect(i * 30, j * 30, 30, 30);
        canvas.addEventListener('click', function (event) {
          var x = parseInt(event.offsetX / 30);
          var y = parseInt(event.offsetY / 30);
          console.log(parseInt(event.offsetX / 30), parseInt(event.offsetY / 30))
          Islands[x][y] = 1
          ctx.fillStyle = "black"
          ctx.fillRect(x * 30, y * 30, 30, 30);
          ctx.strokeRect(x * 30, y * 30, 30, 30);
        });
      }
    }
  }

  function doRandomizeOrSolve() {
    if (isStepColored === "false") {
      setUp();
    }
    document.getElementById("canvas").width = rows * 30;
    document.getElementById("canvas").height = cols * 30;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    for (var x = 0; x < rows; x++) {
      for (var y = 0; y < cols; y++) {
        var number = Math.random();
        if (isStepColored === "true" && Islands[x][y] === 1) {
          if (counter < colors.length)
            ctx.fillStyle = colors[colored[x][y]];
          else
            ctx.fillStyle = "red"
          ctx.fillRect(x * 30, y * 30, 30, 30);
          ctx.strokeRect(x * 30, y * 30, 30, 30);
        }
        else {
          if (number < 0.2 && isStepColored === "false") {
            Islands[x][y] = 1
            ctx.fillStyle = "black"
          }
          else
            ctx.fillStyle = "white"
          ctx.fillRect(x * 30, y * 30, 30, 30);
          ctx.strokeRect(x * 30, y * 30, 30, 30);
        }
      }
    }
  }

  function isSafe(i, j) {
    return (i >= 0 && i < rows && j >= 0 && j < cols && (Islands[i][j] === 1 && visited[i][j] === "false"));
  }

  function foundIslands(i, j) {
    var row = [-1, -1, -1, 0, 0, 1, 1, 1];
    var col = [-1, 0, 1, -1, 1, -1, 0, 1];
    visited[i][j] = "true";
    colored[i][j] = counter;
    for (var r = 0; r < 8; ++r)
      if (isSafe(i + row[r], j + col[r]))
        foundIslands(i + row[r], j + col[r]);
  }

  function solveIslands() {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (Islands[i][j] === 1 && visited[i][j] === "false") {
          foundIslands(i, j);
          counter++;
          setnumberOfIslands(counter);
        }
      }
    }
    isStepColored = "true";
    doRandomizeOrSolve();
  }

  function Restart() {
    doRandomizeOrSolve();
    setnumberOfIslands(0);
    isStepColored = "false";
    counter = 0;
    cols = 0;
    rows = 0;
    document.getElementById("canvas").width = 0;
    document.getElementById("canvas").height = 0;
  }

  return (
    <Router>
      <div className="Center">
        <canvas id="canvas" width="0" height="0" ></canvas>
        <Switch>
          <Route path="/Randomize">
            <div className="Center"><Link to="Solution"><button onClick={solveIslands} id="solve" className="button-style">Solve</button></Link> </div>
          </Route>
          <Route path="/Solution">
            <div className="Center">
              <h3>Found {numberOfIslands} Islands!</h3>
              <Link to="/"><button onClick={Restart} className="button-style"> Restart </button></Link>
            </div>
          </Route>
          <Route path="/draw">
            <div className="Center"><Link to="Solution"><button onClick={solveIslands} id="solve" className="button-style">Solve</button></Link> </div>
          </Route>
          <Route path="/">
            <div className="Center">
              <h3 >please enter bitmap size:</h3>
              <input type="text" placeholder="Bitmap size: n, m" onChange={(e) => { setSize(e.target.value) }}></input>
              <p><Link to="/Randomize"><button onClick={doRandomizeOrSolve} className="button-style">Randomize</button></Link></p>
              <p><Link to="/draw"><button onClick={draw} className="button-style">Draw</button></Link></p>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
