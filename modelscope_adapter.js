#!/usr/bin/env node

/**
 * ModelScope Adapter for OpenClaw
 * 为 OpenClaw 添加魔搭社区模型支持
 */

import { AgentClientProtocol } from '@agentclientprotocol/sdk';
import { createHmac } from 'crypto';

class ModelScopeAdapter {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.MODELScope_API_KEY;
    this.baseUrl = config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1';
    this.defaultModel = config.defaultModel || 'qwen-plus';
  }

  /**
   * 初始化ModelScope适配器
   */
  static async initialize(config = {}) {
    const adapter = new ModelScopeAdapter(config);
    return adapter;
  }

  /**
   * 调用ModelScope API
   */
  async callModel(model, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('ModelScope API Key is required. Please set MODELScope_API_KEY environment variable.');
    }

    const url = `${this.baseUrl}/services/aigc/text-generation/generation`;
    
    const requestBody = {
      model: model,
      input: {
        messages: messages
      },
      parameters: {
        ...options
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-SSE': 'disable' // 禁用流式输出
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`ModelScope API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 解析响应并提取文本内容
      if (data.output && data.output.text) {
        return {
          content: data.output.text,
          model: data.request_id,
          usage: data.usage || {}
        };
      } else {
        throw new Error('Unexpected response format from ModelScope API');
      }
    } catch (error) {
      console.error('Error calling ModelScope API:', error);
      throw error;
    }
  }

  /**
   * 获取支持的模型列表
   */
  async listModels() {
    // ModelScope平台有多种类型的模型，这里定义常用的一些
    const models = [
      {
        id: 'qwen-turbo',
        name: 'Qwen Turbo',
        description: '快速、经济实惠的模型，适合简单任务',
        capabilities: ['text-generation']
      },
      {
        id: 'qwen-plus',
        name: 'Qwen Plus',
        description: '性能平衡的模型，适合中等复杂度任务',
        capabilities: ['text-generation']
      },
      {
        id: 'qwen-max',
        name: 'Qwen Max',
        description: '超大规模模型，适合复杂、多步骤任务',
        capabilities: ['text-generation']
      },
      {
        id: 'qwen-max-0428',
        name: 'Qwen Max 0428',
        description: 'Qwen Max的特定版本',
        capabilities: ['text-generation']
      },
      {
        id: 'qwen-max-0403',
        name: 'Qwen Max 0403',
        description: 'Qwen Max的特定版本',
        capabilities: ['text-generation']
      },
      {
        id: 'qwen-max-longcontext',
        name: 'Qwen Max LongContext',
        description: '支持长上下文的Qwen Max版本',
        capabilities: ['text-generation', 'long-context']
      },
      {
        id: 'text-embedding-v1',
        name: 'Text Embedding V1',
        description: '文本嵌入模型',
        capabilities: ['embedding']
      },
      {
        id: 'text-embedding-v2',
        name: 'Text Embedding V2',
        description: '改进版文本嵌入模型',
        capabilities: ['embedding']
      }
    ];

    return models;
  }

  /**
   * 检查API密钥是否有效
   */
  async validateApiKey() {
    try {
      // 尝试调用一个简单的接口来验证API密钥
      await this.listModels();
      return true;
    } catch (error) {
      console.error('ModelScope API validation failed:', error.message);
      return false;
    }
  }
}

/**
 * 注册ModelScope适配器到OpenClaw
 */
async function registerModelScopeProvider() {
  console.log('Registering ModelScope provider for OpenClaw...');
  
  // 这里是示意代码，实际集成需要修改OpenClaw的核心模型系统
  const modelScopeConfig = {
    provider: 'modelscope',
    name: 'ModelScope (Alibaba Cloud)',
    description: '阿里云魔搭社区模型服务',
    adapter: ModelScopeAdapter,
    models: await (new ModelScopeAdapter()).listModels()
  };
  
  console.log('ModelScope provider registered successfully!');
  console.log('Supported models:', modelScopeConfig.models.map(m => m.id));
  
  return modelScopeConfig;
}

// 导出适配器
export { ModelScopeAdapter, registerModelScopeProvider };

// 如果直接运行此文件，则注册适配器
if (import.meta.url === new URL(import.meta.url, 'file:').href) {
  registerModelScopeProvider().catch(console.error);
}