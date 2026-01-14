import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  MessageCircle, 
  ChevronLeft, 
  CheckCircle2, 
  Timer, 
  Dumbbell, 
  Zap, 
  ArrowRight, 
  User, 
  Bot, 
  Activity,
  ChevronRight
} from 'lucide-react';

/**
 * 초기 운동 루틴 데이터 (Initial Routine Data)
 */
const INITIAL_ROUTINE = [
  { id: 'v1', name: '뉴텍 토쳐 체스트 프레스', vendor: 'NewTech', setup: '의자 3단계 / 핀 2번', weight: '40', reps: '12', sets: 4, tip: '어제 어깨 운동을 고려해 팔꿈치를 살짝 낮게 유지하세요.' },
  { id: 'v2', name: '테크노짐 펙덱 플라이', vendor: 'Technogym', setup: '등받이 5단계', weight: '35', reps: '15', sets: 3, tip: '가슴을 열어주되 어깨 통증 시 범위를 80%로 제한하세요.' },
  { id: 'v3', name: '어시스트 딥스 머신', vendor: 'Lexco', setup: '무릎 패드 7단계', weight: '25', reps: '10', sets: 3, tip: '상체를 숙여 가슴 하부에 집중하세요.' }
];

// --- [Solution] Define sub-components outside App to prevent focus loss during re-renders ---

/**
 * Bottom Navigation Bar (GNB)
 */
const GNB = ({ activeTab, setActiveTab, setView }) => (
  <nav className="absolute bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 px-10 py-5 flex justify-between items-center z-50">
    <button 
      onClick={() => { setActiveTab('chat'); setView('chat'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'chat' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <Bot size={22} />
      <span className="text-[10px] font-bold tracking-tight">AI 추천</span>
    </button>
    <button 
      onClick={() => { setActiveTab('guide'); setView('guide'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'guide' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <Activity size={22} />
      <span className="text-[10px] font-bold tracking-tight">세트 진행</span>
    </button>
    <button 
      onClick={() => { setActiveTab('profile'); setView('profile'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <User size={22} />
      <span className="text-[10px] font-bold tracking-tight">내 정보</span>
    </button>
  </nav>
);

/**
 * AI Chat Interface (ChatView)
 */
const ChatView = ({ messages, inputValue, setInputValue, handleSendMessage, setView, setActiveTab, scrollRef }) => (
  <div className="flex flex-col h-full bg-black">
    <header className="p-6 pt-12 border-b border-zinc-800 flex items-center gap-3 bg-black/50 sticky top-0 z-10">
      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg italic font-sans">V</div>
      <div>
        <h1 className="font-bold text-white tracking-tight text-left">Vibe PT AI Coach</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-left">Personal Training Intelligence</p>
      </div>
    </header>
    
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
            m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-200 border border-zinc-800 text-left'
          }`}>
            {m.content}
            {m.hasRoutine && (
              <div className="mt-4 bg-zinc-800/50 rounded-xl p-4 border border-yellow-400/30">
                <div className="flex justify-between items-center mb-3 text-yellow-400 font-bold text-xs tracking-tighter uppercase">
                  🔥 VIBE PT 추천 루틴
                </div>
                <button 
                  onClick={() => { setView('guide'); setActiveTab('guide'); }}
                  className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Play size={14} fill="black" /> 루틴 시작하기
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent flex gap-2">
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="오늘의 운동 바이브를 말해주세요..."
        className="flex-1 bg-zinc-800 border-none rounded-full px-5 py-3 text-sm text-white focus:ring-1 focus:ring-yellow-400 outline-none placeholder:text-zinc-600"
      />
      <button onClick={handleSendMessage} className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-400/10 active:scale-90 transition-transform">
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

/**
 * 화면 2: 운동 가이드 뷰
 */
const GuideView = ({ routine, currentStep, currentSet, updateRoutineDetail, nextSet }) => {
  const ex = routine[currentStep];
  const progress = ((currentStep + 1) / routine.length) * 100;

  return (
    <div className="flex flex-col h-full bg-black text-white text-left">
      <header className="p-6 pt-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 h-1 bg-zinc-800 rounded-full mr-4">
            <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-yellow-400 text-xs font-black tracking-widest">{currentStep + 1} / {routine.length}</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block">{ex.vendor}</span>
        <h2 className="text-2xl font-bold mt-1 leading-tight">{ex.name}</h2>
      </header>

      <main className="flex-1 px-6 space-y-5 pb-44 overflow-y-auto">
        <div className="aspect-video bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 relative overflow-hidden">
           <Dumbbell className="text-zinc-800" size={48} />
           <p className="text-[10px] text-zinc-600 mt-2 font-mono tracking-widest uppercase">VibeStation {ex.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">세팅 정보</span>
            <input 
              type="text"
              value={ex.setup}
              onChange={(e) => updateRoutineDetail(currentStep, 'setup', e.target.value)}
              className="w-full bg-transparent border-none text-sm font-bold text-white outline-none p-0"
            />
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-yellow-400/50">
            <span className="block text-[10px] text-yellow-400 mb-1 font-bold uppercase tracking-tight">현재 세트</span>
            <span className="text-xl font-black text-yellow-400 leading-none">{currentSet} <span className="text-[10px] text-yellow-400/50 ml-1">/ {ex.sets}</span></span>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">중량 (kg)</span>
            <input 
              type="number"
              value={ex.weight}
              onChange={(e) => updateRoutineDetail(currentStep, 'weight', e.target.value)}
              className="w-full bg-transparent border-none text-lg font-bold text-white outline-none p-0"
            />
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">목표 횟수</span>
            <input 
              type="number"
              value={ex.reps}
              onChange={(e) => updateRoutineDetail(currentStep, 'reps', e.target.value)}
              className="w-full bg-transparent border-none text-lg font-bold text-white outline-none p-0"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex gap-3">
          <Zap size={16} className="text-yellow-400 shrink-0" fill="currentColor" />
          <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold">AI 코칭:</span> {ex.tip}</p>
        </div>
      </main>

      <footer className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 text-xl font-mono font-bold text-white">
          <Timer size={20} className="text-yellow-400" /> 01:24
        </div>
        <button 
          onClick={nextSet}
          className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl text-lg active:scale-95 transition-transform shadow-lg shadow-yellow-400/10"
        >
          SET COMPLETE
        </button>
      </footer>
    </div>
  );
};

/**
 * Summary Screen (SummaryView)
 */
const SummaryView = ({ resetApp }) => (
  <div className="h-full flex flex-col items-center justify-center p-10 text-white text-center">
    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-yellow-400/20">
      <CheckCircle2 size={40} color="black" />
    </div>
    <h2 className="text-3xl font-bold mb-2 tracking-tighter italic uppercase">VIBE COMPLETE!</h2>
    <p className="text-zinc-500 text-sm mb-10 leading-relaxed">오늘의 훌륭한 성장을 기록했습니다.<br/>내일도 바이브 있게 만나요!</p>
    <button 
      onClick={resetApp}
      className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl active:scale-95 transition-transform shadow-lg shadow-yellow-400/20"
    >
      다시 시작하기
    </button>
  </div>
);

/**
 * Main App Component
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [view, setView] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 바이브 PT AI 코치입니다. 오늘 어떤 운동을 도와드릴까요? (예: 어제 하체 했고 오늘 등)' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [routine, setRoutine] = useState(INITIAL_ROUTINE);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const scrollRef = useRef(null);

  // Auto-scroll chat on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle routine updates
  const updateRoutineDetail = (index, field, value) => {
    const newRoutine = [...routine];
    newRoutine[index][field] = value;
    setRoutine(newRoutine);
  };

  // Handle chat messaging
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI behavior
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "어제 컨디션을 완벽히 분석했습니다. 오늘의 최적 루틴을 준비했어요.", 
        hasRoutine: true 
      }]);
    }, 800);
  };

  // Move to next set or exercise
  const nextSet = () => {
    const exercise = routine[currentStep];
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else if (currentStep < routine.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentSet(1);
    } else {
      setView('summary');
    }
  };

  // Reset app state
  const resetApp = () => {
    setView('chat');
    setActiveTab('chat');
    setCurrentStep(0);
    setCurrentSet(1);
  };

  const ProfileView = () => (
  <div className="flex flex-col h-full bg-black text-white p-6 pt-16 text-left">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg shadow-yellow-400/10">
        <User size={32} className="text-yellow-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Vibe Challenger</h2>
        <p className="text-xs text-zinc-500">바이브 PT 프리미엄 멤버 | 24회차 완료</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-8">
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <span className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold tracking-tight text-left">이번 주 운동</span>
        <span className="text-lg font-bold">4회 완료</span>
      </div>
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <span className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold tracking-tight text-left">총 활동 에너지</span>
        <span className="text-lg font-bold text-yellow-400">12,400 kcal</span>
      </div>
    </div>

    <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest text-left">설정 및 관리</h3>
    <div className="space-y-2">
      {['운동 이력 데이터 분석', '지점별 기구 리스트', 'AI 목소리 및 테마 설정', '로그아웃'].map((item, i) => (
        <div key={i} className="bg-zinc-900/50 p-4 rounded-xl flex justify-between items-center border border-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors">
          <span className="text-sm">{item}</span>
          <ChevronRight size={16} className="text-zinc-700" />
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="w-full max-w-md mx-auto h-[800px] border-[10px] border-zinc-800 rounded-[3.5rem] overflow-hidden shadow-2xl bg-black relative font-sans">
      {/* Dynamic Island Style Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-50 flex items-end justify-center pb-1">
        <div className="w-10 h-1 bg-zinc-800 rounded-full mb-1"></div>
      </div>

      <div className="h-full">
        {activeTab === 'chat' && view === 'chat' && (
          <ChatView 
            messages={messages} 
            inputValue={inputValue} 
            setInputValue={setInputValue} 
            handleSendMessage={handleSendMessage}
            setView={setView}
            setActiveTab={setActiveTab}
            scrollRef={scrollRef}
          />
        )}
        {activeTab === 'guide' && view === 'guide' && (
          <GuideView 
            routine={routine}
            currentStep={currentStep}
            currentSet={currentSet}
            updateRoutineDetail={updateRoutineDetail}
            nextSet={nextSet}
          />
        )}
        {activeTab === 'profile' && (
          <div className="p-10 text-white pt-20 text-left h-full">
            <h2 className="text-xl font-bold mb-4">내 정보</h2>
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6">
              <p className="text-zinc-400 text-sm mb-2 uppercase font-bold tracking-widest">누적 운동 시간</p>
              <p className="text-3xl font-black italic text-yellow-400">1,240m</p>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">사용자의 운동 이력과 맞춤 설정을 준비 중입니다.</p>
          </div>
        )}
        {view === 'summary' && <SummaryView resetApp={resetApp} />}
      </div>

      <GNB activeTab={activeTab} setActiveTab={setActiveTab} setView={setView} />
    </div>
  );
}
