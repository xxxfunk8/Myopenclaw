<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>护理助手数据管理系统 - 数据杀手</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        h1 {
            margin: 0;
            color: #2c3e50;
        }
        
        .status-indicator {
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .status-active {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .card h3 {
            margin-top: 0;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        input, select, button {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        button {
            background-color: #3498db;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background-color: #2980b9;
        }
        
        .section {
            margin: 20px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f8f9fa;
        }
        
        .notification {
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            display: none;
        }
        
        .notification.success {
            background-color: #d4edda;
            color: #155724;
            display: block;
        }
        
        .notification.error {
            background-color: #f8d7da;
            color: #721c24;
            display: block;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>护理助手数据管理系统</h1>
            <div class="status-indicator status-active">数据杀手在线</div>
        </header>
        
        <div class="dashboard">
            <div class="card">
                <h3>登录状态</h3>
                <div id="loginStatus">未登录</div>
                <div class="section">
                    <h4>登录信息</h4>
                    <div class="login-form">
                        <input type="email" id="username" placeholder="用户名/邮箱" value="13158312099@nurse.com">
                        <input type="password" id="password" placeholder="密码" value="qwertyuiop890">
                        <button onclick="performLogin()">登录系统</button>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>定时任务</h3>
                <div class="section">
                    <label>频率: 
                        <select id="scheduleFreq">
                            <option value="daily">每日</option>
                            <option value="weekly">每周</option>
                            <option value="monthly">每月</option>
                        </select>
                    </label>
                </div>
                <div class="section">
                    <label>时间: 
                        <input type="time" id="scheduleTime" value="09:00">
                    </label>
                </div>
                <button onclick="setupSchedule()">设置定时下载</button>
                <div id="scheduleStatus" style="margin-top: 10px;"></div>
            </div>
            
            <div class="card">
                <h3>下载管理</h3>
                <div class="section">
                    <button onclick="downloadPDFs()">下载最新PDF</button>
                </div>
                <div class="section">
                    <button onclick="listDownloads()">查看已下载文件</button>
                </div>
                <div id="downloadStatus" style="margin-top: 10px;"></div>
            </div>
        </div>
        
        <div class="card">
            <h3>系统说明</h3>
            <p>当前系统环境说明：</p>
            <ul>
                <li>系统运行在GitHub Codespace上</li>
                <li>公网访问地址：<a href="https://glorious-garbanzo-ww9q5p46vv6c9rj6-18789.app.github.dev/chat?session=main" target="_blank">https://glorious-garbanzo-ww9q5p46vv6c9rj6-18789.app.github.dev/chat?session=main</a></li>
                <li>由于环境限制，无法直接访问外部浏览器自动化</li>
                <li>需要在支持完整浏览器功能的环境中运行实际的登录和下载操作</li>
                <li>本系统提供了一套完整的后端接口和前端界面，可在适当环境中部署运行</li>
            </ul>
            
            <h4>部署建议</h4>
            <p>要在完整功能环境中运行，请：</p>
            <ol>
                <li>在支持Chrome/Chromium的服务器上部署此系统</li>
                <li>安装Puppeteer或Selenium WebDriver</li>
                <li>配置适当的浏览器自动化脚本</li>
                <li>设置定时任务（cron job）来定期执行PDF下载</li>
            </ol>
        </div>
        
        <div id="notification" class="notification"></div>
        
        <footer>
            <p>数据杀手系统 v1.0 | 为魔人布欧定制</p>
            <p>技术栈：PHP + CSS + JavaScript</p>
        </footer>
    </div>

    <script>
        // 显示通知
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }
        
        // 执行登录
        async function performLogin() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('请输入用户名和密码', 'error');
                return;
            }
            
            try {
                const response = await fetch('login_handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('loginStatus').textContent = `已登录: ${username}`;
                    showNotification('登录信息已记录');
                } else {
                    showNotification(result.error || '登录失败', 'error');
                }
            } catch (error) {
                showNotification('网络错误: ' + error.message, 'error');
            }
        }
        
        // 设置定时任务
        async function setupSchedule() {
            const freq = document.getElementById('scheduleFreq').value;
            const time = document.getElementById('scheduleTime').value;
            
            try {
                const response = await fetch('scheduler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'add_job',
                        job: {
                            type: 'pdf_download',
                            frequency: freq,
                            time: time,
                            params: {
                                username: document.getElementById('username').value
                            }
                        }
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('scheduleStatus').innerHTML = `
                        <div style="color: #27ae60;">定时任务已设置</div>
                        <div>频率: ${freq}</div>
                        <div>时间: ${time}</div>
                    `;
                    showNotification('定时任务设置成功');
                } else {
                    showNotification(result.error || '设置失败', 'error');
                }
            } catch (error) {
                showNotification('网络错误: ' + error.message, 'error');
            }
        }
        
        // 下载PDF
        async function downloadPDFs() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('请先输入登录信息', 'error');
                return;
            }
            
            try {
                const response = await fetch('pdf_downloader.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'download_pdfs',
                        credentials: {
                            username: username,
                            password: password
                        }
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('downloadStatus').innerHTML = `
                        <div style="color: #27ae60;">${result.message}</div>
                        <div>文件数量: ${result.count}</div>
                        <div>时间: ${result.timestamp}</div>
                    `;
                    showNotification(`成功下载 ${result.count} 个PDF文件`);
                } else {
                    showNotification(result.error || '下载失败', 'error');
                }
            } catch (error) {
                showNotification('网络错误: ' + error.message, 'error');
            }
        }
        
        // 列出已下载文件
        async function listDownloads() {
            try {
                const response = await fetch('pdf_downloader.php');
                const result = await response.json();
                
                if (result.success) {
                    let fileList = '<h4>已下载文件列表:</h4><table>';
                    fileList += '<tr><th>文件名</th><th>大小</th><th>修改时间</th></tr>';
                    
                    result.files.forEach(file => {
                        fileList += `<tr>
                            <td>${file.filename}</td>
                            <td>${Math.round(file.size/1024)} KB</td>
                            <td>${file.modified}</td>
                        </tr>`;
                    });
                    
                    fileList += '</table>';
                    
                    document.getElementById('downloadStatus').innerHTML = fileList;
                    
                    if (result.count === 0) {
                        showNotification('暂无已下载文件');
                    }
                } else {
                    showNotification(result.error || '获取文件列表失败', 'error');
                }
            } catch (error) {
                showNotification('网络错误: ' + error.message, 'error');
            }
        }
    </script>
</body>
</html>