@echo off
echo 🚀 启动CORS代理服务器...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 安装依赖包...
    npm install express cors axios dotenv
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查环境变量文件
if not exist ".env" (
    echo ⚠️  警告: 未找到.env文件
    echo 请创建.env文件并设置NUWA_API_KEY
    echo 示例: NUWA_API_KEY=your_api_key_here
    echo.
)

echo 🔧 启动代理服务器...
echo 📡 代理地址: http://localhost:3001
echo 💬 聊天端点: http://localhost:3001/api/chat
echo 🌐 健康检查: http://localhost:3001/api/health
echo.
echo 按 Ctrl+C 停止服务器
echo.

node cors-proxy.js








