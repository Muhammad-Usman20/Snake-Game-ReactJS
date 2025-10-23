
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const BOARD_SIZE = 20;

function App() {
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200);

  const touchStart = useRef({ x: 0, y: 0 });

  // Move snake every few ms
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, speed]);

  // Keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // Touch swipe control for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0 && direction !== "LEFT") setDirection("RIGHT");
      else if (dx < 0 && direction !== "RIGHT") setDirection("LEFT");
    } else {
      // Vertical swipe
      if (dy > 0 && direction !== "UP") setDirection("DOWN");
      else if (dy < 0 && direction !== "DOWN") setDirection("UP");
    }
  };

  // Snake movement logic
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[newSnake.length - 1]];

    switch (direction) {
      case "UP":
        head[1] -= 1;
        break;
      case "DOWN":
        head[1] += 1;
        break;
      case "LEFT":
        head[0] -= 1;
        break;
      case "RIGHT":
        head[0] += 1;
        break;
      default:
        break;
    }

    // Collision with wall or self
    if (
      head[0] < 0 ||
      head[0] >= BOARD_SIZE ||
      head[1] < 0 ||
      head[1] >= BOARD_SIZE ||
      snake.some(([x, y]) => x === head[0] && y === head[1])
    ) {
      setGameOver(true);
      return;
    }

    newSnake.push(head);

    // Eating food
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
      setScore(score + 10);
      if (speed > 80) setSpeed(speed - 10); // Faster speed
    } else {
      newSnake.shift(); // Remove tail
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake([[8, 8]]);
    setFood([5, 5]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(200);
  };

  // Create grid
  const cells = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      let className = "cell";
      if (snake.some(([sx, sy]) => sx === x && sy === y)) className += " snake";
      if (food[0] === x && food[1] === y) className += " food";
      cells.push(<div key={`${x}-${y}`} className={className}></div>);
    }
  }

  return (
    <div
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1>🐍 Snake Game</h1>
      <h2>Score: {score}</h2>
      <div className="board">{cells}</div>

      {gameOver && (
        <div className="overlay">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default App;

