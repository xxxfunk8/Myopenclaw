# OpenClaw x ModelScope 集成

为 OpenClaw 添加阿里云魔搭(ModelScope)社区模型支持的完整解决方案。

## 项目概述

这个集成项目为 OpenClaw 添加了对阿里云魔搭社区模型的支持，让您可以使用魔搭平台上提供的各种模型，包括但不限于：

- Qwen Turbo - 快速、经济实惠的模型
- Qwen Plus - 性能平衡的模型  
- Qwen Max - 超大规模模型
- 长上下文模型
- 文本嵌入模型
- **Kimi-K2.5** - Moonshot AI的高级多模态模型（支持图像理解）

## 文件结构

```
├── modelscope_adapter.js              # ModelScope API 适配器
├── openclaw_modelscope_integration.js # 集成安装脚本
├── modelscope_provider_config.js      # Provider 配置模板
├── kimi_modelscope_adapter.js         # Kimi-K2.5 模型适配器
├── kimi_modelscope_config.js          # Kimi-K2.5 模型配置
├── kimi_integration.js                # Kimi模型集成脚本
├── MODELSCOPE_INTEGRATION.md         # 详细使用文档
├── KIMI_INTEGRATION.md               # Kimi模型使用指南
└── README.md                         # 本文件
```

## 安装与配置

### 1. 获取魔搭API密钥

访问 [阿里云DashScope](https://dashscope.console.aliyun.com/) 获取API密钥。

### 2. 设置环境变量

```bash
export MODELScope_API_KEY="your-dashscope-api-key"
```

### 3. 集成到OpenClaw

运行集成脚本：

```bash
node openclaw_modelscope_integration.js
```

### 4. 手动配置（可选）

或者手动将 `modelscope_provider_config.js` 中的配置合并到您的 OpenClaw 配置文件中。

## 使用方法

集成完成后，您可以在 OpenClaw 中使用以下命令：

```
/model list                           # 查看所有可用模型
/model modelscope/qwen-plus          # 切换到魔搭Qwen Plus模型
/model modelscope/qwen-turbo         # 切换到魔搭Qwen Turbo模型
/model status                         # 查看当前模型状态
```

## 技术细节

- **API兼容性**: 适配魔搭(DashScope) API 和魔搭推理API
- **模型支持**: Qwen系列模型、Kimi-K2.5及其他魔搭模型
- **配置方式**: 通过环境变量和配置文件
- **集成深度**: 与OpenClaw模型系统完全集成
- **多模态支持**: 支持文本和图像理解（Kimi-K2.5）

## 注意事项

1. 需要有效的魔搭API密钥
2. 遵循魔搭平台的使用条款
3. 注意API调用的费用（如有）
4. API密钥应妥善保管，不要泄露

## 故障排除

常见问题及解决方案：

- **API密钥无效**: 检查API密钥是否正确设置
- **模型不可用**: 确认API密钥有调用相应模型的权限
- **网络连接问题**: 检查网络连接和防火墙设置

## 许可证

此集成模块遵循与OpenClaw相同的许可证。

---

**数据杀手系统** | 为魔人布欧定制 | 支持魔搭社区模型接入