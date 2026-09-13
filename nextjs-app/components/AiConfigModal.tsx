'use client';

import { useEffect, useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { AI_PRESETS, isPlausibleHttpUrl, loadAiConfig, saveAiConfig, testAiConnection } from '../lib/aiGrader';
import Modal from './Modal';
import { PlugIcon } from './Icons';

/**
 * AI Speaking Grader settings — ported 1:1 from the AI GRADER SETTINGS
 * section (validateAiConfigForm / openAiConfigModal / btnTestAiConnection).
 */
export default function AiConfigModal() {
  const { aiConfigOpen, setAiConfigOpen, bumpAiConfigVersion } = useRoadmap();

  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [remember, setRemember] = useState(true);
  const [endpointError, setEndpointError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [connStatus, setConnStatus] = useState<{ text: string; className: string }>({ text: '', className: '' });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!aiConfigOpen) return;
    const cfg = loadAiConfig();
    setEndpoint(cfg.endpoint || '');
    setApiKey(cfg.apiKey || '');
    setModel(cfg.model || '');
    setRemember(cfg.remember !== false);
    setSavedNote(false);
    setEndpointError(null);
    setModelError(null);
    setConnStatus({ text: '', className: '' });
  }, [aiConfigOpen]);

  function applyPreset(key: keyof typeof AI_PRESETS) {
    const preset = AI_PRESETS[key];
    if (!preset) return;
    setEndpoint(preset.endpoint);
    setModel(preset.model);
    setEndpointError(null);
    setModelError(null);
    setConnStatus({ text: '', className: '' });
  }

  // Validates the currently-typed endpoint/model, mirroring
  // validateAiConfigForm() — used by both Save and Test Connection so they
  // can't disagree about what's valid.
  function validate(): { endpoint: string; model: string } | null {
    const e = endpoint.trim();
    const m = model.trim();
    let ok = true;
    if (!e) {
      setEndpointError('An API endpoint is required.');
      ok = false;
    } else if (!isPlausibleHttpUrl(e)) {
      setEndpointError('That doesn’t look like a valid http(s) URL.');
      ok = false;
    } else {
      setEndpointError(null);
    }
    if (!m) {
      setModelError('A model name is required.');
      ok = false;
    } else {
      setModelError(null);
    }
    return ok ? { endpoint: e, model: m } : null;
  }

  function handleSave() {
    const valid = validate();
    if (!valid) return;
    saveAiConfig({ endpoint: valid.endpoint, model: valid.model, apiKey: apiKey.trim(), remember });
    setSavedNote(true);
    bumpAiConfigVersion();
  }

  async function handleTestConnection() {
    const valid = validate();
    if (!valid) {
      setConnStatus({ text: 'Fix the errors above first.', className: 'text-[11.5px] text-brand-rose' });
      return;
    }
    setTesting(true);
    setConnStatus({ text: 'Testing…', className: 'text-[11.5px] text-slate-400' });
    const result = await testAiConnection(valid.endpoint, valid.model, apiKey.trim());
    if (result.ok) {
      setConnStatus({
        text: '✓ Connected' + (result.hadText ? ' — got a response back.' : ' (unusual response shape, but the server answered).'),
        className: 'text-[11.5px] text-brand-emerald',
      });
    } else {
      setConnStatus({ text: '✗ ' + result.message, className: 'text-[11.5px] text-brand-rose' });
    }
    setTesting(false);
  }

  return (
    <Modal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} labelledBy="ai-config-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="ai-config-title" className="font-display font-bold text-lg">
          AI Speaking Grader
        </h3>
        <button type="button" onClick={() => setAiConfigOpen(false)} className="focus-ring text-slate-400 hover:text-white text-xl leading-none">
          ✕
        </button>
      </div>
      <p className="mt-2 text-[12.5px] text-slate-400 leading-relaxed">
        Speaking exercises can be reviewed by a third-party AI service of your choice — never by this app or by Claude itself. Enter any
        OpenAI-compatible <code className="text-[11.5px] px-1 py-0.5 rounded bg-black/40 border border-white/10">/chat/completions</code> endpoint,
        its API key, and a model name.
      </p>

      <div className="mt-4">
        <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Quick presets</label>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => applyPreset('openai')} className="focus-ring text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-slate-200 border border-white/10">
            OpenAI
          </button>
          <button type="button" onClick={() => applyPreset('groq')} className="focus-ring text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-slate-200 border border-white/10">
            Groq
          </button>
          <button type="button" onClick={() => applyPreset('ollama')} className="focus-ring text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-slate-200 border border-white/10">
            Ollama (local)
          </button>
        </div>
        <p className="mt-1.5 text-[10.5px] text-slate-500">Fills in the endpoint and model below — you still need to add your own API key (not needed for Ollama).</p>
      </div>

      <div className="mt-4 space-y-2.5">
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1">API endpoint</label>
          <input
            type="text"
            inputMode="url"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.example.com/v1/chat/completions"
            className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[12.5px] text-slate-100"
          />
          {endpointError && <div className="mt-1 text-[11px] text-brand-rose">{endpointError}</div>}
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            API key <span className="normal-case text-slate-600">(optional for local endpoints)</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-…"
            autoComplete="off"
            className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[12.5px] text-slate-100"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1">Model name</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. gpt-4o-mini"
            className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[12.5px] text-slate-100"
          />
          {modelError && <div className="mt-1 text-[11px] text-brand-rose">{modelError}</div>}
        </div>
        <label className="flex items-center gap-2 pt-1 text-[11.5px] text-slate-400 cursor-pointer">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-emerald-400" />
          <span>Remember my API key on this device (unchecking clears it when this tab closes)</span>
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="focus-ring text-[12px] font-semibold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-100 inline-flex items-center gap-1.5 disabled:opacity-60"
        >
          <PlugIcon />
          <span>Test Connection</span>
        </button>
        <span className={connStatus.className}>{connStatus.text}</span>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">Sent only to the endpoint above, never anywhere else, never to Claude.</p>
      {savedNote && <div className="mt-2 text-[11.5px] text-brand-emerald">Saved ✓</div>}
      <button type="button" onClick={handleSave} className="focus-ring mt-4 w-full text-sm px-4 py-2.5 rounded-xl btn-primary font-semibold">
        Save
      </button>
    </Modal>
  );
}
