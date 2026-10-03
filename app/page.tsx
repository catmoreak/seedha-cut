"use client";

import { useState, FormEvent } from "react";
import NextLink from "next/link";
import LetterGlitch from "./components/LetterGlitch";
import PageFooter from "./components/PageFooter";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [launchAt, setLaunchAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortenedLink, setShortenedLink] = useState<{
    shortUrl: string;
    originalUrl: string;
    expiresAt?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleShorten = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setShortenedLink(null);
    setCopied(false);

    if (!url) {
      setError("Please enter a URL to shorten");
      return;
    }

  
    try {
      new URL(url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    try {

      const formattedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl,
          customAlias: customSlug || undefined,
       
          launchAt: launchAt ? new Date(launchAt).toISOString() : undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten link");
      }

      setShortenedLink(data);

   
      const storedLinks = JSON.parse(localStorage.getItem("links") || "[]");
      const updatedLinks = [
        {
          originalUrl: data.originalUrl,
          shortUrl: data.shortUrl,
        },
        ...storedLinks,
      ];
      localStorage.setItem("links", JSON.stringify(updatedLinks));

     
      setUrl("");
      setCustomSlug("");
      setLaunchAt("");
      setExpiresAt("");
      setShowAdvanced(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedLink) return;
    try {
      await navigator.clipboard.writeText(shortenedLink.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      <div className="absolute inset-0 opacity-80">
        <LetterGlitch
          glitchColors={["#6ee7ff", "#9f7aea", "#22c55e"]}
          glitchSpeed={45}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.82))]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        
        <header className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-16 border-b border-white/5 backdrop-blur-sm bg-black/10">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-semibold tracking-tight text-white/95">
              Seedha Cut
            </span>


          </div>
          <NextLink
            href="/dashboard"
            className="group inline-flex h-9 items-center gap-2 rounded-md border border-white/15 bg-black/30 px-4 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span>Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NextLink>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="w-full max-w-2xl">
            <div className="space-y-8 rounded-2xl border border-white/10 bg-black/60 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-10 transition-all duration-300">
              <div className="space-y-4 border-b border-white/10 pb-6">
                <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
                  Sharper links,<br />
                  <span className="italic text-white/70">cleaner sharing.</span>
                </h1>
              </div>
         
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-[11px] font-medium text-white/50 tracking-[0.18em] uppercase">
                    Destination URL
                  </label>
                  <div className="relative flex items-center rounded-lg bg-white/[0.03] border border-white/15 focus-within:border-white/40 transition-colors">
                    <div className="pl-4 text-white/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter long link (e.g. https://example.com/very-long-path)"
                      className="w-full bg-transparent px-4 py-4 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                </div>

              
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center space-x-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transform transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="tracking-wide">Advanced options <span className="text-white/30">(optional)</span></span>
                  </button>

                
                  <div
                    className={`grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? "mt-4 opacity-100 max-h-96" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   
                      <div className="space-y-1 sm:col-span-2">
                        <label htmlFor="customSlug" className="text-[10px] font-medium text-white/40 tracking-[0.18em] uppercase">
                          Custom slug
                        </label>
                        <div className="relative flex items-center rounded-md bg-white/[0.03] border border-white/15 focus-within:border-white/40 transition-colors">
                          <input
                            id="customSlug"
                            type="text"
                            value={customSlug}
                            onChange={(e) => setCustomSlug(e.target.value)}
                            placeholder="e.g. linkshort"
                            className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none"
                          />
                        </div>
                      </div>

                   
                      <div className="space-y-1">
                        <label htmlFor="launchAt" className="text-[10px] font-medium text-white/40 tracking-[0.18em] uppercase">
                          Launch date
                        </label>
                        <div className="relative flex items-center rounded-md bg-white/[0.03] border border-white/15 focus-within:border-white/40 transition-colors">
                          <input
                            id="launchAt"
                            type="datetime-local" 
                            value={launchAt}
                            onChange={(e) => setLaunchAt(e.target.value)}
                            className="w-full bg-transparent px-3 py-2 text-xs text-white outline-none [color-scheme:dark]"
                          />
                        </div>
                      </div>

                   
                      <div className="space-y-1">
                        <label htmlFor="expiresAt" className="text-[10px] font-medium text-white/40 tracking-[0.18em] uppercase">
                          Expiration date
                        </label>
                        <div className="relative flex items-center rounded-md bg-white/[0.03] border border-white/15 focus-within:border-white/40 transition-colors">
                          <input
                            id="expiresAt"
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full bg-transparent px-3 py-2 text-xs text-white outline-none [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               
                {error && (
                  <div className="flex items-center space-x-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

              
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-md border border-white bg-white text-black shadow-sm shadow-black/30 transition-colors duration-150 hover:bg-neutral-200 hover:border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60 disabled:pointer-events-none"
                >
                  <div className="flex h-11 w-full items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm font-medium">Shortening...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Shorten URL</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>

             
              {shortenedLink && (
                <div className="mt-6 space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                      Link Shortened Successfully
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-black/40 border border-white/5 rounded-xl p-4">
                    <span className="font-mono text-sm break-all text-white/90">
                      {shortenedLink.shortUrl}
                    </span>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium border transition-all ${copied
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                          }`}
                      >
                        {copied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={shortenedLink.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/25 hover:border-cyan-500/40 px-3 py-2 text-xs font-medium text-cyan-300 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  );
}
