import { useRef, useState } from 'react';
import { Button } from '../Button/Button.tsx';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog.tsx';
import { createBackup, downloadBackup, getBackupSummary, importBackup, validateBackup } from '../../utils/backup/backup.ts';
import type { BackupFile, BackupSummary, ImportMode, ImportResult } from '../../utils/backup/types.ts';
import './data-management.pcss';

export function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backup, setBackup] = useState<BackupFile | null>(null);
  const [summary, setSummary] = useState<BackupSummary | null>(null);
  const [mode, setMode] = useState<ImportMode>('merge');
  const [message, setMessage] = useState('');
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);

  async function handleExport() {
    try { downloadBackup(await createBackup()); setMessage('Данные экспортированы. Храните файл в безопасном месте.'); }
    catch (error) { console.error('Failed to export backup:', error); setMessage('Не удалось экспортировать данные.'); }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const parsedBackup = validateBackup(JSON.parse(await file.text()));
      setBackup(parsedBackup); setSummary(getBackupSummary(parsedBackup)); setMessage('');
    } catch (error) {
      setBackup(null); setSummary(null); setMessage(error instanceof Error ? error.message : 'Не удалось прочитать файл.');
    }
  }

  async function runImport(importMode: ImportMode) {
    if (!backup) return;
    try {
      const result: ImportResult = await importBackup(backup, importMode);
      setMessage(`Импорт завершён: ${result.tasks} задач и ${result.categories} категорий.${result.movedToNew ? ` ${result.movedToNew} задач переведены в «Новые» из-за WIP-лимита.` : ''}`);
      setBackup(null); setSummary(null);
    } catch (error) { console.error('Failed to import backup:', error); setMessage('Не удалось импортировать данные. Текущие данные не изменены.'); }
  }

  return (
    <section className="data-management" aria-labelledby="data-management-title">
      <h3 id="data-management-title">Данные</h3>
      <p>Резервная копия задач и категорий.</p>
      <Button inverted onClick={() => void handleExport()}>Экспортировать данные</Button>
      <Button inverted onClick={() => fileInputRef.current?.click()}>Импортировать данные</Button>
      <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} hidden />
      {backup && summary && (
        <div className="data-management__import" aria-live="polite">
          <strong>Файл готов: {summary.categories} категорий, {summary.tasks} задач, {summary.subtasks} подзадач</strong>
          <label><input type="radio" name="import-mode" checked={mode === 'merge'} onChange={() => setMode('merge')} /> Объединить</label>
          <label><input type="radio" name="import-mode" checked={mode === 'replace'} onChange={() => setMode('replace')} /> Заменить текущие данные</label>
          <Button onClick={() => mode === 'replace' ? setIsReplaceConfirmOpen(true) : void runImport('merge')}>Импортировать</Button>
        </div>
      )}
      {message && <p className="data-management__message" role="status">{message}</p>}
      <ConfirmDialog isOpen={isReplaceConfirmOpen} title="Заменить текущие данные?" description="Все текущие задачи и категории будут заменены данными из резервной копии. Это действие нельзя отменить." confirmLabel="Заменить" destructive onConfirm={() => { setIsReplaceConfirmOpen(false); void runImport('replace'); }} onCancel={() => setIsReplaceConfirmOpen(false)} />
    </section>
  );
}
