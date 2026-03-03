import './task-editor-modal.pcss';
import { Input } from '../Form/Input/Input.tsx';
import { Textarea } from '../Form/Textarea/Textarea.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useEffect, useState } from 'react';
import type { ITask } from '../TaskList/Task/types.ts';

interface TaskEditorModalProps {
  task: ITask; // todo: сделать поля тут опциональными, в исходном типе обязательными
  isOpen: boolean;
  onSave: (task: ITask) => void;
  onClose: () => void;
}

export function TaskEditorModal({
  task,
  isOpen,
  onSave,
  onClose,
}: TaskEditorModalProps) {
  const [modalTitle, setModalTitle] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('');
  const [changedTask, setChangedTask] = useState<ITask>({
    id: task.id ?? '',
    name: task.name ?? '',
    description: task.description ?? '',
    done: task.done ?? false,
    dateCreated: task.dateCreated ?? new Date(),
    dateChanged: task.dateChanged ?? new Date(),
    priority: task.priority ?? 'other',
    category: task.category ?? '',
    subTasks: task.subTasks ?? [],
  });
  // const [taskDescription, setTaskDescription] = useState<string | null>(null);
  // const [subtasks, setSubtasks] = useState<{ id: string; name: string }[]>([]);
  // const [category, setCategory] = useState<Category | null>(null);
  //
  // const handleAddSubtask = (name: string) => {
  //   setSubtasks([...subtasks, { id: Date.now().toString(), name }]);
  // };
  //
  // const handleDeleteSubtask = (id: string) => {
  //   setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  // };
  //
  // const handleSaveTask = () => {
  //   // Save task logic here
  //   onClose();
  // };

  function handleSaveTask() {
    if (!changedTask.name) return;

    onSave(changedTask);
  }

  useEffect(() => {
    setTimeout(() => {
      setModalTitle(task.name ? 'Редактировать задачу' : 'Добавить задачу');
      setButtonText(task.name ? ' Сохранить' : 'Добавить');
    }, 0);
  }, [setModalTitle, setButtonText, task]);

  return (
    <ModalDialog
      title={modalTitle}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Input
        focus
        id="task-name"
        type="text"
        placeholder="Введите название задачи"
        value={changedTask.name!}
        onChange={(event) => setChangedTask({ ...changedTask, name: event.target.value })}
        onEnter={handleSaveTask}
      />

      <Textarea
        id="task-name"
        placeholder="Введите описание задачи"
        value={changedTask.description!}
        onChange={(event) => setChangedTask({ ...changedTask, description: event.target.value })}
      />

      {/*<div>*/}
      {/*  <CategoriesPopover/>*/}
      {/*</div>*/}

      <Button onClick={handleSaveTask}>
        <PlusIcon/>

        {buttonText}
      </Button>
    </ModalDialog>
  );
}