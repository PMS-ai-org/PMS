import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoService } from '../../services/todo.service';
import { of } from 'rxjs';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getTodos: () => of([]),
            addTodo: () => of({ id: 1, title: 'Test', isComplete: false }),
            updateTodo: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
