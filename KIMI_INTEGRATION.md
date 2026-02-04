# Kimi-K2.5 ModelScope 集成指南

此模块为 OpenClaw 添加了对魔搭社区 moonshotai/Kimi-K2.5 模型的支持，这是一个强大的多模态AI模型，支持文本和图像理解。

## 特性

- 支持 moonshotai/Kimi-K2.5 模型
- 支持图像理解功能
- 与 OpenClaw 的模型切换系统无缝集成
- OpenAI兼容接口

## 配置信息

- **模型ID**: moonshotai/Kimi-K2.5
- **API端点**: https://api-inference.modelscope.cn/v1
- **API密钥**: ms-70f49a15-9dd0-46cd-b232-edd68d2513f7
- **最大Token**: 32768
- **功能**: 文本生成、图像理解、多模态处理

## 安装步骤

### 1. 设置API密钥

将API密钥导出为环境变量：

```bash
export MODELScope_API_KEY="ms-70f49a15-9dd0-46cd-b232-edd68d2513f7"
```

### 2. 运行Kimi集成脚本

```bash
node kimi_integration.js
```

### 3. 重启OpenClaw

```bash
openclaw gateway
```

## 使用方法

### 在聊天中使用Kimi模型

```
/model modelscope/kimi-k2.5    # 切换到Kimi-K2.5模型
/model list                     # 查看所有可用模型
/model status                   # 查看当前模型状态
```

### 示例用法

Kimi模型特别适用于：

1. **文本分析** - 复杂的文本理解和分析任务
2. **图像理解** - 描述和分析图像内容
3. **多模态任务** - 结合文本和图像的复杂任务

## 配置详情

集成后会在配置中添加以下内容：

```json
{
  "models": {
    "providers": {
      "modelscope": {
        "enabled": true,
        "baseUrl": "https://api-inference.modelscope.cn/v1",
        "apiKey": "ms-70f49a15-9dd0-46cd-b232-edd68d2513f7",
        "defaultModel": "moonshotai/Kimi-K2.5",
        "models": {
          "moonshotai/Kimi-K2.5": {
            "name": "Kimi-K2.5",
            "description": "Moonshot AI Kimi模型，支持高级图像理解和文本处理",
            "maxTokens": 32768,
            "capabilities": ["text-generation", "image-understanding", "multimodal"],
            "parameters": {
              "temperature": 0.7,
              "top_p": 0.9
            }
          }
        }
      }
    }
  }
}
```

## API兼容性

Kimi-K2.5模型通过魔搭平台提供OpenAI兼容接口，支持：

- `client.chat.completions.create()` - 聊天完成接口
- 多种消息类型（文本、图像）
- 流式响应
- 自定义参数

## 故障排除

### 常见问题

1. **API密钥错误** - 确认MODELScope_API_KEY环境变量设置正确
2. **模型不可用** - 确认moonshotai/Kimi-K2.5模型在魔搭平台可用
3. **网络连接问题** - 检查网络连接到api-inference.modelscope.cn

### 测试连接

可以使用以下简单测试来验证连接：

```javascript
// 测试连接
const { KimiModelScopeAdapter } = require('./kimi_modelscope_adapter.js');
const adapter = new KimiModelScopeAdapter('ms-70f49a15-9dd0-46cd-b232-edd68d2513f7');

// 简单测试
try {
  const result = await adapter.callSimple("你好，这是一个测试");
  console.log("连接成功:", result);
} catch (error) {
  console.error("连接失败:", error);
}
```

## 注意事项

- 遵循魔搭平台的使用条款
- 注意API调用的限制和费用
- Kimi模型支持高达32768个token的上下文长度
- 支持多模态输入（文本+图像）

## 更新日志

### v1.0.0
- 集成 moonshotai/Kimi-K2.5 模型
- 支持图像理解和多模态处理
- OpenAI兼容接口实现
- 与OpenClaw模型系统完全集成

---
数据杀手 | 为魔人布欧定制 | Kimi-K2.5模型支持