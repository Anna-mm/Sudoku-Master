import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Lightbulb, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Timer,
  AlertCircle,
  CheckCircle2,
  Grid3X3,
  LayoutGrid,
  Hash,
  Sun,
  Cloud,
  Flower2,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/src/lib/utils';
import { generatePuzzle, isValid } from '@/src/lib/sudoku';
import { GameState, SudokuSize } from '@/src/types';
import { soundService } from '@/src/services/soundService';
import { 
  CuteRabbit, 
  CuteCat, 
  CuteDog, 
  CuteFox, 
  CutePanda, 
  CuteKoala 
} from '@/src/components/Animals';

const MAX_LEVELS = 100;
const COLORS = [
  { id: 'pink', bg: 'bg-pink-500', text: 'text-pink-700', border: 'border-pink-500', light: 'bg-pink-50', hover: 'hover:bg-pink-100', shadow: 'shadow-pink-200', accent: 'pink' },
  { id: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-500', light: 'bg-emerald-50', hover: 'hover:bg-emerald-100', shadow: 'shadow-emerald-200', accent: 'emerald' },
  { id: 'sky', bg: 'bg-sky-500', text: 'text-sky-700', border: 'border-sky-500', light: 'bg-sky-50', hover: 'hover:bg-sky-100', shadow: 'shadow-sky-200', accent: 'sky' },
  { id: 'amber', bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-500', light: 'bg-amber-50', hover: 'hover:bg-amber-100', shadow: 'shadow-amber-200', accent: 'amber' },
  { id: 'violet', bg: 'bg-violet-500', text: 'text-violet-700', border: 'border-violet-500', light: 'bg-violet-50', hover: 'hover:bg-violet-100', shadow: 'shadow-violet-200', accent: 'violet' },
];

const ANIMALS = [
  { id: 'cat', component: CuteCat, name: 'Cat', pattern: 'paw' },
  { id: 'dog', component: CuteDog, name: 'Dog', pattern: 'bone' },
  { id: 'rabbit', component: CuteRabbit, name: 'Rabbit', pattern: 'carrot' },
  { id: 'fox', component: CuteFox, name: 'Fox', pattern: 'leaf' },
  { id: 'panda', component: CutePanda, name: 'Panda', pattern: 'bamboo' },
  { id: 'koala', component: CuteKoala, name: 'Koala', pattern: 'eucalyptus' },
];

const Pattern = ({ type, color }: { type: string, color: string }) => {
  const icons = {
    paw: <Hash size={24} />,
    bone: <Trophy size={24} />,
    carrot: <Flower2 size={24} />,
    leaf: <Cloud size={24} />,
    bamboo: <Grid3X3 size={24} />,
    eucalyptus: <Sun size={24} />,
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div className="grid grid-cols-6 gap-8 p-4 rotate-12 scale-150">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={cn("flex items-center justify-center", color)}>
            {icons[type as keyof typeof icons] || <Flower2 size={24} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SudokuSize>(9);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(ANIMALS[2].id); // Default to Rabbit
  const [selectedColorId, setSelectedColorId] = useState<string>(COLORS[0].id); // Default to Pink
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    initialBoard: [],
    solution: [],
    size: 9,
    level: 1,
    status: 'playing',
    mistakes: 0,
    time: 0,
    selectedCell: null,
    selectedAnimal: null,
    accentColor: COLORS[0].id,
  });

  const activeColor = COLORS.find(c => c.id === (gameStarted ? gameState.accentColor : selectedColorId)) || COLORS[0];
  const activeAnimal = ANIMALS.find(a => a.id === (gameStarted ? gameState.selectedAnimal : selectedAnimalId)) || ANIMALS[2];
  const SelectedAnimalComponent = activeAnimal.component;

  useEffect(() => {
    soundService.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Initialize game
  const initGame = useCallback((size: SudokuSize, level: number, animalId: string, colorId: string) => {
    const { board, solution } = generatePuzzle(size, level);
    setGameState(prev => ({
      ...prev,
      board,
      initialBoard: board.map(row => [...row]),
      solution,
      size,
      level,
      status: 'playing',
      mistakes: 0,
      time: 0,
      selectedCell: null,
      selectedAnimal: animalId,
      accentColor: colorId,
    }));
  }, []);

  const startGame = () => {
    initGame(selectedSize, 1, selectedAnimalId, selectedColorId);
    setGameStarted(true);
  };

  const quitGame = () => {
    setGameStarted(false);
  };

  useEffect(() => {
    // Initial load doesn't start game anymore, wait for user
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.status === 'playing') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.status !== 'playing') return;
    soundService.playClick();
    setGameState(prev => ({ ...prev, selectedCell: [row, col] }));
  };

  const handleNumberInput = (num: number) => {
    if (!gameState.selectedCell || gameState.status !== 'playing') return;
    const [r, c] = gameState.selectedCell;

    // Don't allow changing initial numbers
    if (gameState.initialBoard[r][c] !== null) return;

    const isCorrect = gameState.solution[r][c] === num;

    if (isCorrect) {
      soundService.playPlace();
      const newBoard = gameState.board.map((row, ri) => 
        row.map((val, ci) => (ri === r && ci === c ? num : val))
      );
      
      setGameState(prev => {
        const won = newBoard.every((row, ri) => row.every((val, ci) => val === prev.solution[ri][ci]));
        if (won) {
          soundService.playSuccess();
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        return {
          ...prev,
          board: newBoard,
          status: won ? 'won' : 'playing'
        };
      });
    } else {
      soundService.playMistake();
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        status: prev.mistakes + 1 >= 3 ? 'lost' : 'playing'
      }));
    }
  };

  const handleHint = () => {
    if (!gameState.selectedCell || gameState.status !== 'playing') return;
    const [r, c] = gameState.selectedCell;
    if (gameState.board[r][c] !== null) return;

    soundService.playHint();
    const hintValue = gameState.solution[r][c];
    const newBoard = gameState.board.map((row, ri) => 
      row.map((val, ci) => (ri === r && ci === c ? hintValue : val))
    );

    setGameState(prev => {
      const won = newBoard.every((row, ri) => row.every((val, ci) => val === prev.solution[ri][ci]));
      return {
        ...prev,
        board: newBoard,
        status: won ? 'won' : 'playing'
      };
    });
  };

  const resetLevel = () => {
    initGame(gameState.size, gameState.level, gameState.selectedAnimal || selectedAnimalId, gameState.accentColor || selectedColorId);
  };

  const nextLevel = () => {
    if (gameState.level < MAX_LEVELS) {
      initGame(gameState.size, gameState.level + 1, gameState.selectedAnimal || selectedAnimalId, gameState.accentColor || selectedColorId);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;
      
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key);
        if (num <= gameState.size) {
          handleNumberInput(num);
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        // Optional: allow clearing if not initial
      } else if (e.key.startsWith('Arrow')) {
        setGameState(prev => {
          if (!prev.selectedCell) return { ...prev, selectedCell: [0, 0] };
          const [r, c] = prev.selectedCell;
          let nr = r, nc = c;
          if (e.key === 'ArrowUp') nr = Math.max(0, r - 1);
          if (e.key === 'ArrowDown') nr = Math.min(prev.size - 1, r + 1);
          if (e.key === 'ArrowLeft') nc = Math.max(0, c - 1);
          if (e.key === 'ArrowRight') nc = Math.min(prev.size - 1, c + 1);
          return { ...prev, selectedCell: [nr, nc] };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, gameState.size, gameState.selectedCell]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-sky-100 font-sans selection:bg-emerald-100">
      {/* Sunny Meadow Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-sky-200/10 to-transparent" />
        
        {/* Sun */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 text-yellow-400 opacity-40"
        >
          <Sun size={120} strokeWidth={1} />
        </motion.div>

        {/* Clouds */}
        <motion.div 
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 text-white opacity-30"
        >
          <Cloud size={80} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-40 text-white opacity-20"
        >
          <Cloud size={60} fill="currentColor" />
        </motion.div>

        {/* Meadow Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/20 to-transparent" />
        
        {/* Grass & Flowers */}
        <div className="absolute bottom-4 left-10 text-emerald-600/20">
          <Flower2 size={40} />
        </div>
        <div className="absolute bottom-10 right-20 text-emerald-600/20">
          <Flower2 size={30} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-emerald-600/10">
          <Flower2 size={50} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen relative z-10 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 border-4 relative overflow-hidden" style={{ borderColor: `var(--${activeColor.accent}-100)`, boxShadow: `0 25px 50px -12px var(--${activeColor.accent}-200)` }}>
              <Pattern type={activeAnimal.pattern} color={activeColor.text} />
              <SelectedAnimalComponent className="w-16 h-16 relative z-10" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 text-emerald-900">SUDOKU<br/><span className={activeColor.text}>MEADOW</span></h1>
            <p className="text-emerald-800/60 max-w-xs mb-12 font-medium">A peaceful logic challenge in the heart of the sunny meadow.</p>

            {/* Color Picker on the Left */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all shadow-lg",
                    color.bg,
                    selectedColorId === color.id ? "scale-125 border-white" : "border-transparent hover:scale-110"
                  )}
                  title={color.id}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-sm mb-8">
              {[
                { size: 3, label: 'Three gems', icon: <Grid3X3 size={20} /> },
                { size: 6, label: 'Six gems', icon: <LayoutGrid size={20} /> },
                { size: 9, label: 'Nine gems', icon: <LayoutGrid size={20} /> },
              ].map((opt) => (
                <button
                  key={opt.size}
                  onClick={() => setSelectedSize(opt.size as SudokuSize)}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 transition-all group backdrop-blur-sm",
                    selectedSize === opt.size 
                      ? `${activeColor.border} ${activeColor.light}/80 ${activeColor.text}` 
                      : "border-white bg-white/60 hover:border-gray-200 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      selectedSize === opt.size ? `${activeColor.bg} text-white` : `bg-white/80 text-gray-400 group-hover:${activeColor.light} group-hover:${activeColor.text}`
                    )}>
                      {opt.icon}
                    </div>
                    <span className="font-bold text-lg">{opt.label}</span>
                  </div>
                  {selectedSize === opt.size && <CheckCircle2 size={20} className={activeColor.text} />}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className={cn(
                "w-full max-w-sm py-5 text-white rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95 mb-8",
                activeColor.bg,
                `hover:brightness-110 ${activeColor.shadow}`
              )}
            >
              START ADVENTURE
            </button>

            <div className="w-full max-w-sm">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-800/40 block mb-4">Choose your companion</label>
              <div className="flex justify-between gap-2">
                {ANIMALS.map((animal) => {
                  const AnimalIcon = animal.component;
                  return (
                    <button
                      key={animal.id}
                      onClick={() => setSelectedAnimalId(animal.id)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center p-2 rounded-xl transition-all backdrop-blur-sm",
                        selectedAnimalId === animal.id 
                          ? `${activeColor.bg} scale-110 shadow-lg` 
                          : `bg-white/60 hover:${activeColor.light} shadow-sm`
                      )}
                      title={animal.name}
                    >
                      <AnimalIcon className={cn("w-full h-full", selectedAnimalId === animal.id ? "brightness-0 invert" : "")} />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            {/* Header */}
            <header className="max-w-4xl w-full mx-auto px-6 py-8 flex items-center justify-between relative">
              <Pattern type={activeAnimal.pattern} color={activeColor.text} />
              <div className="flex items-center gap-3 cursor-pointer relative z-10" onClick={quitGame}>
                <div className={cn("w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2", activeColor.border.replace('border-', 'border-opacity-20 border-'))}>
                  <SelectedAnimalComponent className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-emerald-900">Sudoku Meadow</h1>
                  <p className={cn("text-xs uppercase tracking-widest font-semibold", activeColor.text, "opacity-60")}>Level {gameState.level} • {gameState.size}x{gameState.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowLevelSelector(true)}
                  className="p-2 bg-white/60 hover:bg-white rounded-full transition-colors border border-transparent hover:border-emerald-100 shadow-sm"
                >
                  <Hash size={20} className="text-emerald-800" />
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 bg-white/60 hover:bg-white rounded-full transition-colors border border-transparent hover:border-emerald-100 shadow-sm"
                >
                  <Settings size={20} className="text-emerald-800" />
                </button>
              </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start flex-1">
              {/* Game Area */}
              <div className="flex flex-col items-center gap-8">
                {/* Stats Bar */}
                <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Timer size={18} className="text-emerald-600" />
                      <span className="font-mono font-medium text-emerald-900">{formatTime(gameState.time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className={cn(gameState.mistakes > 0 ? "text-red-500" : "text-emerald-600")} />
                      <span className="font-medium text-emerald-900">Mistakes: {gameState.mistakes}/3</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleHint}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm", activeColor.light, activeColor.text, activeColor.hover)}
                    >
                      <Lightbulb size={16} />
                      Hint
                    </button>
                    <button 
                      onClick={resetLevel}
                      className="p-2 text-emerald-800/40 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Reset Level"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>

                {/* Board */}
                <div 
                  className={cn(
                    "bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border-4 border-emerald-900/10 grid gap-0.5",
                    gameState.size === 9 ? "grid-cols-9" : gameState.size === 6 ? "grid-cols-6" : "grid-cols-3"
                  )}
                  style={{
                    width: 'min(90vw, 500px)',
                    height: 'min(90vw, 500px)',
                  }}
                >
                  {gameState.board.map((row, r) => (
                    row.map((val, c) => {
                      const isSelected = gameState.selectedCell?.[0] === r && gameState.selectedCell?.[1] === c;
                      const isInitial = gameState.initialBoard[r][c] !== null;
                      const isSameRow = gameState.selectedCell?.[0] === r;
                      const isSameCol = gameState.selectedCell?.[1] === c;
                      const isSameValue = val !== null && val === (gameState.selectedCell ? gameState.board[gameState.selectedCell[0]][gameState.selectedCell[1]] : null);
                      
                      // Block borders
                      const hasRightBorder = gameState.size === 9 ? (c + 1) % 3 === 0 && c !== 8 : gameState.size === 6 ? (c + 1) % 3 === 0 && c !== 5 : false;
                      const hasBottomBorder = gameState.size === 9 ? (r + 1) % 3 === 0 && r !== 8 : gameState.size === 6 ? (r + 1) % 2 === 0 && r !== 5 : false;

                      return (
                        <button
                          key={`${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          className={cn(
                            "relative flex items-center justify-center text-xl sm:text-2xl transition-all duration-150 overflow-hidden",
                            isSelected ? "bg-pink-500 text-white z-10 scale-105 shadow-lg rounded-md" : 
                            isSameValue ? "bg-pink-100 text-pink-900" :
                            (isSameRow || isSameCol) ? "bg-pink-50/50" : "bg-white/40",
                            isInitial ? "font-bold" : "font-normal text-pink-600",
                            hasRightBorder && "border-r-2 border-emerald-900/20",
                            hasBottomBorder && "border-b-2 border-emerald-900/20"
                          )}
                        >
                          {gameState.selectedAnimal && (
                            <div className={cn(
                              "absolute inset-0 flex items-center justify-center p-2 opacity-10 pointer-events-none select-none transition-transform",
                              isSelected ? "scale-150 opacity-20" : "scale-100"
                            )}>
                              <SelectedAnimalComponent className="w-full h-full" />
                            </div>
                          )}
                          <span className="relative z-10">{val}</span>
                        </button>
                      );
                    })
                  ))}
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 w-full">
                  {Array.from({ length: gameState.size }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumberInput(num)}
                      className={cn(
                        "h-12 sm:h-14 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white text-xl font-bold text-emerald-900 transition-all active:scale-95",
                        `hover:${activeColor.bg} hover:text-white`
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar / Info */}
              <aside className="space-y-8">
                <section className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-800/40 mb-4">Meadow Rules</h3>
                  <ul className="space-y-4 text-sm leading-relaxed text-emerald-900/70">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                      Fill every row, column, and block with numbers 1 to {gameState.size}.
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                      Numbers cannot repeat in any row, column, or block.
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                      You have 3 lives. Be careful with your inputs!
                    </li>
                  </ul>
                </section>

                <section className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <SelectedAnimalComponent className="w-24 h-24" />
                  </div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <Trophy className="text-emerald-400" size={20} />
                    <h3 className="font-bold">Meadow Progress</h3>
                  </div>
                  <p className="text-sm text-emerald-100/80 mb-6 relative z-10">Complete level {gameState.level} to unlock exclusive badges and track your progress.</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
                    <div 
                      className={cn("h-full transition-all duration-1000", activeColor.bg.replace('bg-', 'bg-opacity-80 bg-'))}
                      style={{ width: `${(gameState.level / MAX_LEVELS) * 100}%` }}
                    />
                  </div>
                  <div className={cn("flex justify-between mt-2 text-[10px] font-bold uppercase tracking-tighter relative z-10", activeColor.text, "opacity-80")}>
                    <span>Start</span>
                    <span>{gameState.level}% Complete</span>
                    <span>Pro</span>
                  </div>
                </section>
              </aside>
            </main>

            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={quitGame}
              className={cn(
                "fixed bottom-8 left-8 z-50 flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl font-bold shadow-lg border border-white hover:bg-white transition-all active:scale-95",
                activeColor.text
              )}
            >
              <ChevronLeft size={20} />
              Back to Menu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Win/Loss Overlay */}
        {gameState.status !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl text-center"
            >
              {gameState.status === 'won' ? (
                <>
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Level Complete!</h2>
                  <p className="text-gray-500 mb-8">You solved the puzzle in {formatTime(gameState.time)} with {gameState.mistakes} mistakes.</p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={nextLevel}
                      className={cn("w-full py-4 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg", activeColor.bg, `hover:brightness-110 ${activeColor.shadow}`)}
                    >
                      Next Level
                    </button>
                    <button 
                      onClick={resetLevel}
                      className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={48} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Game Over</h2>
                  <p className="text-gray-500 mb-8">You made too many mistakes. Don't give up!</p>
                  <button 
                    onClick={resetLevel}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                  >
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Level Selector */}
        {showLevelSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-2xl h-[80vh] rounded-[3rem] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Select Level</h2>
                <button 
                  onClick={() => setShowLevelSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="rotate-90" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {Array.from({ length: MAX_LEVELS }, (_, i) => i + 1).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => {
                        initGame(gameState.size, lvl, gameState.selectedAnimal || selectedAnimalId, gameState.accentColor || selectedColorId);
                        setShowLevelSelector(false);
                      }}
                      className={cn(
                        "aspect-square flex items-center justify-center rounded-xl font-bold transition-all",
                        gameState.level === lvl 
                          ? `${activeColor.bg} text-white scale-110 shadow-lg` 
                          : `bg-gray-50 text-gray-400 hover:${activeColor.light} hover:${activeColor.text}`
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings / Size Selector */}
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Game Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="rotate-90" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-4">Grid Design</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[3, 6, 9].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          initGame(s as SudokuSize, gameState.level, gameState.selectedAnimal || selectedAnimalId, gameState.accentColor || selectedColorId);
                          setShowSettings(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                          gameState.size === s 
                            ? `${activeColor.border} ${activeColor.light} ${activeColor.text}` 
                            : `border-gray-100 hover:${activeColor.border.replace('border-', 'border-opacity-30 border-')}`
                        )}
                      >
                        {s === 3 ? <Grid3X3 size={24} /> : s === 6 ? <LayoutGrid size={24} /> : <LayoutGrid size={24} />}
                        <span className="font-bold">{s}x{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-4">Sound Effects</label>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                      soundEnabled 
                        ? `${activeColor.border} ${activeColor.light} ${activeColor.text}` 
                        : "border-gray-100 text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      <span className="font-bold">{soundEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative transition-colors",
                      soundEnabled ? activeColor.bg : "bg-gray-200"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        soundEnabled ? "left-7" : "left-1"
                      )} />
                    </div>
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">Sudoku Master v1.0.0</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
