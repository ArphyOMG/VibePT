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
  ChevronRight,
  ListFilter,
  ArrowRightCircle,
  Info
} from 'lucide-react';

// --- 초기 데이터 (AI가 생성할 기본 루틴 템플릿) ---
const INITIAL_ROUTINE = [
  { id: 'v1', name: 'NewTech Torture Chest Press', vendor: 'NewTech', setup: '의자 3단계 / 핀 2번', weight: '40', reps: '12', sets: 4, tip: '어제 어깨 운동을 고려해 팔꿈치를 살짝 낮게 유지하세요.' },
  { id: 'v2', name: 'Technogym Pec Deck Fly', vendor: 'Technogym', setup: '등받이 5단계', weight: '35', reps: '15', sets: 3, tip: '가슴을 열어주되 어깨 통증 시 범위를 80%로 제한하세요.' },
  { id: 'v3', name: 'Assist Dips Machine', vendor: 'Lexco', setup: '무릎 패드 7단계', weight: '25', reps: '10', sets: 3, tip: '상체를 숙여 가슴 하부에 집중하세요.' }
];

// --- 하단 네비게이션 (GNB) ---
const GNB = ({ activeTab, setActiveTab, setView }) => (
  <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 px-10 py-5 flex justify-between items-center z-50">
    <button 
      onClick={() => { setActiveTab('chat'); setView('chat'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'chat' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <Bot size={22} />
      <span className="text-[10px] font-bold tracking-tight text-center">AI 추천</span>
    </button>
    <button 
      onClick={() => { setActiveTab('guide'); setView('routine'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'guide' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <Activity size={22} />
      <span className="text-[10px] font-bold tracking-tight text-center">세트 진행</span>
    </button>
    <button 
      onClick={() => { setActiveTab('profile'); setView('profile'); }}
      className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <User size={22} />
      <span className="text-[10px] font-bold tracking-tight text-center">내 정보</span>
    </button>
  </div>
);

/**
 * 화면 1: 채팅 뷰 (루틴 리스트 인라인 표시 추가)
 */
const ChatView = ({ messages, inputValue, setInputValue, handleSendMessage, setView, setActiveTab, scrollRef, startSpecificRoutine }) => (
  <div className="flex flex-col h-full bg-black">
    <header className="p-6 pt-12 border-b border-zinc-800 flex items-center gap-3 bg-black/50 sticky top-0 z-10">
      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg italic">V</div>
      <div className="text-left">
        <h1 className="font-bold text-white tracking-tight">Vibe PT AI Coach</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Personal Training Intelligence</p>
      </div>
    </header>
    
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
            m.role === 'user' ? 'bg-zinc-800 text-white text-left' : 'bg-zinc-900 text-zinc-200 border border-zinc-800 text-left'
          }`}>
            {m.content}
            
            {/* AI 답변 내 루틴 리스트 표시 섹션 */}
            {m.routineData && (
              <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Recommended Routine</span>
                </div>
                
                <div className="space-y-2">
                  {m.routineData.map((ex, idx) => (
                    <div key={idx} className="bg-black/40 border border-zinc-800/50 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-xs text-white truncate">{ex.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{ex.sets} Sets • {ex.weight}kg • {ex.reps} Reps</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => startSpecificRoutine(m.routineData)}
                  className="w-full mt-4 bg-yellow-400 text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-400/5"
                >
                  루틴 시작하기 <Play size={14} fill="black" />
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
      <button onClick={handleSendMessage} className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-400/10 active:scale-95 transition-transform">
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

/**
 * 화면 1.5: 추천 운동 목록 뷰 (RoutineView)
 */
const RoutineView = ({ routine, setView }) => (
  <div className="flex flex-col h-full bg-black text-white p-6 pt-16 text-left">
    <div className="flex items-center gap-3 mb-6">
      <ListFilter className="text-yellow-400" size={24} />
      <h2 className="text-xl font-bold tracking-tight text-left">오늘의 확정 루틴</h2>
    </div>
    
    <div className="flex-1 overflow-y-auto space-y-3 pb-40">
      {routine.map((ex, i) => (
        <div key={ex.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-yellow-400 font-bold border border-zinc-700">
            {i + 1}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-sm text-white">{ex.name}</h3>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{ex.vendor} | {ex.sets}세트</p>
          </div>
          <ChevronRight size={16} className="text-zinc-700" />
        </div>
      ))}
    </div>

    <div className="absolute bottom-24 left-0 right-0 px-6">
      <button 
        onClick={() => setView('guide')}
        className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl text-lg shadow-xl shadow-yellow-400/10 active:scale-95 transition-transform"
      >
        트레이닝 시작
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
        <div className="flex justify-between items-center mb-6 text-left">
          <div className="flex-1 h-1 bg-zinc-800 rounded-full mr-4">
            <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-yellow-400 text-xs font-black tracking-widest">{currentStep + 1} / {routine.length}</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block text-left">{ex.vendor}</span>
        <h2 className="text-2xl font-bold mt-1 leading-tight text-left">{ex.name}</h2>
      </header>

      <main className="flex-1 px-6 space-y-5 pb-44 overflow-y-auto">
        <div className="aspect-video bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 relative overflow-hidden">
           <Dumbbell className="text-zinc-800" size={48} />
           <p className="text-[10px] text-zinc-600 mt-2 font-mono tracking-widest uppercase text-center w-full">VibeStation {ex.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-yellow-400/50 transition-colors">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">세팅 정보</span>
            <input 
              type="text"
              value={ex.setup}
              onChange={(e) => updateRoutineDetail(currentStep, 'setup', e.target.value)}
              className="w-full bg-transparent border-none text-sm font-bold text-white outline-none p-0 text-left"
            />
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-yellow-400/50">
            <span className="block text-[10px] text-yellow-400 mb-1 font-bold uppercase tracking-tight">현재 세트</span>
            <span className="text-xl font-black text-yellow-400 leading-none">{currentSet} <span className="text-[10px] text-yellow-400/50 ml-1">/ {ex.sets}</span></span>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-yellow-400/50 transition-colors text-left">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">중량 (kg)</span>
            <input 
              type="number"
              value={ex.weight}
              onChange={(e) => updateRoutineDetail(currentStep, 'weight', e.target.value)}
              className="w-full bg-transparent border-none text-lg font-bold text-white outline-none p-0 text-left"
            />
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-yellow-400/50 transition-colors text-left">
            <span className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-tight">목표 횟수</span>
            <input 
              type="number"
              value={ex.reps}
              onChange={(e) => updateRoutineDetail(currentStep, 'reps', e.target.value)}
              className="w-full bg-transparent border-none text-lg font-bold text-white outline-none p-0 text-left"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex gap-3 text-left">
          <Zap size={16} className="text-yellow-400 shrink-0" fill="currentColor" />
          <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold">AI 코칭:</span> {ex.tip}</p>
        </div>
      </main>

      <footer className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 text-xl font-mono font-bold text-white w-full justify-center">
          <Timer size={20} className="text-yellow-400" /> 01:24
        </div>
        <button 
          onClick={nextSet}
          className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl text-lg shadow-xl shadow-yellow-400/10 active:scale-95 transition-transform"
        >
          SET COMPLETE
        </button>
      </footer>
    </div>
  );
};

/**
 * 화면 3: 내 정보 뷰 (Profile)
 */
const ProfileView = () => (
  <div className="flex flex-col h-full bg-black text-white p-6 pt-16 text-left overflow-y-auto">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg shadow-yellow-400/10">
        <User size={32} className="text-yellow-400" />
      </div>
      <div className="text-left">
        <h2 className="text-xl font-bold tracking-tight">Vibe Challenger</h2>
        <p className="text-xs text-zinc-500">바이브 PT 프리미엄 멤버 | 24회차 완료</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-8">
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-left">
        <span className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold tracking-tight">이번 주 운동</span>
        <span className="text-lg font-bold">4회 완료</span>
      </div>
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-left">
        <span className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold tracking-tight text-left">총 활동 에너지</span>
        <span className="text-lg font-bold text-yellow-400">12,400 kcal</span>
      </div>
    </div>

    <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest text-left">설정 및 관리</h3>
    <div className="space-y-2 mb-32">
      {['운동 이력 데이터 분석', '지점별 기구 리스트', 'AI 목소리 및 테마 설정', '로그아웃'].map((item, i) => (
        <div key={i} className="bg-zinc-900/50 p-4 rounded-xl flex justify-between items-center border border-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors">
          <span className="text-sm">{item}</span>
          <ChevronRight size={16} className="text-zinc-700" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * 화면 4: 요약 뷰 (Summary)
 */
const SummaryView = ({ setView, setActiveTab, setCurrentStep, setCurrentSet }) => (
  <div className="flex flex-col h-full bg-black text-white items-center justify-center p-8 text-center">
    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-yellow-400/20 animate-pulse">
      <CheckCircle2 size={40} color="black" />
    </div>
    <h2 className="text-3xl font-bold mb-2 tracking-tighter italic uppercase text-center">VIBE COMPLETE!</h2>
    <p className="text-zinc-400 text-sm mb-10 leading-relaxed text-center">
      오늘의 루틴을 성공적으로 마쳤습니다.<br/>어깨 컨디션에 맞춘 완벽한 가슴 운동이었어요!
    </p>
    
    <div className="w-full space-y-3 mb-10">
      <div className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center border border-zinc-800">
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-tight text-left">총 누적 볼륨</span>
        <span className="font-bold text-yellow-400">4,120 kg</span>
      </div>
      <div className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center border border-zinc-800">
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-tight text-left">소요 시간</span>
        <span className="font-bold">42분 15초</span>
      </div>
    </div>

    <button 
      onClick={() => { setView('chat'); setActiveTab('chat'); setCurrentStep(0); setCurrentSet(1); }}
      className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
    >
      오늘의 성장 기록하기
    </button>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [view, setView] = useState('chat'); // chat, routine, guide, summary
  const [messages, setMessages] = useState([
    { role: 'ai', content: '반갑습니다! 바이브 PT AI 코치입니다. 오늘의 컨디션과 가용 시간에 딱 맞는 운동 루틴을 설계해 드릴게요.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [routine, setRoutine] = useState(INITIAL_ROUTINE);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const updateRoutineDetail = (index, field, value) => {
    const newRoutine = [...routine];
    newRoutine[index][field] = value;
    setRoutine(newRoutine);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');

    // AI 응답 시뮬레이션 (루틴 데이터 포함)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "어제 어깨를 사용하셨네요. 관절 부하를 최소화하면서 가슴 근육에 강한 자극을 줄 수 있는 루틴입니다.", 
        routineData: INITIAL_ROUTINE // 추천 데이터를 답변에 직접 포함
      }]);
    }, 800);
  };

  // 특정 답변에 포함된 루틴으로 운동 시작
  const startSpecificRoutine = (data) => {
    setRoutine(data);
    setView('routine');
    setActiveTab('guide');
  };

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

  return (
    <div className="w-full max-w-md mx-auto h-[800px] border-[10px] border-zinc-800 rounded-[3.5rem] overflow-hidden shadow-2xl bg-black relative">
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
            startSpecificRoutine={startSpecificRoutine}
          />
        )}
        {activeTab === 'guide' && view === 'routine' && (
          <RoutineView routine={routine} setView={setView} />
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
        {activeTab === 'profile' && <ProfileView />}
        {view === 'summary' && (
          <SummaryView 
            setView={setView} 
            setActiveTab={setActiveTab} 
            setCurrentStep={setCurrentStep} 
            setCurrentSet={setCurrentSet} 
          />
        )}
      </div>

      <GNB activeTab={activeTab} setActiveTab={setActiveTab} setView={setView} />
    </div>
  );
};

export default App;
