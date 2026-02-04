/*
 * OpenClaw ModelScope Provider Configuration
 * 
 * 使用方法:
 * 1. 将此配置合并到您的 OpenClaw 配置中
 * 2. 设置 MODELScope_API_KEY 环境变量
 * 3. 重启 OpenClaw 服务
 */

// 示例配置补丁
const modelScopeProviderConfig = {
  models: {
    providers: {
      modelscope: {
        enabled: true,
        baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
        apiKey: process.env.MODELScope_API_KEY || '',  // 通过环境变量提供
        defaultModel: 'qwen-plus',
        // 模型映射
        models: {
          'qwen-turbo': {
            name: 'Qwen Turbo',
            description: '快速、经济实惠的模型，适合简单任务',
            maxTokens: 8192,
            capabilities: ['text-generation']
          },
          'qwen-plus': {
            name: 'Qwen Plus', 
            description: '性能平衡的模型，适合中等复杂度任务',
            maxTokens: 8192,
            capabilities: ['text-generation']
          },
          'qwen-max': {
            name: 'Qwen Max',
            description: '超大规模模型，适合复杂、多步骤任务', 
            maxTokens: 32768,
            capabilities: ['text-generation']
          },
          'qwen-max-longcontext': {
            name: 'Qwen Max LongContext',
            description: '支持长上下文的Qwen Max版本',
            maxTokens: 32768,
            capabilities: ['text-generation', 'long-context']
          }
        }
      }
    },
    defaults: {
      models: {
        'modelscope/qwen-turbo': {
          description: '魔搭 - Qwen Turbo',
          provider: 'modelscope',
          model: 'qwen-turbo'
        },
        'modelscope/qwen-plus': {
          description: '魔搭 - Qwen Plus', 
          provider: 'modelscope',
          model: 'qwen-plus'
        },
        'modelscope/qwen-max': {
          description: '魔搭 - Qwen Max',
          provider: 'modelscope', 
          model: 'qwen-max'
        },
        'modelscope/qwen-max-longcontext': {
          description: '魔搭 - Qwen Max LongContext',
          provider: 'modelscope',
          model: 'qwen-max-longcontext'
        }
      }
    }
  }
};

// 使用说明
const usageInstructions = `
# 设置API密钥
export MODELScope_API_KEY="your-api-key-here"

# 启动OpenClaw
openclaw gateway

# 在聊天中使用魔搭模型
/model list                           # 查看所有模型
/model modelscope/qwen-plus          # 使用魔搭Qwen Plus
/model modelscope/qwen-turbo         # 使用魔搭Qwen Turbo
`;

console.log("ModelScope Provider Configuration Ready!");
console.log("To use: Merge this configuration with your OpenClaw config");

module.exports = { modelScopeProviderConfig, usageInstructions };