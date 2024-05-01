"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import { Key, useCallback, useState } from "react";
import { DeleteIcon } from "./icons/DeleteIcon";
import { deleteTodo } from "@/actions";
import { AddIcon } from "./icons/AddIcon";
import AddTodoModal from "./AddTodoModal";
import { EyeIcon } from "./icons/EyeIcon";
import { Todo } from "@prisma/client";
import { useFormState } from "react-dom";
import { completeTodo } from "@/actions/complete-todo";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [parentId, setParentId] = useState(0);

  const handleAddTodo = (parentId: number) => {
    setParentId(parentId);
    onOpen();
  };

  const renderCell = useCallback((todo: Todo, columnKey: Key) => {
    const cellValue = todo[columnKey as keyof Todo];

    switch (columnKey) {
      case "title":
        return cellValue;
      case "status":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue as string}
          </Chip>
        );
      case "duration":
        return cellValue;
      case "actions":
        return <TodoActions todo={todo} handleAddTodo={handleAddTodo} />;
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <Table aria-label="Todos">
        <TableHeader>
          <TableColumn key="title">Title</TableColumn>
          <TableColumn key="duration">Dur(min)</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={todos}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey) as any}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddTodoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...{ parentId }}
      />
    </>
  );
}
interface TodoActionsProps {
  todo: Todo;
  handleAddTodo: (parentId: number) => void;
}

function TodoActions({ todo, handleAddTodo }: TodoActionsProps) {
  const [formState, action] = useFormState(completeTodo, { message: "" });

  return (
    <div className="flex gap-2">
      <Tooltip content="Add child todo">
        <span className="text-lg text-info cursor-pointer active:opacity-50">
          <Button onPress={() => handleAddTodo(todo.id)} isIconOnly>
            <AddIcon />
          </Button>
        </span>
      </Tooltip>
      {todo.children.length > 0 && (
        <Tooltip content="Go to child Todo">
          <span className="text-lg text-info active:opacity-50">
            <Button href={`/todo/${todo.id}`} as={Link} isIconOnly>
              <EyeIcon />
            </Button>
          </span>
        </Tooltip>
      )}
      {todo.children.length === 0 && (
        <Tooltip content="Complete">
          <span className="text-lg text-info active:opacity-50">
            <form action={action}>
              <input type="hidden" name="id" value={todo.id} />
              <Button type="submit" isIconOnly></Button>
            </form>
          </span>
        </Tooltip>
      )}
      <Tooltip content="Delete todo">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <form action={deleteTodo.bind(null, todo.id)}>
            <Button type="submit" isIconOnly>
              <DeleteIcon />
            </Button>
          </form>
        </span>
      </Tooltip>
    </div>
  );
}
