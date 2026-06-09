@echo off
setlocal

:: ====================== 按需修改 ======================
set "OPENAPI_URL=http://your-api-host.com/v3/api-docs"
:: ======================================================

echo 正在拉取最新 OpenAPI 数据...
curl -s -o default_OpenAPI.json "%OPENAPI_URL%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 更新完成！default_OpenAPI.json 已同步为最新接口文档。
) else (
    echo.
    echo ❌ 更新失败，请检查网络连接和 OPENAPI_URL 配置。
)

echo.
pause
