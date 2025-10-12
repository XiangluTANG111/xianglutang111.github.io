# 背景音乐设置指南

## 🎵 如何添加您的背景音乐

### 1. 准备音乐文件
- 推荐格式：MP3, OGG, WAV
- 文件大小：建议不超过 5MB
- 时长：建议 2-5 分钟的循环音乐
- 音量：建议预先调整到适中音量

### 2. 添加音乐文件
将您的音乐文件放入此 `music` 文件夹中，例如：
- `background-music.mp3`
- `background-music.ogg`
- `background-music.wav`

### 3. 更新HTML代码
在 `index.html` 文件中找到以下部分并更新：

```html
<audio id="backgroundMusic" loop preload="auto">
  <source src="music/background-music.mp3" type="audio/mpeg">
  <source src="music/background-music.ogg" type="audio/ogg">
  <source src="music/background-music.wav" type="audio/wav">
</audio>
```

### 4. 音乐推荐
- 选择轻柔、不干扰阅读的背景音乐
- 避免有歌词的音乐，以免分散注意力
- 考虑使用环境音乐、轻音乐或古典音乐

### 5. 版权注意事项
- 确保您有使用该音乐的权利
- 考虑使用免版税音乐
- 推荐资源：
  - [Freesound](https://freesound.org/)
  - [YouTube Audio Library](https://www.youtube.com/audiolibrary/music)
  - [Pixabay Music](https://pixabay.com/music/)

## 🎛️ 功能特性

### 首次访问询问
- 新访客会看到音乐启用询问弹窗
- 用户选择会被记住（使用localStorage）

### 音乐控制
- 右下角音乐控制按钮
- 点击切换播放/静音
- 页面切换时自动暂停/恢复

### 浏览器兼容性
- 支持现代浏览器的自动播放策略
- 处理用户交互要求
- 优雅降级处理

## 🔧 自定义设置

### 调整音量
在JavaScript代码中找到：
```javascript
backgroundMusic.volume = 0.3; // 30% 音量
```

### 修改弹窗延迟
```javascript
setTimeout(() => {
  musicModal.classList.remove('hidden');
}, 1000); // 1秒后显示弹窗
```

### 更改控制按钮位置
修改CSS类：
```html
<div id="musicControl" class="fixed bottom-4 right-4 z-50 hidden">
```

## 🎨 样式自定义

音乐控制按钮使用玻璃拟态效果，您可以在CSS中自定义：
- 颜色主题
- 按钮大小
- 悬停效果
- 动画效果


