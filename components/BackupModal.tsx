'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { buildBackupPayload, validateBackupPayload } from '../lib/helpers';
import { loadAiConfig, saveAiConfig } from '../lib/aiGrader';
import { POMO_PREFIX, safeSet } from '../lib/storage';
import Modal from './Modal';
import { DownloadIcon } from './Icons';

/**
 * Backup & Restore — ported 1:1 from the BACKUP / RESTORE section
 * (buildBackupPayload / validateBackupPayload / the export+import button
 * handlers). Schema is documented in BACKUP_SCHEMA.md, unchanged.
 */
export default function BackupModal() {
  const { backupOpen, setBackupOpen, completed, setCompletedSet, showToast, reloadPomoCount } = useRoadmap();

  const [exportJson, setExportJson] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [importPasteText, setImportPasteText] = useState('');
  const [importResult, setImportResult] = useState<{ kind: 'ok' | 'error'; message: string; errors?: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!backupOpen) return;
    setShowFallback(false);
    setImportResult(null);
    setImportPasteText('');
  }, [backupOpen]);

  function handleExport() {
    const payload = buildBackupPayload(completed);
    const json = JSON.stringify(payload, null, 2);
    const filename = 'ielts-roadmap-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      /* fall through to the manual fallback below */
    }
    // Always ALSO surface a copyable fallback: some sandboxed previews
    // silently no-op a script-triggered download with no event we can
    // detect, so rather than guessing whether it worked, we give a manual
    // path every time.
    setExportJson(json);
    setShowFallback(true);
    const n = payload.data.completedDays.length;
    showToast('Backup ready (' + n + ' day' + (n === 1 ? '' : 's') + ' complete). If a download didn’t start, copy the text below instead.', 'success', 7000);
  }

  async function handleCopyExport() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(exportJson);
        showToast('Copied to clipboard.', 'success', 2500);
      }
    } catch {
      /* ignore */
    }
  }

  function handleFileChosen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImportPasteText(String(reader.result || ''));
    reader.onerror = () => setImportResult({ kind: 'error', message: 'Could not read that file.' });
    reader.readAsText(file);
  }

  function handleImport() {
    const raw = importPasteText.trim();
    if (!raw) {
      setImportResult({ kind: 'error', message: 'Paste backup JSON or choose a file first.' });
      return;
    }
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e: any) {
      setImportResult({ kind: 'error', message: "That isn't valid JSON: " + e.message });
      return;
    }
    const v = validateBackupPayload(parsed);
    if (!v.ok) {
      setImportResult({ kind: 'error', message: 'Invalid backup file:', errors: v.errors });
      return;
    }
    const incomingN = parsed.data.completedDays.length;
    const msg =
      'Restoring will REPLACE your current progress (' +
      completed.size +
      ' day' +
      (completed.size === 1 ? '' : 's') +
      ' complete now) with this backup (' +
      incomingN +
      ' day' +
      (incomingN === 1 ? '' : 's') +
      ' complete, exported ' +
      (parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString() : 'at an unknown time') +
      '). Continue?';
    if (!confirm(msg)) return;

    setCompletedSet(new Set(parsed.data.completedDays));

    if (parsed.data.pomodoro && typeof parsed.data.pomodoro === 'object') {
      Object.keys(parsed.data.pomodoro).forEach((dateKey) => {
        const n = parsed.data.pomodoro[dateKey];
        if (typeof n === 'number' && isFinite(n)) safeSet(POMO_PREFIX + dateKey, String(Math.max(0, Math.floor(n))));
      });
      reloadPomoCount();
    }
    if (parsed.data.aiGrader && typeof parsed.data.aiGrader === 'object') {
      const existing = loadAiConfig();
      saveAiConfig({
        endpoint: parsed.data.aiGrader.endpoint || existing.endpoint,
        model: parsed.data.aiGrader.model || existing.model,
        apiKey: existing.apiKey,
        remember: existing.remember,
      });
    }
    setImportResult({ kind: 'ok', message: 'Restored ' + incomingN + ' completed day(s).' });
    showToast('Progress restored from backup.', 'success');
  }

  return (
    <Modal open={backupOpen} onClose={() => setBackupOpen(false)} labelledBy="backup-modal-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="backup-modal-title" className="font-display font-bold text-lg">
          Backup &amp; Restore Progress
        </h3>
        <button type="button" onClick={() => setBackupOpen(false)} className="focus-ring text-slate-400 hover:text-white text-xl leading-none">
          ✕
        </button>
      </div>
      <p className="mt-2 text-[12.5px] text-slate-400 leading-relaxed">
        Your progress lives only in this browser's storage, so clearing site data (or switching devices) can lose it. Export a backup file now and
        then, and you can restore it any time — here or on another device.
      </p>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Export</div>
        <button
          type="button"
          onClick={handleExport}
          className="focus-ring w-full text-sm px-4 py-2.5 rounded-xl btn-primary font-semibold inline-flex items-center justify-center gap-2"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Download backup (.json)</span>
        </button>
        {showFallback && (
          <div className="mt-2.5">
            <p className="text-[11px] text-slate-500 mb-1.5">Downloads aren't available in this preview — copy the backup text below instead:</p>
            <textarea
              readOnly
              rows={4}
              value={exportJson}
              className="focus-ring w-full rounded-lg bg-black/40 border border-white/10 px-2.5 py-2 text-[10.5px] font-mono text-slate-300"
            />
            <button type="button" onClick={handleCopyExport} className="focus-ring mt-1.5 text-[11.5px] text-brand-sky hover:underline">
              Copy to clipboard
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Restore</div>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChosen} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="focus-ring flex-1 text-sm px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 font-semibold"
          >
            Choose backup file…
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500">Or paste backup JSON directly:</p>
        <textarea
          rows={3}
          value={importPasteText}
          onChange={(e) => setImportPasteText(e.target.value)}
          placeholder={'{"schemaVersion": 1, …}'}
          className="focus-ring mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-2.5 py-2 text-[10.5px] font-mono text-slate-300"
        />
        <button
          type="button"
          onClick={handleImport}
          className="focus-ring mt-2 w-full text-sm px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 font-semibold"
        >
          Restore from backup
        </button>
        <div className="mt-2 text-[11.5px]">
          {importResult?.kind === 'ok' && <span className="text-brand-emerald">✓ {importResult.message}</span>}
          {importResult?.kind === 'error' && (
            <>
              <span className="text-brand-rose">{importResult.message}</span>
              {importResult.errors && (
                <ul className="mt-1 ml-4 list-disc text-brand-rose">
                  {importResult.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
