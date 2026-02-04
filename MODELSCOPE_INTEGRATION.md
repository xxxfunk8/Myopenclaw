# OpenClaw ModelScope 集成指南

此模块为 OpenClaw 添加了对阿里云魔搭(ModelScope)社区模型的支持，让您能够使用魔搭平台上的免费和付费模型。

## 功能特性

- 支持多种魔搭模型（Qwen系列等）
- 与 OpenClaw 的模型切换系统无缝集成
- 支持模型配置和别名管理
- 提供API密钥验证功能

## 安装步骤

### 1. 获取API密钥

1. 访问 [阿里云DashScope](https://dashscope.console.aliyun.com/)
2. 注册并登录账户
3. 在控制台中创建API密钥
4. 记住您的API密钥，稍后会用到

### 2. 设置环境变量

```bash
export MODELScope_API_KEY="您的API密钥"
```

或者在启动OpenClaw之前设置：

```bash
MODELScope_API_KEY=您的API密钥 openclaw gateway
```

### 3. 集成到OpenClaw

运行集成脚本：

```bash
node openclaw_modelscope_integration.js
```

### 4. 配置OpenClaw

集成脚本会自动修改OpenClaw的配置文件，添加ModelScope提供商支持。

## 支持的模型

- `modelscope/qwen-turbo` - Qwen Turbo，快速经济模型
- `modelscope/qwen-plus` - Qwen Plus，平衡性能模型  
- `modelscope/qwen-max` - Qwen Max，大规模复杂任务模型
- `modelscope/qwen-max-longcontext` - 支持长上下文的Qwen Max

## 使用方法

### 在聊天中切换模型

```
/model list                    # 查看所有可用模型
/model modelscope/qwen-plus    # 切换到魔搭Qwen Plus模型
/model modelscope/qwen-turbo   # 切换到魔搭Qwen Turbo模型
/model status                  # 查看当前模型状态
```

### 在配置中设置默认模型

您也可以在OpenClaw配置中设置默认使用魔搭模型：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "modelscope/qwen-plus"
      }
    }
  }
}
```

## 配置文件说明

集成后会在 `~/.openclaw/config.json` 中添加以下配置：

```json
{
  "models": {
    "providers": {
      "modelscope": {
        "enabled": true,
        "baseUrl": "https://dashscope.aliyuncs.com/api/v1",
        "apiKey": "",  // 将通过环境变量提供
        "defaultModel": "qwen-plus"
      }
    },
    "defaults": {
      "models": {
        "modelscope/qwen-turbo": {
          "description": "Qwen Turbo - 快速经济模型",
          "capabilities": ["text-generation"]
        },
        "modelscope/qwen-plus": {
          "description": "Qwen Plus - 平衡性能模型",
          "capabilities": ["text-generation"]
        }
      }
    }
  }
}
```

## 故障排除

### API密钥问题

如果遇到认证错误，请检查：

1. API密钥是否正确设置
2. API密钥是否具有相应权限
3. 环境变量是否正确传递给OpenClaw

### 模型不可用

如果模型无法使用，请确认：

1. 您的API密钥有调用相应模型的权限
2. 模型名称拼写正确
3. 网络连接正常

## 注意事项

- 遵循魔搭平台的使用条款和限制
- 注意API调用的费用（免费额度和付费）
- 妥善保管API密钥，不要泄露

## 更新日志

### v1.0.0
- 初始版本，支持基本的魔搭模型调用
- 集成到OpenClaw模型系统
- 支持常用的Qwen系列模型

---
数据杀手 | 为魔人布欧定制