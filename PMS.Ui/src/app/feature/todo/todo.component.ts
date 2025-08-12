import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  private todoService = inject(TodoService);
  private fb = inject(FormBuilder);

  todos = signal<Todo[]>([]);
  selectedTodo = signal<Todo | null>(null);

  form = this.fb.nonNullable.group({
    title: '',
    isComplete: false,
  });

  constructor() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(this.todos.set);
  }

  submit() {
    const todo = this.form.value;

    const selected = this.selectedTodo();
    if (selected) {
      // Update
      this.todoService.updateTodo({ ...selected, ...todo }).subscribe(() => {
        this.loadTodos();
        this.selectedTodo.set(null);
        this.form.reset();
      });
    } else {
      // Add new
      this.todoService.addTodo({
        title: todo.title ?? '',
        isComplete: todo.isComplete ?? false
      }).subscribe(() => {
        this.loadTodos();
        this.form.reset();
      });
    }
  }

  edit(todo: Todo) {
    this.selectedTodo.set(todo);
    this.form.patchValue({
      title: todo.title,
      isComplete: todo.isComplete,
    });
  }

  delete(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.loadTodos();
    });
  }

  cancelEdit() {
    this.selectedTodo.set(null);
    this.form.reset();
  }
}
