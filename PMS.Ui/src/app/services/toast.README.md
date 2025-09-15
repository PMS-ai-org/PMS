# ToastService Usage

Inject `ToastService` in any component or service:

```ts
constructor(private toast: ToastService) {}

save() {
  this.toast.success('Patient saved');
  this.toast.error('Save failed');
  this.toast.info('Fetching data...');
  this.toast.warn('Incomplete form');
}
```

All toasts appear bottom-right and dismiss automatically after 5 seconds.
