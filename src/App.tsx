/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  Brain, 
  RefreshCcw, 
  Sparkles, 
  Dices, 
  Volume2, 
  VolumeX, 
  Compass, 
  BookOpen, 
  Clock, 
  ListRestart, 
  Key, 
  Lock, 
  ShieldAlert, 
  Bomb, 
  Sword, 
  Ticket, 
  Music, 
  Terminal, 
  AlertOctagon, 
  Eye, 
  ChevronRight, 
  HelpCircle,
  Award,
  Download,
  FileCode
} from 'lucide-react';
import { STORY_NODES } from './data/story';
import { SURVIVAL_ENVIRONMENTS } from './data/environments';
import { Item, Environment, Clue, HistoryLog, GameChoice } from './types';

// Web Audio API Ambient Sound controller
class SoundController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private heartbeatInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext not supported');
    }
  }

  setMute(mute: boolean) {
    if (!this.masterGain) return;
    this.masterGain.gain.setValueAtTime(mute ? 0 : 0.3, this.ctx?.currentTime || 0);
  }

  playTick() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playChime() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((f, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + index * 0.08);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + index * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + index * 0.08);
      osc.stop(t + index * 0.08 + 0.6);
    });
  }

  playHurt() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.4);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(115, t);
    osc2.frequency.linearRampToValueAtTime(40, t + 0.4);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc2.start();
    osc.stop(t + 0.5);
    osc2.stop(t + 0.5);
  }

  startHeartbeat(sanity: number) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const playPulse = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(sanity < 30 ? 0.35 : 0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(t + 0.3);

      setTimeout(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const t2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(52, t2);
        gain2.gain.setValueAtTime(0, t2);
        gain2.gain.linearRampToValueAtTime(sanity < 30 ? 0.3 : 0.1, t2 + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.25);
        osc2.connect(gain2);
        gain2.connect(this.masterGain!);
        osc2.start();
        osc2.stop(t2 + 0.3);
      }, 150);
    };

    const intervalRate = sanity < 30 ? 700 : 1500;
    this.heartbeatInterval = setInterval(playPulse, intervalRate);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

const audio = new SoundController();

export default function App() {
  const [sanity, setSanity] = useState<number>(100);
  const [loop, setLoop] = useState<number>(1);
  const [currentNodeId, setCurrentNodeId] = useState<string>('START');
  const [environment, setEnvironment] = useState<Environment>(SURVIVAL_ENVIRONMENTS[0]);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [endedRuns, setEndedRuns] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const textTimerRef = useRef<any>(null);

  // Puzzle State
  const [puzzleInput, setPuzzleInput] = useState<string>('');
  const [puzzleError, setPuzzleError] = useState<string | null>(null);

  // Standalone game HTML export states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleDownloadHTML = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const response = await fetch('/abyssal-game.html');
      if (!response.ok) {
        throw new Error('无法连接到服务端获取 HTML 文件');
      }
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'abyssal-game.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog('💾 成功下载单文件 HTML 独立游戏包！', 'heal');
    } catch (err: any) {
      console.error(err);
      setExportError('下载失败: ' + (err.message || '未知错误'));
      addLog('❌ 下载独立版 HTML 失败！', 'damage');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const response = await fetch('/abyssal-game.html');
      if (!response.ok) {
        throw new Error('无法从服务端读取完整 HTML 代码');
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      addLog('📋 成功复制完整 HTML 游戏源码！', 'heal');
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setExportError('复制失败，请点击下载，或尝试从文件树直接查阅代码。');
      addLog('❌ 复制 HTML 源码失败！', 'damage');
    } finally {
      setIsExporting(false);
    }
  };

  // Load the current node
  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES.START;

  // Initialize environment and logs at starting nodes
  useEffect(() => {
    if (currentNodeId === 'START' && sanity === 100) {
      rollRandomEnvironment();
      addLog('你睁开了无力的双腿。这里是轮回的最初起点……', 'system');
    }
  }, [currentNodeId]);

  // Audio adjustments based on current Sanity
  useEffect(() => {
    if (isAudioInitialized && !isMuted) {
      audio.startHeartbeat(sanity);
    } else {
      audio.stopHeartbeat();
    }
    return () => audio.stopHeartbeat();
  }, [sanity, isAudioInitialized, isMuted]);

  // Typewriter text printing engine
  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    if (textTimerRef.current) clearInterval(textTimerRef.current);

    const fullDesc = currentNode.desc;
    let i = 0;
    
    textTimerRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + fullDesc.charAt(i));
      if (!isMuted) {
        // Fast random auditory tick
        if (i % 2 === 0) audio.playTick();
      }
      i++;
      if (i >= fullDesc.length) {
        clearInterval(textTimerRef.current);
        setIsTypingComplete(true);
      }
    }, 15);

    return () => {
      if (textTimerRef.current) clearInterval(textTimerRef.current);
    };
  }, [currentNodeId, isMuted]);

  const forceSkipTypewriter = () => {
    if (textTimerRef.current) clearInterval(textTimerRef.current);
    setDisplayedText(currentNode.desc);
    setIsTypingComplete(true);
  };

  // Sound enablement helper
  const handleEnableAudio = () => {
    audio.init();
    setIsAudioInitialized(true);
    setIsMuted(false);
    audio.setMute(false);
    audio.playChime();
    addLog('🔊 疯人院共鸣脑电波已激活 - 带入感已提升', 'system');
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMute(nextMuted);
  };

  // Helper log generator
  const addLog = (text: string, type: 'action' | 'damage' | 'heal' | 'system' | 'clue') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setHistoryLogs((prev) => [{ timestamp: timeStr, text, type }, ...prev.slice(0, 40)]);
  };

  // Roll randomized environmental status
  const rollRandomEnvironment = () => {
    // Exclude index 0 (normal) to guarantee an interesting start if preferred,
    // but a pure random choice from the list is best!
    const rolled = SURVIVAL_ENVIRONMENTS[Math.floor(Math.random() * SURVIVAL_ENVIRONMENTS.length)];
    setEnvironment(rolled);
    addLog(`🌪️ 生存环境突变：当前天煞重力为 【${rolled.name}】`, 'system');
    addLog(`环境法则：${rolled.effectText}`, 'system');
    audio.playHurt();
  };

  // Handle choice execution
  const executeChoice = (choice: GameChoice) => {
    const costMult = environment.sanCostMultiplier;
    let sanDelta = choice.sanDelta || 0;

    // Apply toxic fog extra health impact
    if (environment.type === 'TOXIC_FOG' && sanDelta < 0) {
      sanDelta -= 5;
    }

    // Apply environment multiplier for sanity loss
    if (sanDelta < 0) {
      sanDelta = Math.round(sanDelta * costMult);
    }

    const nextSanity = Math.max(0, Math.min(100, sanity + sanDelta));
    setSanity(nextSanity);

    if (sanDelta < 0) {
      addLog(`🧠 理智受到狂乱冲击，损失 ${Math.abs(sanDelta)} 点。`, 'damage');
      if (!isMuted) audio.playHurt();
    } else if (sanDelta > 0) {
      addLog(`🩹 灵魂防线稍稍回稳，恢复 ${sanDelta} 点理智。`, 'heal');
      if (!isMuted) audio.playChime();
    }

    // Check item gains
    if (choice.gainItem) {
      const hasItem = inventory.some((itm) => itm.id === choice.gainItem!.id);
      if (!hasItem) {
        setInventory((prev) => [...prev, choice.gainItem!]);
        addLog(`🎒 获得关键秘宝：【${choice.gainItem!.name}】`, 'action');
        if (!isMuted) audio.playChime();
      }
    }

    // Check item removal
    if (choice.removeItem && choice.requireItem) {
      setInventory((prev) => prev.filter((itm) => itm.id !== choice.requireItem));
      addLog(`🎒 顺应天道，消耗了秘宝：【${choice.requireItem}】`, 'system');
    }

    // Check clue discovery
    if (choice.discoverClue) {
      const hasClue = discoveredClues.some((clue) => clue.id === choice.discoverClue!.id);
      if (!hasClue) {
        const newClue: Clue = {
          ...choice.discoverClue!,
          discoveredAtLoop: loop
        };
        setDiscoveredClues((prev) => [...prev, newClue]);
        addLog(`📖 洞悉深渊秘辛：确认了线索【${choice.discoverClue!.title}】`, 'clue');
        if (!isMuted) audio.playChime();
      }
    }

    // Check sanity depletion
    if (nextSanity <= 0) {
      triggerGameOver('理智已尽。狂躁与怨念彻底接管了你的肉体，你已彻底成为回廊的一尊石雕。');
      return;
    }

    // Check loop mutations
    if (choice.loopDelta) {
      const nextLoop = Math.max(1, loop + choice.loopDelta);
      setLoop(nextLoop);
      addLog(`🌀 劫难交替。轮回层数演进至：${nextLoop} 层`, 'system');
    }

    // Proceed to next node
    const nextNode = STORY_NODES[choice.next] || STORY_NODES.START;
    
    // If it is terminal ending or death
    if (nextNode.isEnding) {
      addLog(`✨ 达成终焉结局：${nextNode.endingTitle || '终局'}`, 'heal');
      setEndedRuns((prev) => [...prev, `🎉 【成功脱困】 轮回 ${loop} | 结局: ${nextNode.endingTitle}`]);
      setCurrentNodeId(choice.next);
      return;
    }

    if (nextNode.isDeath) {
      triggerGameOver(nextNode.desc + ' ' + (nextNode.deathMsg || ''));
      return;
    }

    // Advance scene
    setCurrentNodeId(choice.next);
    addLog(`➡️ 推进至：${nextNode.title}`, 'action');
    
    // 15% chance to shuffle local weather environment during transitions
    if (Math.random() < 0.20 && choice.next !== 'START') {
      rollRandomEnvironment();
    }
  };

  // Puzzle validation handler
  const handleSolvePuzzle = (correctAnswer: string, successNode: string, failNode: string, dmg: number) => {
    setPuzzleError(null);
    const cleanedInput = puzzleInput.trim().toUpperCase();
    const cleanedTarget = correctAnswer.trim().toUpperCase();

    if (cleanedInput === cleanedTarget) {
      addLog('🔑 解谜完美契合！封印机关发生巨响，发出碎裂金光。', 'heal');
      if (!isMuted) audio.playChime();
      setPuzzleInput('');
      
      const nextNode = STORY_NODES[successNode] || STORY_NODES.START;
      setCurrentNodeId(successNode);
    } else {
      setPuzzleInput('');
      const appliedDmg = environment.type === 'BLIZZARD' ? Math.round(dmg * 1.5) : dmg;
      const nextSanity = Math.max(0, sanity - appliedDmg);
      setSanity(nextSanity);
      
      addLog(`❌ 解密输入码不匹配！遭遇禁咒反噬，扣除 ${appliedDmg} 点理智！`, 'damage');
      if (!isMuted) audio.playHurt();

      if (nextSanity <= 0) {
        triggerGameOver('反噬心魔过重，你的理智瞬间化解，倒在了布满蛊毒的拼音锁盘前。');
        return;
      }

      setPuzzleError(`不匹配的代码！你全身神经剧痛，脑部剧烈抽搐（损失 ${appliedDmg} 点理智）。`);
      
      // Auto routing if fully failed or immediate detour
      if (failNode) {
        setCurrentNodeId(failNode);
      }
    }
  };

  // Immediate game death handler
  const triggerGameOver = (deathText: string) => {
    setSanity(0);
    setEndedRuns((prev) => [...prev, `💀 【永眠轮回】 轮回 ${loop} 层 | 折戟于: ${currentNode.title}`]);
    addLog(`💀 极夜噩耗：你因 ${deathText} 而消逝在轮回之中...`, 'damage');
    if (!isMuted) audio.playHurt();
  };

  // Sacrificial Restart / Timeline Reboot
  const handleSacrificeRestart = () => {
    const nextLoop = loop + 1;
    setLoop(nextLoop);
    setSanity(100);
    setCurrentNodeId('START');
    rollRandomEnvironment();
    addLog(`🌀 时空献祭完成。系统重启回廊，轮回重塑为第 ${nextLoop} 层！`, 'system');
    if (!isMuted) audio.playChime();
  };

  const handleFullReset = () => {
    setSanity(100);
    setLoop(1);
    setCurrentNodeId('START');
    setInventory([]);
    setDiscoveredClues([]);
    setHistoryLogs([]);
    setEndedRuns([]);
    rollRandomEnvironment();
    addLog('🟨 全局记忆清洗：档案、宝物、轮回级数全部抹除，重掌初始命运。', 'system');
    if (!isMuted) audio.playChime();
  };

  // Lucide Dynamic Icon finder
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Key': return <Key className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Bomb': return <Bomb className={className} />;
      case 'Sword': return <Sword className={className} />;
      case 'Ticket': return <Ticket className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Compass': return <Compass className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-red-950 selection:text-red-200 relative overflow-hidden flex flex-col items-center justify-start p-4 md:p-6 lg:p-8">
      
      {/* Heavy blood ambiance overlay when sanity drops */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-10"
        style={{
          background: 'radial-gradient(circle, transparent 35%, rgba(139, 0, 0, 0.3) 100%)',
          opacity: sanity < 30 ? 1 : sanity < 60 ? 0.4 : 0.05
        }}
      />

      {/* Atmospheric Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.95)] z-20" />

      {/* Intro Overlay Card */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 selection:bg-red-900 selection:text-white"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full bg-[#0a0a0a] border border-[#2d2d2d] p-8 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative rounded-sm"
            >
              <div className="absolute top-4 right-4 bg-red-950/60 text-red-400 text-[10px] px-3 py-1 font-mono border border-red-900/40 uppercase tracking-widest">
                v1.5 SYSTEM ACTIVE
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-black border border-[#444] shadow-[0_0_15px_rgba(239,68,68,0.15)] rounded-sm">
                  <Skull className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-[0.2em] text-[#e0e0e0] font-sans uppercase">深渊回响 · 极度轮回</h1>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">THE ABYSSAL ECHOES / CYCLE OF COGNITION</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-zinc-400 leading-relaxed font-mono">
                <p>
                  你已被锁入无限流位面的核心节点——<strong className="text-red-400">【极暗救赎位面】</strong>。在这里，没有静止 of 的安宁，唯有不可忤逆的世界齿轮。
                </p>
                <div className="bg-black/80 p-4 border border-[#1a1a1a] text-[11px] rounded-sm">
                  <span className="text-red-400 font-bold block mb-2 tracking-widest uppercase">🎮 LEVEL RULES & PARAMETERS:</span>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-400">
                    <li><strong className="text-zinc-200">Survival Mutation (局域异变)</strong>：每一层轮回均随机构筑恶劣生存天煞（毒雾、极寒、血雨等），改变基本损耗系数。</li>
                    <li><strong className="text-zinc-200">Decryption Puzzle (符文封密)</strong>：关卡中搭载各种密码锁，解谜盘不正确会直接诱发高额理智狂乱，直接致死。</li>
                    <li><strong className="text-zinc-200">Sacrificial Loop (秘宝轮回)</strong>：利用特定的寻获物件来规避各种绝命机关，若不慎陷入死局，可主动实施时空献祭，获得Loop+1并重新起跑。</li>
                  </ul>
                </div>
                <p className="text-[10px] text-zinc-500 italic mt-2">
                  * 极度建议戴上耳机体验。点击搭载音频按钮会自动初始化低保真神经频率操作背景音。
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  id="enable-audio-btn"
                  onClick={() => {
                    handleEnableAudio();
                    setShowIntro(false);
                  }}
                  className="flex-1 bg-red-950/30 hover:bg-red-900 border border-red-800 hover:text-white text-red-200 font-bold py-3.5 px-6 transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-red-400 animate-pulse" /> SYNC AUDIO & START
                </button>
                <button
                  id="skip-audio-btn"
                  onClick={() => {
                    setShowIntro(false);
                  }}
                  className="bg-[#050505] hover:bg-[#111] text-zinc-500 hover:text-zinc-300 py-3.5 px-6 transition-all font-mono text-xs uppercase tracking-wider border border-[#222] flex items-center justify-center rounded-sm cursor-pointer"
                >
                  SILENT INITIATION
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Layout Container */}
      <div className="max-w-6xl w-full flex flex-col gap-6 relative z-30 flex-1">
        
        {/* Top Header Controls bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-[#222] p-6 rounded-sm relative overflow-hidden shadow-lg">
          {/* Diagnostic top edge indicator */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-red-600 via-[#111] to-cyan-500" />
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111] border border-[#333] relative rounded-sm">
              <div className="absolute inset-0 bg-[#ff2222]/10 animate-pulse" />
              <Skull className="w-6 h-6 text-red-500 relative z-10" />
            </div>
            <div>
              <h1 className="text-sm uppercase tracking-[0.25em] text-[#efefe0] font-bold">深 渊 回 响 // ABYSSAL.OS</h1>
              <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                SECURE FEED: EX-9921-Ω // SYSTEM STABLE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="audio-pulse-toggle"
              onClick={isAudioInitialized ? handleToggleMute : handleEnableAudio}
              className={`px-4 py-2 text-[10px] uppercase tracking-wider border transition-all rounded-sm cursor-pointer ${
                isMuted 
                  ? 'bg-transparent border-[#222] text-zinc-500 hover:text-zinc-300 hover:bg-[#111]' 
                  : 'bg-red-950/20 border-red-500/50 text-red-200 hover:bg-gradient-to-r hover:from-red-950/30'
              }`}
              title={isMuted ? "开启沉浸声效" : "静音"}
            >
              {isMuted ? "AUDIO FEED: STATIC" : "AUDIO FEED: LIVE"}
            </button>
            <button
              id="sacrifice-reboot-btn"
              onClick={handleSacrificeRestart}
              className="px-4 py-2 border border-red-900 bg-[#150a0a] hover:bg-red-950 hover:border-red-500 text-red-400 text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 font-bold rounded-sm cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> REBOOT TIMELINE (LOOP +1)
            </button>
            <button
              id="wipe-data-btn"
              onClick={handleFullReset}
              className="px-4 py-2 border border-[#222] bg-transparent hover:bg-[#111] text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-wider transition-all rounded-sm cursor-pointer"
            >
              清洗记忆 WIPE
            </button>
          </div>
        </header>

        {/* HTML Game Quick Export Banner */}
        <section className="bg-[#080808] border border-[#ff3333]/25 p-5 relative rounded-sm overflow-hidden shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 bg-red-950/25 text-[8px] font-mono text-red-550/60 px-2 py-0.5 border-l border-b border-[#ff3333]/25 uppercase tracking-widest">
            File Export Assistant // 文件导出助手
          </div>
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-950/20 border border-[#ff4444]/45 text-red-400 rounded-sm shrink-0 mt-0.5">
              <FileCode className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-red-200 flex items-center gap-1.5 font-mono">
                💾 找不到文件浏览器？点击一键下载“单文件 HTML 独立离线版”！
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed font-mono max-w-2xl">
                我们在游戏内特别内置了导出工具。只需点击右侧按钮，即可将包含完整声效、动态排版、天罡煞象异变及解密盘等全套模块的<strong>「独立 HTML 游戏包」</strong>直接保存到本地。你可以发给朋友或自己离线娱乐！配合键盘 YIN、RBY 开启极致惊悚冒险！
              </p>
              {exportError && (
                <div className="mt-2 text-[10px] text-red-400 font-mono italic">
                  ⚠️ {exportError}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
            <button
              id="export-game-download-btn"
              onClick={handleDownloadHTML}
              disabled={isExporting}
              className="flex-grow md:flex-none px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/80 hover:border-red-500 text-red-200 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? '导出中...' : '一键下载独立版 HTML'}
            </button>
            <button
              id="export-game-copy-btn"
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="flex-grow md:flex-none px-4 py-2.5 bg-zinc-950 hover:bg-[#111] border border-[#333] hover:border-[#555] text-zinc-400 hover:text-zinc-200 font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded-sm cursor-pointer disabled:opacity-50"
              title="点击此键复制全部网页源码到剪切板，新建文本粘贴为 .html 即可使用"
            >
              {copySuccess ? '复制成功！' : '复制代码内容'}
            </button>
          </div>
        </section>

        {/* Dashboard Grid split into Left Sidebar, Center Screen, Right Lore */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Player Status & Current Environmental state */}
          <section className="lg:col-span-4 flex flex-col gap-6">

            {/* Sanity Bar and Loop status */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 relative overflow-hidden flex flex-col gap-4 rounded-sm">
              <div className="absolute top-2 right-3 text-[10px] text-zinc-700 font-mono">REALITY_LINK</div>
              
              <div>
                <span className="text-[10px] text-zinc-505 uppercase tracking-widest block mb-2 font-bold select-none text-zinc-500">
                  🧠 COGNITIVE MATRIX / 理智阀
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-zinc-500 font-mono">STABILITY INDEX</span>
                  <span className={`text-4xl font-black font-mono tracking-tight ${sanity <= 30 ? 'text-red-500 animate-pulse' : 'text-[#efefe0]'}`}>
                    {sanity}%
                  </span>
                </div>
              </div>

              {/* Segmented health visualization */}
              <div className="h-6 bg-[#030303] border border-[#1d1d1d] p-1 flex gap-0.5 relative overflow-hidden">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const threshold = (idx + 1) * 5;
                  const isActive = sanity >= threshold;
                  const isLow = sanity <= 30;
                  return (
                    <div 
                      key={idx}
                      className={`flex-1 transition-all duration-300 ${
                        isActive 
                          ? isLow 
                            ? 'bg-red-600 shadow-[0_0_4px_#ef4444]' 
                            : 'bg-red-500'
                          : 'bg-zinc-950'
                      }`}
                    />
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-450 leading-relaxed font-mono">
                {sanity <= 30 
                  ? '⚠️ [CRITICAL] 脑叶正在沸腾。来自无端幻视的剧烈轰鸣正在撕扯现实，你理智的核心锚点仅存微弱防线。' 
                  : sanity <= 60 
                  ? '⚡ [ALERT] 视觉波段出现高频抖动。在冥冥中的窥视中，你逐渐开始接受这里的扭曲物理规律。' 
                  : '🟢 [STABLE] 系统防火墙正在生效。你仍坚信自己是人类，努力拒绝病院同化。'}
              </p>

              <div className="pt-4 border-t border-[#1c1c1c] flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-500">ACTIVE TIMELINE CONTEXT</span>
                <span className="text-[#00f0ff] font-bold uppercase tracking-wider bg-zinc-950 border border-[#222] px-2 py-0.5">
                  CYCLE_0{loop}
                </span>
              </div>
            </div>

            {/* active environment mod card */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 relative flex flex-col gap-3 rounded-sm">
              <div className="absolute top-2 right-3 text-[10px] text-red-500/80 font-mono uppercase tracking-wider">
                lvl {environment.dangerLevel} danger
              </div>

              <span className="text-[10px] text-zinc-505 uppercase tracking-widest block font-bold text-zinc-500">
                🌍 SURVIVAL SHADOW / 生存煞象
              </span>
              
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#efeff0]">
                  {environment.name}
                </h3>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                {environment.description}
              </p>

              <div className="bg-black border border-[#1d1d1d] p-4 text-[11px] font-mono text-zinc-400 flex items-start gap-2.5 mt-1 rounded-sm">
                <AlertOctagon className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <span className="text-red-400 font-bold block mb-1 uppercase text-[10px] tracking-wider font-sans">
                    天罡惩罚法则 // LOCAL RULE:
                  </span>
                  {environment.effectText}
                </div>
              </div>
            </div>

            {/* Backpack / Item slots */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col gap-4 rounded-sm">
              <span className="text-[10px] text-zinc-505 uppercase tracking-widest block font-bold text-zinc-500">
                🎒 PACK GRID / 灵能搜罗包裹 ({inventory.length} / 5)
              </span>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const item = inventory[index];
                  return (
                    <div 
                      key={index} 
                      className={`aspect-square border flex items-center justify-center relative transition-all group rounded-none select-none ${
                        item 
                          ? item.rarity === 'cursed' 
                            ? 'bg-purple-950/20 border-purple-800/60 shadow-[0_0_8px_rgba(168,85,247,0.15)]' 
                            : item.rarity === 'rare' 
                            ? 'bg-amber-950/20 border-amber-800/60 shadow-[0_0_8px_rgba(245,158,11,0.15)]' 
                            : 'bg-zinc-950 border-[#444]'
                          : 'bg-zinc-950/20 border-[#1d1d1d] border-dashed text-zinc-800'
                      }`}
                      title={item ? `${item.name}: ${item.description}` : '空置槽位'}
                    >
                      {item ? (
                        <div className="p-1">
                          {renderIcon(item.icon, "w-5 h-5 text-zinc-200")}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-800">Ø</span>
                      )}
                      
                      {item && (
                        <span className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${
                          item.rarity === 'cursed' ? 'bg-purple-500' : item.rarity === 'rare' ? 'bg-amber-500' : 'bg-zinc-400'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {inventory.length > 0 ? (
                <div className="flex flex-col gap-2 bg-black border border-[#1a1a1a] p-3 rounded-sm">
                  <span className="text-[9px] text-[#ff4444] uppercase tracking-wider font-bold">包裹搭载物档案:</span>
                  <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
                    {inventory.map((itm) => (
                      <div key={itm.id} className="text-[11px] font-mono leading-relaxed border-b border-[#111] pb-2 last:border-b-0 last:pb-0">
                        <strong className={itm.rarity === 'cursed' ? 'text-purple-400' : itm.rarity === 'rare' ? 'text-amber-400' : 'text-zinc-200'}>
                          【{itm.name}】
                        </strong>
                        <p className="text-zinc-400 text-[10px] mt-0.5">{itm.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center text-[10px] text-zinc-600 italic font-mono border border-dashed border-[#1d1d1d] bg-black/20 rounded-sm">
                  PACK EMPTY // 等待奇遇拾取
                </div>
              )}
            </div>

          </section>

          {/* CENTER COLUMN: Main story log / choices / mini puzzle screen */}
          <main className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Ambient whispers bar */}
            <div className="bg-[#0a0a0a] border border-[#222] p-5 flex items-center gap-3 relative overflow-hidden rounded-sm">
              <div className="absolute top-0 left-0 w-[2.5px] h-full bg-red-600" />
              <span className="text-[9px] bg-red-950/50 border border-red-900/60 text-red-400 font-bold px-2 py-0.5 rounded-none uppercase font-mono tracking-wider shrink-0 select-none">
                👁️ ECHOPLEX FEED // 阴影低语
              </span>
              <p className="text-xs italic leading-relaxed text-zinc-300 font-serif tracking-wide">
                {sanity <= 30 
                  ? '「嘻嘻。听到脑壳融化的乐声了吗？血在沸腾……」' 
                  : currentNodeId === 'START' 
                  ? '「你逃不出这家病院的，他们都在看着你呢……」' 
                  : `「每经历一次轮回，你就越接近绝望的真因……」`}
              </p>
            </div>

            {/* Main Narrative Card wrapper */}
            <div className="bg-[#0a0a0a] border border-[#222] p-8 backdrop-blur-md flex flex-col gap-6 min-h-[420px] relative overflow-hidden shadow-xl rounded-sm">
              
              <div className="flex items-center justify-between border-b border-[#1d1d1d] pb-4">
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider flex items-center gap-1.5 uppercase font-bold">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" /> INSTANCE CORE // {currentNode.title}
                </span>
                {currentNode.atmosphere && (
                  <span className="text-[9px] bg-red-950/20 border border-red-900/40 text-red-400 font-mono px-2 py-0.5 rounded-none">
                    ⚠️ QUANTUM DISTORTION
                  </span>
                )}
              </div>

              {/* Dynamic scroll text area */}
              <div className="flex-1 select-text">
                <div onClick={forceSkipTypewriter} className="cursor-pointer group">
                  <p className="text-zinc-200 leading-relaxed font-serif text-sm md:text-base whitespace-pre-wrap tracking-wide transition-colors group-hover:text-zinc-100">
                    {displayedText}
                    {!isTypingComplete && (
                      <span className="inline-block w-1.5 h-4 bg-red-500 ml-1 animate-pulse" />
                    )}
                  </p>
                  
                  {!isTypingComplete && (
                    <div className="mt-4 text-[9px] text-[#444] font-mono tracking-widest uppercase select-none">
                      💡 SCANNING FEED... CLICK TO SKIP TYPEWRITER TIMULATION
                    </div>
                  )}
                </div>

                {/* Extra ambient descriptor shown after typing completes */}
                {isTypingComplete && currentNode.atmosphere && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-black border border-[#1c1c1c] text-xs text-zinc-400 leading-relaxed font-mono border-l-2 border-l-red-500 rounded-none"
                  >
                    {currentNode.atmosphere}
                  </motion.div>
                )}
              </div>

              {/* PUZZLE SOLVER SECTION */}
              {isTypingComplete && currentNode.puzzle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black border border-[#222] p-5 mt-4 rounded-none"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-red-500 animate-pulse" />
                    <h4 className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                      🧩 COGNITIVE KEYPAD / 谜题验证盘
                    </h4>
                  </div>
                  
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed mb-4 bg-[#0a0a0a] p-4 border border-[#1a1a1a] rounded-none">
                    {currentNode.puzzle.question}
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        id="puzzle-val"
                        type="text"
                        value={puzzleInput}
                        onChange={(e) => setPuzzleInput(e.target.value)}
                        placeholder="键入解密大写拼音或数值序列..."
                        className="flex-1 bg-black border border-[#2d2d2d] px-4 py-3.5 text-xs font-mono text-center tracking-[0.2em] uppercase focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white rounded-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSolvePuzzle(
                              currentNode.puzzle!.correctAnswer,
                              currentNode.puzzle!.onSuccessNode,
                              currentNode.puzzle!.onFailNode,
                              currentNode.puzzle!.failSanityDamage
                            );
                          }
                        }}
                      />
                      <button
                        id="submit-puzzle-btn"
                        onClick={() => handleSolvePuzzle(
                          currentNode.puzzle!.correctAnswer,
                          currentNode.puzzle!.onSuccessNode,
                          currentNode.puzzle!.onFailNode,
                          currentNode.puzzle!.failSanityDamage
                        )}
                        className="bg-red-950/40 hover:bg-red-900 border border-red-500/50 hover:text-white text-red-200 font-bold px-5 rounded-none text-xs font-mono transition-all cursor-pointer uppercase tracking-wider"
                      >
                        DECRYPT
                      </button>
                    </div>

                    {puzzleError && (
                      <p className="text-[11px] text-red-400 font-mono italic leading-relaxed">
                        ⚠️ {puzzleError}
                      </p>
                    )}

                    <div className="border-t border-[#121212] pt-3 text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> 
                      <span>HINT PARAMETER: {currentNode.puzzle.hint}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CHOICE PANEL BUTTONS */}
              {isTypingComplete && !currentNode.puzzle && (
                <div className="flex flex-col gap-3 mt-4">
                  {currentNode.choices && currentNode.choices.length > 0 ? (
                    currentNode.choices.map((ch, idx) => {
                      const hasRequiredItem = ch.requireItem ? inventory.some((itm) => itm.id === ch.requireItem) : true;
                      const hasRequiredSan = ch.requireSan ? sanity >= ch.requireSan : true;
                      const isOptionDisabled = !hasRequiredItem || !hasRequiredSan;

                      return (
                        <button
                          key={idx}
                          id={`choice-btn-${idx}`}
                          disabled={isOptionDisabled}
                          onClick={() => executeChoice(ch)}
                          className={`w-full text-left p-5 border transition-all duration-200 relative flex items-start gap-4 select-none rounded-none ${
                            isOptionDisabled 
                              ? 'bg-black/40 border-[#1a1a1a] text-zinc-600 cursor-not-allowed opacity-50' 
                              : 'bg-[#030303] border-[#222] hover:border-red-500/80 hover:bg-black text-zinc-200 hover:text-zinc-50'
                          }`}
                        >
                          <span className="p-1 px-1.5 bg-black border border-[#222] font-mono text-[9px] text-zinc-500 shrink-0 select-none rounded-none">
                            0{idx + 1}
                          </span>
                          
                          <div className="flex-1">
                            <span className="font-mono leading-relaxed block pr-8 tracking-wide">
                              {ch.text}
                            </span>
                            
                            {/* Costs / Requirements modifiers badges */}
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap text-[10px] font-mono">
                              {ch.sanDelta && ch.sanDelta !== 0 && (
                                <span className={ch.sanDelta < 0 ? 'text-red-400 bg-red-950/20 border border-red-900/30 px-1.5 py-0.5' : 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5'}>
                                  理智 SAN: {ch.sanDelta > 0 ? `+${ch.sanDelta}` : ch.sanDelta}
                                </span>
                              )}
                              
                              {ch.requireItem && (
                                <span className={`flex items-center gap-1 px-1.5 py-0.5 border ${hasRequiredItem ? 'text-amber-400 bg-amber-950/20 border-amber-900/30' : 'text-red-400 bg-red-950/30 border-red-800'}`}>
                                  🔑 秘宝: {ch.requireItem} {!hasRequiredItem && '(未持有)'}
                                </span>
                              )}

                              {ch.requireSan && (
                                <span className={`flex items-center gap-1 px-1.5 py-0.5 border ${hasRequiredSan ? 'text-zinc-500 bg-zinc-950 border-[#1d1d1d]' : 'text-red-500 bg-red-950/10 border-red-800'}`}>
                                  🧠 理智需求 ≥ {ch.requireSan} {!hasRequiredSan && `(仅 ${sanity})`}
                                </span>
                              )}

                              {ch.gainItem && (
                                <span className="text-amber-400 bg-amber-950/20 border border-amber-900/30 px-1.5 py-0.5">
                                  🎁 收获物: {ch.gainItem.name}
                                </span>
                              )}

                              {ch.discoverClue && (
                                <span className="text-cyan-400 bg-cyan-950/20 border border-cyan-900/30 px-1.5 py-0.5">
                                  🔍 领悟线索: {ch.discoverClue.title}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-zinc-655 shrink-0 self-center absolute right-3" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        id="unbound-reboot-btn"
                        onClick={handleSacrificeRestart}
                        className="w-full text-center p-4 bg-red-950/20 hover:bg-red-900 border border-red-800/85 hover:text-white text-red-300 font-bold rounded-none shadow-lg transition-all font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCcw className="w-4 h-4" /> TIMELINE CRASHED // 进行时空重启
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </main>

          {/* RIGHT COLUMN: Clue Codex and Run history */}
          <section className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Clue Journal */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col gap-4 rounded-sm">
              <span className="text-[10px] text-zinc-505 uppercase tracking-widest block font-bold text-zinc-500">
                📖 CLUE JOURNAL / 已持深渊法章 ({discoveredClues.length})
              </span>
              
              {discoveredClues.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-700 italic font-mono border border-dashed border-[#222] bg-[#030303] rounded-sm select-none">
                  [NO PATH INSIGHT RECORDED]
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
                  {discoveredClues.map((clue) => (
                    <div key={clue.id} className="bg-black border border-[#1d1d1d] p-3.5 relative rounded-none flex flex-col gap-1.5 text-zinc-350">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-cyan-400"># {clue.title}</span>
                        <span className="text-[8px] font-mono text-zinc-600 bg-zinc-950 px-1 py-0.5 border border-[#111]">
                          CYCLE:0{clue.discoveredAtLoop}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal font-mono">
                        {clue.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run logs timeline */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col gap-4 rounded-sm">
              <span className="text-[10px] text-zinc-505 uppercase tracking-widest block font-bold text-zinc-500">
                🕒 SYSTEM LOGS / 异元灵力波 log ({historyLogs.length})
              </span>

              <div className="max-h-[160px] overflow-y-auto pr-1 flex flex-col gap-1.5 font-mono text-[10px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent bg-black/50 border border-[#1c1c1c] p-3 rounded-none text-zinc-400">
                {historyLogs.length === 0 ? (
                  <div className="text-zinc-700 italic uppercase">SYSTEM DISCONNECTED</div>
                ) : (
                  historyLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 items-start text-zinc-450 border-b border-[#121212] pb-1.5 last:border-b-0 last:pb-0">
                      <span className="text-zinc-600 shrink-0 text-[9px] font-bold">[{log.timestamp}]</span>
                      <span className={
                        log.type === 'damage' ? 'text-red-500' :
                        log.type === 'heal' ? 'text-emerald-400 font-bold' :
                        log.type === 'clue' ? 'text-cyan-400' :
                        log.type === 'system' ? 'text-amber-500' :
                        'text-zinc-350'
                      }>
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ancestor Ending Records */}
            <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col gap-4 rounded-sm">
              <span className="text-[10px] text-zinc-505 uppercase tracking-widest block font-bold text-zinc-500">
                🏆 ANCESTRAL GRAVES / 往世骸骨
              </span>
              
              {endedRuns.length === 0 ? (
                <div className="py-4 text-center text-[10px] text-zinc-700 italic font-mono bg-black/40 border border-dashed border-[#1c1c1c] select-none rounded-none">
                  INIT STATE: TIMELINE FIRSTBORN
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 font-mono text-[9px] text-zinc-400 max-h-[130px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
                  {endedRuns.map((rec, index) => (
                    <div key={index} className="bg-black p-2 rounded-none border border-[#1b1b1b] flex items-center gap-2 text-zinc-405">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>

        </div>

        {/* Global Footer info bar */}
        <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1d1d1d] pt-6 pb-12 font-mono text-[10px] text-zinc-600 select-none">
          <div>
            👁️ ABYSSAL REITERATION SYSTEM // COGNITIVE SHIELDING: EXC-VII
          </div>
          <div className="flex items-center gap-4">
            <span>SANITY SCANNING: HIGHLY_SENSITIVE</span>
            <span>SYSTEM DATE: 2026-06-13</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
