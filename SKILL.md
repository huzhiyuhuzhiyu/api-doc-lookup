---
name: api-doc-lookup
description: Look up API request parameters and response data structures from project OpenAPI JSON doc. Trigger when user asks about API interfaces, request params, response fields, or API definitions. Uses default_OpenAPI.json as sole data source. Never access live API or capture network traffic.
---

# API 接口文档查询

## 概述

本 Skill 用于在项目中查询后端 API 接口的请求参数与返回数据结构。核心原则：**以项目根目录下的 `default_OpenAPI.json` 为唯一参考依据**，不访问线上接口、不抓包、不猜测。

## 触发场景

当用户提出以下意图时自动激活本 Skill：
- 查询某个接口的"数据结构""请求参数""返回字段""字段类型"
- 询问 API 接口定义、请求体格式、响应体结构
- 需要了解接口的枚举值、必填/可选字段

## 前置条件

- 当前项目根目录下必须存在 `default_OpenAPI.json` 文件（OpenAPI 3.0 规范）
- 若文件不存在，先引导用户使用 scripts 目录下的脚本拉取，或向用户确认接口信息
- **绝不**自行访问线上接口地址、抓包或编造字段

## 工作流

### Step 1：定位接口路径

在 `default_OpenAPI.json` 中搜索 `paths` 节点下的目标路径（如 `/api/erp/payment/balance/list`），获取该接口的请求方法（GET/POST）、`requestBody` 和 `responses` 的 `$ref` 引用。

### Step 2：提取 Schema 引用

接口定义中常见引用格式：
- 请求体：`#/components/schemas/「中文Schema名」`
- 响应体：`#/components/schemas/ActionResult«Page«「VO名」»»`

### Step 3：查找 Schema 定义

在 `components/schemas` 中定位 Step 2 提取的 Schema 名称，获取完整字段列表（字段名、类型 type、描述 description、枚举值 enum、格式 format）。

### Step 4：整理输出

以结构化表格呈现结果，示例格式：

| 字段 | 类型 | 说明 |
|------|------|------|
| `fieldName` | string | 字段描述 |

若涉及分页，说明 `records` 数组内才是实际数据。

## 常见返回包装

```
ActionResult«Page«XXXVO»»  →  data.records[] 内为实际数据
ActionResult«XXXVO»         →  data 内直接为对象
ActionResult«List«XXXVO»»   →  data 内为数组
```

## 更新接口文档

项目根目录的 `scripts/` 下提供两个更新脚本：

- **Windows**：双击运行 `scripts/update-openapi.bat`
- **跨平台**：`node scripts/update-openapi.js`

使用前需修改脚本中的 `OPENAPI_URL` 为项目实际的 OpenAPI 文档地址。

## 注意事项

- 若连续 2 次读取 `default_OpenAPI.json` 仍然失败，立即停止并询问用户
- 所有字段以文件内的结构、类型、注释为准
- 不要自行编造或推测字段名和类型
