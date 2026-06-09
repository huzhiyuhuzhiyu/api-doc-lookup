# api-doc-lookup

> 基于项目 `default_OpenAPI.json` 查询 API 接口请求参数与返回数据结构的 AI Skill。

## 这是什么？

一个通用 AI Skill，让 CodeBuddy 等 AI 编程助手在查询接口时**严格按照本地 OpenAPI 文档回答**，而非猜测、联网抓包或访问线上接口。

## 适合谁用？

- 后端接口多、字段复杂、需要频繁查文档的前端/全栈开发者
- 希望 AI 助手统一按 OpenAPI Spec 回答而非自由发挥的团队
- 接口文档以 OpenAPI 3.0 JSON 形式存放在项目中的场景（如 Knife4j / SpringDoc 生成）

## 怎么用？

### 1. 安装 Skill

放到 `~/.codebuddy/skills/`（Windows 为 `%USERPROFILE%\.codebuddy\skills\`）：

```
.codebuddy/skills/api-doc-lookup/
├── SKILL.md
└── scripts/
    ├── update-openapi.bat
    └── update-openapi.js
```

### 2. 项目里准备接口文档

项目根目录需要有 `default_OpenAPI.json`。可以用 scripts 目录下的脚本拉取：

```bash
# 先改脚本里的 URL
node scripts/update-openapi.js

# Windows 双击
scripts/update-openapi.bat
```

### 3. 直接问 AI

```
「/api/erp/payment/balance/list 这个接口返回数据结构是什么？」
「订单列表接口有哪些请求参数？」
```

AI 会自动加载此 Skill，按规范从 `default_OpenAPI.json` 中查找并结构化输出。

## 工作原理

```
用户提问 ──→ AI 激活 Skill ──→ 搜索 default_OpenAPI.json
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
                   定位 paths 路径      提取 $ref Schema 引用
                          │                   │
                          └─────────┬─────────┘
                                    ▼
                          查找 components/schemas
                                    │
                                    ▼
                          结构化表格输出字段信息
```

1. **定位**：在 `paths` 中搜索接口 URL
2. **提取**：从 `requestBody` / `responses` 获取 `$ref` 引用
3. **展开**：在 `components/schemas` 中查找引用的 Schema
4. **输出**：以字段名、类型、说明的结构化表格呈现

## 核心原则

| 原则 | 说明 |
|------|------|
| 唯数据源 | `default_OpenAPI.json` 是唯一参考，所有字段以此为准 |
| 禁止联网 | 不访问线上接口、不抓包 |
| 不猜测 | 文件里没有的字段绝不编造 |
| 容错 | 文件不存在时主动询问用户，不盲目继续 |

## 兼容性

基于标准的 `SKILL.md` 格式，兼容所有支持 Agent Skills 的 AI 编程工具：

- CodeBuddy
- Claude Code
- Cursor
- Codex
- Windsurf
- 通过 `npx skills add` 安装的其他工具

## 文件结构

```
api-doc-lookup/
├── SKILL.md                 # 核心 Skill 定义（YAML 元数据 + 工作流）
└── scripts/
    ├── update-openapi.js    # Node.js 跨平台拉取脚本
    └── update-openapi.bat   # Windows 拉取脚本
```

## License

MIT
