'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WebContainer } from '@webcontainer/api';

// Use dynamic import to disable SSR for Monaco Editor
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodeEditorPage() {
  const [code, setCode] = useState('// Type your code here...\n\nfunction hello() {\n  console.log("Hello, B-University!");\n}');
  const editorRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);
  const [containerStatus, setContainerStatus] = useState<'idle' | 'booting' | 'ready' | 'error'>('idle');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Boot WebContainer
    async function bootContainer() {
      if (webcontainerInstance) return;
      
      try {
        setContainerStatus('booting');
        console.log('--- BOOTING WEBCONTAINER ---');
        const instance = await WebContainer.boot();
        setWebcontainerInstance(instance);
        setContainerStatus('ready');
        console.log('--- WEBCONTAINER READY ---');
      } catch (error) {
        console.error('WebContainer boot failed:', error);
        setContainerStatus('error');
      }
    }

    bootContainer();
  }, [webcontainerInstance]);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const handleSaveAndRun = async () => {
    if (!webcontainerInstance) return;
    
    const currentCode = editorRef.current ? editorRef.current.getValue() : code;
    setIsRunning(true);
    setOutput('> Writing file index.js...\n');
    
    try {
      // 1. Write the code to a virtual file
      await webcontainerInstance.fs.writeFile('/index.js', currentCode);
      
      setOutput(prev => prev + '> Executing with Node.js...\n\n');
      
      // 2. Spawn a node process
      const process = await webcontainerInstance.spawn('node', ['index.js']);
      
      // 3. Capture the output
      process.output.pipeTo(
        new WritableStream({
          write(data) {
            setOutput(prev => prev + data);
          }
        })
      );
      
      // 4. Wait for it to finish
      const exitCode = await process.exit;
      setOutput(prev => prev + `\n> Process exited with code ${exitCode}`);
      
    } catch (error: any) {
      setOutput(prev => prev + `\n> Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-500 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="animate-pulse">Loading B-University IDE...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="px-8 py-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-none">
              B-University IDE
            </h1>
            <p className="text-neutral-400 text-xs mt-1">Draft, Identify, and Explain</p>
          </div>
          
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
            <div className={`w-2 h-2 rounded-full ${
              containerStatus === 'ready' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              containerStatus === 'booting' ? 'bg-yellow-500 animate-pulse' : 
              containerStatus === 'error' ? 'bg-red-500' : 'bg-neutral-600'
            }`}></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Container: <span className={
                containerStatus === 'ready' ? 'text-green-400' : 
                containerStatus === 'booting' ? 'text-yellow-400' : 
                containerStatus === 'error' ? 'text-red-400' : 'text-neutral-500'
              }>{containerStatus}</span>
            </span>
          </div>
        </div>
        
        <button
          onClick={handleSaveAndRun}
          disabled={containerStatus !== 'ready' || isRunning}
          className={`group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-200 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg active:scale-95 ${
            containerStatus === 'ready' && !isRunning
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
          }`}
        >
          {isRunning ? (
            <div className="w-5 h-5 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className={`w-5 h-5 mr-2 ${containerStatus === 'ready' ? 'opacity-100' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 min-h-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
          {/* Editor Pane */}
          <div className="flex-1 lg:w-2/3 flex flex-col rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl relative min-h-[300px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-20"></div>
            
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue={code}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                fontSize: 16,
                fontFamily: 'var(--font-mono)',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                lineNumbersMinChars: 3,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="w-full lg:w-1/3 h-1/3 lg:h-full shrink-0 flex flex-col rounded-2xl overflow-hidden border border-neutral-800 bg-black relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 z-20"></div>
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/80 border-b border-neutral-800 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Output Terminal
              </span>
              {isRunning && <span className="text-xs text-blue-400 animate-pulse">Running process...</span>}
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {output || (
                <span className="text-neutral-600 italic">Click 'Run Code' to execute your snippet...</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer info or Status bar */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-[0.2em] px-2 shrink-0">
          <div className="flex gap-4 font-medium">
            <span>JavaScript</span>
            <span>UTF-8</span>
            <span className={`${containerStatus === 'ready' ? 'text-green-500/80' : 'text-neutral-600'} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${containerStatus === 'ready' ? 'bg-green-500' : 'bg-neutral-700'}`}></span>
              {containerStatus === 'ready' ? 'Environment Active' : 'Environment Offline'}
            </span>
          </div>
          <div className="font-medium">
            Powered by Monaco & WebContainer
          </div>
        </div>
      </main>
    </div>
  );
}


