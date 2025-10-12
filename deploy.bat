@echo off
echo ========================================
echo    Xianglu TANG Personal Website
echo    GitHub Pages Deployment Helper
echo ========================================
echo.

echo 正在准备部署文件...
echo.

echo 检查文件是否存在:
if exist "index.html" (
    echo ✓ index.html - 主页
) else (
    echo ✗ index.html - 缺失
)

if exist "posts.html" (
    echo ✓ posts.html - 研究项目页面
) else (
    echo ✗ posts.html - 缺失
)

if exist "blog.html" (
    echo ✓ blog.html - 博客页面
) else (
    echo ✗ blog.html - 缺失
)

if exist "xianglu.jpg" (
    echo ✓ xianglu.jpg - 个人照片
) else (
    echo ✗ xianglu.jpg - 缺失
)

if exist "nature.jpg" (
    echo ✓ nature.jpg - 背景图片
) else (
    echo ✗ nature.jpg - 缺失
)

echo.
echo ========================================
echo 部署说明:
echo ========================================
echo.
echo 1. 访问你的GitHub仓库:
echo    https://github.com/XiangluTANG111/xianglutang111.github.io
echo.
echo 2. 点击 "Add file" → "Upload files"
echo.
echo 3. 拖拽以下文件到上传区域:
echo    - index.html
echo    - posts.html  
echo    - blog.html
echo    - xianglu.jpg
echo    - nature.jpg
echo.
echo 4. 添加提交信息: "Update personal website with complete portfolio"
echo.
echo 5. 点击 "Commit changes"
echo.
echo 6. 进入仓库设置 → Pages → 选择 "Deploy from a branch"
echo    选择 "main" 分支和 "/ (root)" 文件夹
echo.
echo 7. 等待1-5分钟，然后访问:
echo    https://xianglutang111.github.io
echo.
echo ========================================
echo 部署完成后，你的网站将包含:
echo ========================================
echo ✓ 响应式设计，支持手机和桌面
echo ✓ 研究项目展示页面
echo ✓ 博客功能
echo ✓ 现代化UI界面
echo ✓ 专业学术风格
echo.
echo 按任意键退出...
pause >nul
