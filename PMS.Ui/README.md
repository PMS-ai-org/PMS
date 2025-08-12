# PMS_UI (Angular 20+)

Minimal Angular 20+ project scaffold following strict TypeScript and Angular best practices described by the author.

## Prerequisites
- Node.js 18+ (Node 18 LTS recommended)
- npm 9+ (bundled with Node 18+)
- Angular CLI 20+ (optional globally): `npm i -g @angular/cli@latest`
- Recommended editor: Visual Studio Code

## Install & run
```bash
npm install
npm start
# opens http://localhost:4200
```

## Build
```bash
npm run build
```

## Tests
```bash
npm run test
```

## Project structure highlights
- Uses standalone components and signals for state
- Reactive forms
- Jest for unit tests (ts-jest)
- NgOptimizedImage for static images
- Lazy loaded feature route
- Services use `inject()` and providedIn: 'root'

## Notes on best-practices enforced
- TypeScript strict mode enabled in tsconfig.json
- Prefer inline templates for small components
- Use `input()` / `output()` functions instead of decorators
- Use `computed()` for derived state
- Change detection: OnPush set on components
- Do not use `@HostBinding` / `@HostListener`

If you want a full working CLI project (with Angular CLI workspace builders installed), run `ng new pms-ui` and then copy `src/` + config files from this repo into it, or run `npm i` here and install `@angular-devkit/build-angular` + `@angular/cli` to fully enable `ng serve`.

//Testing for angular