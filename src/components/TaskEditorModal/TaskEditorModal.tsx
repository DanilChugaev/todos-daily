import './task-editor-modal.pcss';
import { Input } from '../Form/Input/Input.tsx';
import { Textarea } from '../Form/Textarea/Textarea.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useEffect, useState } from 'react';
import { type ITask } from '../../utils/db/db.ts';
import { useTasks } from '../../hooks/useTasks.ts';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import { Select } from '../Form/Select/Select.tsx';
import { useCategories } from '../../hooks/useCategories.ts';

interface TaskEditorModalProps {
  task?: Partial<ITask>;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskEditorModal({
  task,
  isOpen,
  onClose,
}: TaskEditorModalProps) {
  const { addTask, updateTask, deleteTask } = useTasks();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: 0,
    priority: 'medium' as ITask['priority'],
    dueDate: '',
    subtasks: [] as string[],
  });

  // const [newSubtask, setNewSubtask] = useState('');
  const isEditMode = Boolean(task?.id);

  // Подставляем данные при открытии на редактирование
  useEffect(() => {
    if (task?.id) {
      setTimeout(() => {
        setForm({
          title: task.title!,
          description: task.description || '',
          categoryId: task.categoryId ?? 0,
          priority: task.priority ?? 'medium',
          dueDate: task.dueDate || '',
          subtasks: [...(task.subtasks ?? [])],
        });
      }, 0);
    } else {
      // Режим создания — чистая форма
      setTimeout(() => {
        setForm({
          title: '',
          description: '',
          categoryId: task?.categoryId ?? 0,
          priority: 'medium',
          dueDate: '',
          subtasks: [],
        });
      }, 0);
    }
    // setNewSubtask('');
  }, [task]);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!form.title.trim()) {
      alert('Название задачи обязательно!');
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      categoryId: form.categoryId,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
      subtasks: form.subtasks,
    };

    if (isEditMode && task?.id) {
      await updateTask(task.id, taskData);
    } else {
      await addTask(taskData);
    }

    handleBeforeClose();
  }

  // function handleAddSubtask() {
  //   if (newSubtask.trim()) {
  //     setForm((prev) => ({
  //       ...prev,
  //       subtasks: [...prev.subtasks, newSubtask.trim()],
  //     }));
  //     setNewSubtask('');
  //   }
  // };
  //
  // function handleRemoveSubtask(index: number) {
  //   setForm((prev) => ({
  //     ...prev,
  //     subtasks: prev.subtasks.filter((_, i) => i !== index),
  //   }));
  // };

  async function handleDelete() {
    if (!task) return;

    const confirmed = window.confirm('Точно удалить задачу?\n\nЭто действие нельзя отменить.');

    if (confirmed) {
      await deleteTask(task.id!);

      handleBeforeClose();
    }
  }

  function handleBeforeClose() {
    setForm({
      title: '',
      description: '',
      categoryId: 0,
      priority: 'medium',
      dueDate: '',
      subtasks: [],
    });

    onClose();
  }

  return (
    <ModalDialog
      title={task?.title ? 'Редактировать задачу' : 'Добавить задачу'}
      isOpen={isOpen}
      onClose={handleBeforeClose}
    >
      <Input
        focus
        id="task-name"
        type="text"
        placeholder="Название*"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        onEnter={handleSubmit}
      />

      <Textarea
        id="task-description"
        placeholder="Описание"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Select
        id="task-category"
        placeholder="Категория"
        value={form.categoryId}
        onChange={(categoryId) => setForm({ ...form, categoryId })}
        options={categories}
      />

      {isEditMode && (
        <Button onClick={handleDelete} color="red">
          <TrashIcon/>

          Удалить задачу
        </Button>
      )}

      <Button onClick={handleSubmit}>
        <PlusIcon/>

        {task?.title ? ' Сохранить' : 'Добавить'}
      </Button>
    </ModalDialog>
  );
}