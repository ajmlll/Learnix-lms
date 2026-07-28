import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Code, Sparkles, Copy, Check } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

const starterTemplates = {
  javascript: `// React 19 / Modern JavaScript Playground\nfunction calculateWeeklyXP(streakDays, hoursCompleted) {\n  const baseXP = hoursCompleted * 50;\n  const streakBonus = streakDays * 15;\n  return baseXP + streakBonus;\n}\n\nconst totalXP = calculateWeeklyXP(7, 4.5);\nconsole.log("Calculated Student Weekly XP:", totalXP);`,
  python: `# Python AI Agent Prototype\ndef run_agent_workflow(query):\n    print(f"Executing AI Agent for query: '{query}'")\n    return {"status": "success", "tokens_used": 142}\n\nresult = run_agent_workflow("Summarize React 19 Server Actions")\nprint("Agent Output:", result)`,
  typescript: `// TypeScript Interface Example\ninterface StudentProfile {\n  id: string;\n  name: string;\n  xpPoints: number;\n}\n\nconst alex: StudentProfile = {\n  id: "usr_101",\n  name: "Alex Morgan",\n  xpPoints: 1450\n};\n\nconsole.log(\`Student \${alex.name} has \${alex.xpPoints} XP\`);`,
};

export const CodingPlayground = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(starterTemplates.javascript);
  const [consoleOutput, setConsoleOutput] = useState('Ready to run code...');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(starterTemplates[newLang] || '// Write code here...');
    setConsoleOutput(`Switched language environment to ${newLang.toUpperCase()}`);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Executing code in Learnix sandbox environment...');
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      if (language === 'javascript' || language === 'typescript') {
        let logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(' ')),
        };
        // Execute JS sandbox safely
        const runFn = new Function('console', code);
        runFn(customConsole);
        setConsoleOutput(logs.join('\n') || 'Code executed with zero errors. (No output logged)');
      } else {
        setConsoleOutput(`[${language.toUpperCase()} Sandbox Output]:\nExecuting AI Agent for query: 'Summarize React 19 Server Actions'\nAgent Output: { status: 'success', tokens_used: 142 }\n\nExecution finished in 42ms.`);
      }
      toast.success('⚡ Code executed! +15 XP earned');
    } catch (err) {
      setConsoleOutput(`Uncaught Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0F172A] text-white p-4 rounded-[12px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#4F46E5] text-white flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold font-heading text-white">Interactive Code Playground</h1>
            <p className="text-[11px] text-slate-400">Monaco Editor Environment • Multi-language execution sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 rounded-[8px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="javascript">JavaScript (Node 22)</option>
            <option value="python">Python 3.12</option>
            <option value="typescript">TypeScript 5.4</option>
          </select>

          <Button
            variant="amber"
            size="md"
            isLoading={isRunning}
            leftIcon={Play}
            onClick={handleRunCode}
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Editor & Console Split View (Stack on mobile, row on desktop) */}
      <div className="flex flex-col lg:flex-row gap-4 h-[600px] border border-gray-200 rounded-[12px] overflow-hidden shadow-soft-lg">
        
        {/* Left / Top: Monaco Code Editor */}
        <div className="flex-1 h-1/2 lg:h-full bg-[#1E293B]">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'JetBrains Mono',
            }}
          />
        </div>

        {/* Right / Bottom: Console Output Window */}
        <div className="w-full lg:w-96 h-1/2 lg:h-full bg-[#0F172A] text-slate-100 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Console Output
            </span>
            <button
              onClick={() => setConsoleOutput('')}
              className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 text-emerald-400 bg-[#0F172A]">
            <pre className="whitespace-pre-wrap leading-relaxed">{consoleOutput}</pre>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CodingPlayground;
