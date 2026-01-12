# Test Checklist: Migration Vite/pnpm/Nx

## 📋 Pre-requisites

- [ ] Node.js version 18+ đã được cài đặt
- [ ] pnpm đã được cài đặt (version 9.8.0+)
- [ ] Đã checkout branch `update-package-structure`
- [ ] Đã xóa `node_modules` và lock files cũ (nếu có)

---

## 🔧 1. Installation & Setup

### 1.1 Clean Install
- [ ] Xóa `node_modules` (nếu có từ yarn)
- [ ] Xóa `.yarn/cache` (nếu có)
- [ ] Xóa `yarn.lock` (nếu có)
- [ ] Chạy `pnpm install --frozen-lockfile`
- [ ] Verify: Không có errors trong quá trình install
- [ ] Verify: `node_modules` được tạo đúng cấu trúc
- [ ] Verify: `pnpm-lock.yaml` tồn tại và valid

### 1.2 Workspace Setup
- [ ] Verify: `pnpm-workspace.yaml` tồn tại
- [ ] Verify: `packages/*` được include trong workspace
- [ ] Chạy `pnpm list` để verify workspace structure
- [ ] Verify: Tất cả dependencies được resolve đúng

---

## 🏗️ 2. Build Process

### 2.1 Build với Nx
- [ ] Chạy `pnpm exec nx build chain-list`
- [ ] Verify: Build thành công không có errors
- [ ] Verify: Output folder `packages/chain-list/dist` được tạo
- [ ] Verify: Có các files:
  - [ ] `dist/index.js` (ES module)
  - [ ] `dist/index.cjs` (CommonJS)
  - [ ] `dist/index.d.ts` (Type definitions)
  - [ ] `dist/types.js` (ES module)
  - [ ] `dist/types.cjs` (CommonJS)
  - [ ] `dist/types.d.ts` (Type definitions)
  - [ ] `dist/data/` folder với JSON files

### 2.2 Build Output Verification
- [ ] Verify: `dist/index.js` là ES module (có `export`)
- [ ] Verify: `dist/index.cjs` là CommonJS (có `module.exports`)
- [ ] Verify: Type definitions (`*.d.ts`) được generate đúng
- [ ] Verify: JSON data files trong `dist/data/` được copy đúng
- [ ] Verify: Asset URLs trong JSON files được transform (có prefix URL)
- [ ] Verify: File sizes hợp lý (không quá lớn)

### 2.3 Build với environment variables
- [ ] Set `CHAIN_ASSET_URL=https://custom-url.example.com`
- [ ] Chạy build lại
- [ ] Verify: Asset URLs trong JSON files sử dụng custom URL
- [ ] Verify: Default URL được dùng nếu không set env var

### 2.4 Clean Build
- [ ] Chạy `pnpm exec nx reset` (hoặc xóa dist folder)
- [ ] Chạy build lại
- [ ] Verify: Build output giống như lần trước

---

## 🔄 3. Development Workflow

### 3.1 TypeScript Compilation
- [ ] Chạy `pnpm exec nx typecheck chain-list`
- [ ] Verify: Không có type errors
- [ ] Verify: Type definitions được resolve đúng

### 3.2 Package Exports - Development Mode
- [ ] Verify: `package.json` có field `exports` đúng
- [ ] Verify: Development condition points đến source files:
  - [ ] `"./": { "development": "./src/index.ts" }`
  - [ ] `"./types": { "development": "./src/types.ts" }` ⚠️ **FIX TYPO NẾU CHƯA**
- [ ] Test import trong development mode:
  ```typescript
  import { ... } from '@subwallet/chain-list'
  import type { ... } from '@subwallet/chain-list/types'
  ```

### 3.3 Package Exports - Production Mode
- [ ] Test import từ built package:
  ```typescript
  import { ... } from '@subwallet/chain-list'
  import type { ... } from '@subwallet/chain-list/types'
  ```
- [ ] Verify: Cả ESM và CJS imports đều hoạt động
- [ ] Test với Node.js (require):
  ```javascript
  const { ... } = require('@subwallet/chain-list')
  ```

---

## 🧪 4. Testing

### 4.1 Run Tests
- [ ] Chạy `pnpm exec nx test chain-list`
- [ ] Verify: Tất cả tests pass
- [ ] Verify: Test coverage được generate (nếu có)
- [ ] Verify: Test output rõ ràng

### 4.2 Test Watch Mode
- [ ] Chạy `pnpm exec nx test chain-list --watch`
- [ ] Thay đổi một test file
- [ ] Verify: Tests tự động re-run
- [ ] Stop watch mode

### 4.3 Test với Vitest UI (optional)
- [ ] Chạy `pnpm exec nx test chain-list --ui`
- [ ] Verify: UI mở được
- [ ] Verify: Có thể run tests từ UI

---

## 📦 5. Package Consumption Testing

### 5.1 Local Package Testing
- [ ] Tạo test project mới (hoặc dùng project test)
- [ ] Link package: `pnpm link packages/chain-list`
- [ ] Install trong test project
- [ ] Test import:
  ```typescript
  import * as chainList from '@subwallet/chain-list'
  import type { _ChainInfo } from '@subwallet/chain-list/types'
  ```
- [ ] Verify: Types được resolve đúng
- [ ] Verify: Runtime code hoạt động đúng
- [ ] Test các functions/constants exports

### 5.2 ESM vs CJS Compatibility
- [ ] Test với ESM project (type: "module")
- [ ] Test với CommonJS project (không có type: "module")
- [ ] Verify: Cả hai đều hoạt động

### 5.3 TypeScript Integration
- [ ] Test với TypeScript project
- [ ] Verify: Type definitions được load đúng
- [ ] Verify: IntelliSense hoạt động
- [ ] Verify: Type errors được report đúng

---

## 🔍 6. Fetch Scripts

### 6.1 Fetch Chains
- [ ] Set environment variables:
  - `STRAPI_TOKEN`
  - `STRAPI_URL`
- [ ] Chạy `pnpm --filter chain-list fetch:chains`
- [ ] Verify: Script chạy thành công
- [ ] Verify: Data được fetch và update đúng

### 6.2 Fetch Chain Assets
- [ ] Chạy `pnpm --filter chain-list fetch:chain-assets`
- [ ] Verify: Script chạy thành công
- [ ] Verify: Data được fetch và update đúng

### 6.3 Fetch Multi-chain Assets
- [ ] Chạy `pnpm --filter chain-list fetch:multi-chain-assets`
- [ ] Verify: Script chạy thành công
- [ ] Verify: Data được fetch và update đúng

### 6.4 Fetch All
- [ ] Chạy `pnpm --filter chain-list fetch:all`
- [ ] Verify: Tất cả 3 fetch scripts chạy tuần tự
- [ ] Verify: Không có errors

---

## 🔧 7. Patch Scripts

### 7.1 Patch Data
- [ ] Chạy `pnpm --filter chain-list patch:data`
- [ ] Verify: Script chạy thành công
- [ ] Verify: Patch files được generate đúng

### 7.2 Patch Compare
- [ ] Chạy `pnpm --filter chain-list patch:compare`
- [ ] Verify: Script chạy thành công
- [ ] Verify: Output hợp lý

---

## 📁 8. File Structure & Assets

### 8.1 Source Files
- [ ] Verify: `packages/chain-list/src/` có đầy đủ files
- [ ] Verify: `packages/chain-list/src/data/` có JSON files
- [ ] Verify: `packages/chain-list/src/public/` có assets

### 8.2 Build Files
- [ ] Verify: `packages/chain-list/dist/` structure đúng
- [ ] Verify: JSON data files được copy vào `dist/data/`
- [ ] Verify: Asset URLs được transform trong JSON files

### 8.3 Config Files
- [ ] Verify: `vite.config.ts` tồn tại và valid
- [ ] Verify: `tsconfig.lib.json` tồn tại
- [ ] Verify: `tsconfig.spec.json` tồn tại
- [ ] Verify: `nx.json` có config đúng

---

## 🚀 9. CI/CD Verification

### 9.1 Local CI Simulation
- [ ] Chạy `pnpm exec nx run-many -t lint test build typecheck`
- [ ] Verify: Tất cả tasks pass
- [ ] Verify: Build output giống như khi build riêng lẻ

### 9.2 Linting
- [ ] Chạy `pnpm exec nx lint chain-list`
- [ ] Verify: Không có linting errors
- [ ] Fix warnings nếu có (optional)

### 9.3 Type Checking
- [ ] Chạy `pnpm exec nx typecheck chain-list`
- [ ] Verify: Không có type errors

---

## 🔗 10. Integration Testing

### 10.1 Compare với Version Cũ
- [ ] Checkout branch `dev`
- [ ] Build version cũ
- [ ] Checkout lại branch `update-package-structure`
- [ ] Build version mới
- [ ] Compare output:
  - [ ] File sizes tương đương
  - [ ] API exports giống nhau
  - [ ] Type definitions giống nhau
  - [ ] JSON data structure giống nhau

### 10.2 Backward Compatibility
- [ ] Test với project đang dùng version cũ của package
- [ ] Update package version mới
- [ ] Verify: Không có breaking changes
- [ ] Verify: API calls vẫn hoạt động

---

## 📝 11. Documentation & Cleanup

### 11.1 Documentation
- [ ] Verify: README được update (nếu cần)
- [ ] Verify: Migration guide được tạo (nếu cần)
- [ ] Verify: Build instructions được update

### 11.2 Cleanup
- [ ] Verify: Không có file cũ còn sót lại:
  - [ ] `rollup.config.mjs`
  - [ ] `yarn.lock`
  - [ ] Old build scripts
- [ ] Verify: `.gitignore` được update (ignore `dist/`, `node_modules/`, etc.)

---

## ⚠️ 12. Critical Issues Check

### 12.1 Known Issues
- [ ] **FIX TYPO:** `package.json` - `"./src/type.ts"` → `"./src/types.ts"`
- [ ] Verify: CI/CD workflows được update (yarn → pnpm)
- [ ] Verify: Release workflow được update

### 12.2 Error Handling
- [ ] Test với missing environment variables
- [ ] Test với invalid data
- [ ] Verify: Error messages rõ ràng

---

## ✅ Final Verification

### Build & Test Suite
- [ ] Full clean install: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- [ ] Full build: `pnpm exec nx build chain-list`
- [ ] Full test: `pnpm exec nx test chain-list`
- [ ] Full typecheck: `pnpm exec nx typecheck chain-list`
- [ ] Full lint: `pnpm exec nx lint chain-list`

### Package Publish Test (if applicable)
- [ ] Verify: Package có thể được pack: `pnpm pack`
- [ ] Verify: Packed tarball có structure đúng
- [ ] Test install từ packed tarball

---

## 📊 Test Results Summary

**Date:** _______________
**Tester:** _______________
**Branch:** `update-package-structure`

**Status:**
- [ ] ✅ All tests passed
- [ ] ⚠️ Some issues found (see notes)
- [ ] ❌ Critical issues found

**Notes:**
```
(Add any issues or observations here)
```

---

## 🎯 Quick Test Commands Reference

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install --frozen-lockfile

# Build
pnpm exec nx build chain-list

# Test
pnpm exec nx test chain-list

# Typecheck
pnpm exec nx typecheck chain-list

# Lint
pnpm exec nx lint chain-list

# Run all checks
pnpm exec nx run-many -t lint test build typecheck

# Fetch data
pnpm --filter chain-list fetch:all

# Patch
pnpm --filter chain-list patch:data
```

---

**Lưu ý:** 
- Đánh dấu ✅ khi hoàn thành mỗi item
- Ghi chú lại bất kỳ issues nào phát hiện
- Test trên cả development và production environments nếu có thể

