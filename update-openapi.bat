@echo off
setlocal

:: ====================== 你只需要改这里 ======================
set "OPENAPI_URL=http://doc.zgt.test.iiot.nbjuxuan.com/v3/api-docs"
:: ==========================================================

echo 正在拉取最新 OpenAPI 数据...
curl -s -o default_OpenAPI.json "%OPENAPI_URL%"

echo.
echo ✅ 更新完成！default_OpenAPI.json 已同步为最新接口文档
echo.
pause