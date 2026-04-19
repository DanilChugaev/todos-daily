import './task-editor-modal.pcss';
import { Input } from '../Form/Input/Input.tsx';
import { Textarea } from '../Form/Textarea/Textarea.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks.ts';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import { Select } from '../Form/Select/Select.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { type ISubTask, type ITask, PriorityEnum } from '../../types.ts';
import { PRIORITIES_OPTIONS } from '../../constants.ts';
import { SubTask } from '../TaskList/Task/SubTask/SubTask.tsx';

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
    priority: PriorityEnum.OTHER,
    dueDate: '',
    subtasks: [] as ISubTask[],
  });

  const [newSubtask, setNewSubtask] = useState('');
  const isEditMode = Boolean(task?.id);

  // Подставляем данные при открытии на редактирование
  useEffect(() => {
    if (task?.id) {
      setTimeout(() => {
        setForm({
          title: task.title!,
          description: task.description || '',
          categoryId: task.categoryId ?? 0,
          priority: task.priority ?? PriorityEnum.OTHER,
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
          priority: PriorityEnum.OTHER,
          dueDate: '',
          subtasks: [],
        });
      }, 0);
    }
    setTimeout(() => setNewSubtask(''), 0);
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

  function handleAddSubtask() {
    if (newSubtask.trim()) {
      setForm((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          title: newSubtask.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      }));

      setNewSubtask('');
    }
  };

  function handleRemoveSubtask(id: string) {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((item) => item.id !== id),
    }));
  };

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
      priority: PriorityEnum.OTHER,
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

      <div className="task-editor-modal__selects">
        <Select
          id="task-category"
          placeholder="Категория"
          value={form.categoryId}
          onChange={(categoryId) => setForm({ ...form, categoryId })}
          options={categories}
        />

        <Select
          id="task-category"
          placeholder="Приоритет"
          value={form.priority}
          onChange={(priority) => setForm({ ...form, priority })}
          options={PRIORITIES_OPTIONS}
        />
      </div>

      {form.subtasks.length > 0 && (
        <div className="task-editor-modal__subtask">
          {form.subtasks.map((subtask, index) => (
              <SubTask
                key={index}
                subtask={subtask}
                onDelete={() => handleRemoveSubtask(subtask.id)}
                onChange={() => {}}
                onComplete={() => {}}
              />
            ))}
        </div>)
      }

      <div className="task-editor-modal__new-subtasks">
        <Input
          id="add-subtask"
          type="text"
          placeholder="Добавить подзадачу"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onEnter={handleAddSubtask}
        />

        <Button icon onClick={handleAddSubtask}>
          <PlusIcon/>
        </Button>
      </div>


      <div className="task-editor-modal__actions">
        <Button className="task-editor-modal__create-btn" onClick={handleSubmit}>
          <PlusIcon/>

          {task?.title ? ' Сохранить' : 'Добавить'}
        </Button>

        {isEditMode && (
          <Button icon onClick={handleDelete}>
            <TrashIcon/>
          </Button>
        )}
      </div>
    </ModalDialog>
  );
}