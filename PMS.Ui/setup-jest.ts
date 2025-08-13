import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

beforeAll(() => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
});
