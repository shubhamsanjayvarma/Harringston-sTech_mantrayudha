# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

# NovaMart E-Commerce Platform

NovaMart is a high-performance ultra-fast grocery and lifestyle delivery application featuring:
- **Reference-Accurate Homepage**: Pixel-perfect replication of the NovaMart visual identity.
- **Floating Customer Support**: In-context help drawer with live chat, 1-tap delivery tracking, and doorstep return management.
- **Reactive Multi-Page Routing**: Complete navigation for Groceries, Fresh, Electronics, Home, Personal Care, and Offers.
- **Hyperlocal Delivery System**: 10-15m dark store fulfillment engine across Bengaluru hubs.

### Maintained by
- **[@shubhamsanjayvarma](https://github.com/shubhamsanjayvarma)**

