'use client';

import Link from "next/link";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 font-sans text-neutral-100 p-6 selection:bg-blue-500/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center text-center max-w-4xl gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs font-medium text-blue-400 mb-4 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Monaco Editor Integration
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
          B-University <br />
          <span className="text-blue-500">Code Playground</span>
        </h1>

        <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
          Experience the power of Monaco Editor seamlessly integrated into your workflow. 
          Draft, identify, and explain your code in a premium, high-performance environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/editor"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/25 active:scale-95"
          >
            Launch Editor
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <button
            onClick={() => {}}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-neutral-300 transition-all duration-200 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 hover:text-white active:scale-95"
          >
            View Documentation
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Identify", desc: "Instantly recognize patterns and structures in your code snippet.", color: "text-blue-400" },
            { title: "Explain", desc: "Get high-level overviews and deep dives into how your logic works.", color: "text-purple-400" },
            { title: "Deploy", desc: "Integrated tools to move from playground to production with ease.", color: "text-pink-400" }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 transition-colors">
              <h3 className={`text-lg font-bold ${feature.color} mb-2`}>{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="absolute bottom-8 text-neutral-600 text-sm">
        &copy; 2026 B-University PoC. Built with Next.js and Monaco Editor.
      </footer>
    </div>
  );
}

