'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_SPEED = 3;
const PIPE_SPACING = 300;

export default function FlappyBird() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdRef = useRef<Bird>({ x: 100, y: GAME_HEIGHT / 2, velocity: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  const createPipe = useCallback((): Pipe => {
    const minHeight = 50;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: GAME_WIDTH,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    };
  }, []);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 100, y: GAME_HEIGHT / 2, velocity: 0 };
    pipesRef.current = [createPipe()];
    frameCountRef.current = 0;
    setScore(0);
  }, [createPipe]);

  const jump = useCallback(() => {
    if (gameState === 'start') {
      setGameState('playing');
      resetGame();
    }

    if (gameState === 'playing') {
      birdRef.current.velocity = JUMP_STRENGTH;
    }

    if (gameState === 'gameOver') {
      setGameState('playing');
      resetGame();
    }
  }, [gameState, resetGame]);

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
    // Check if bird hits the ground or ceiling
    if (bird.y + BIRD_SIZE >= GAME_HEIGHT || bird.y <= 0) {
      return true;
    }

    // Check collision with pipes
    for (const pipe of pipes) {
      const birdRight = bird.x + BIRD_SIZE;
      const birdBottom = bird.y + BIRD_SIZE;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (bird.x < pipeRight && birdRight > pipe.x) {
        if (bird.y < pipe.topHeight || birdBottom > pipe.bottomY) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update bird physics
    const bird = birdRef.current;
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Update pipes
    const pipes = pipesRef.current;
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= PIPE_SPEED;

      // Check if pipe is passed for scoring
      if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < bird.x) {
        pipes[i].passed = true;
        setScore((prev) => prev + 1);
      }

      // Remove off-screen pipes
      if (pipes[i].x + PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
      }
    }

    // Add new pipes
    frameCountRef.current++;
    if (frameCountRef.current % Math.floor(PIPE_SPACING / PIPE_SPEED) === 0) {
      pipes.push(createPipe());
    }

    // Check collisions
    if (checkCollision(bird, pipes)) {
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw pipes
    ctx.fillStyle = '#2F8F2F';
    pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, GAME_HEIGHT - pipe.bottomY);

      // Pipe borders
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, GAME_HEIGHT - pipe.bottomY);
    });

    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2, bird.y + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + BIRD_SIZE / 2 + 5, bird.y + BIRD_SIZE / 2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw beak
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(bird.x + BIRD_SIZE, bird.y + BIRD_SIZE / 2);
    ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE / 2 - 3);
    ctx.lineTo(bird.x + BIRD_SIZE + 8, bird.y + BIRD_SIZE / 2 + 3);
    ctx.closePath();
    ctx.fill();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, highScore, createPipe, checkCollision]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
          Flappy Bird
        </h1>
        <div className="flex gap-8 justify-center text-white text-xl font-semibold">
          <div>Score: <span className="text-yellow-300">{score}</span></div>
          <div>High Score: <span className="text-yellow-300">{highScore}</span></div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onClick={jump}
          className="border-4 border-white rounded-lg shadow-2xl cursor-pointer"
        />

        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-center p-8">
              <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
              <p className="text-xl mb-2">Click or press SPACE to start</p>
              <p className="text-lg opacity-80">Keep the bird flying between the pipes!</p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-center p-8">
              <h2 className="text-4xl font-bold mb-4 text-red-400">Game Over!</h2>
              <p className="text-2xl mb-2">Final Score: <span className="text-yellow-300">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="text-xl mb-4 text-green-400">New High Score!</p>
              )}
              <p className="text-xl">Click or press SPACE to restart</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-white max-w-md">
        <p className="text-sm opacity-80">
          Controls: Click on the game or press SPACEBAR to make the bird jump
        </p>
      </div>
    </div>
  );
}
