type TodoItem = {
  description: string;
  done?: true;
};

export const ToDo = () => {
  const todo: TodoItem[] = [
    {
      description: "Валидация полей",
    },
    {
      description: "Кнопка сыграть еще раз",
      done: true,
    },
    {
      description: "Завершить игру",
      done: true,
    },
    {
      description: "Фильтрация уже играющих игроков в меню выбора",
    },
    {
      description: "Пофиксить громкие звуки при открытии румы",
    },
    {
      description: "Ничья",
    },
  ];

  return (
    <div className="whitespace-pre-wrap flex flex-col gap-2 max-md:hidden">
      <p>TODO LIST:</p>
      <code>
        {todo.map((item) => `${item.done ? "✅" : "⌛"} ${item.description}\n`)}
      </code>
    </div>
  );
};
