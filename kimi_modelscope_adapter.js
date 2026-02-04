/**
 * Kimi-K2.5 ModelScope Adapter for OpenClaw
 * 专门针对 moonshotai/Kimi-K2.5 模型的适配器
 */

import OpenAI from 'openai';

class KimiModelScopeAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.MODELScope_API_KEY;
    this.baseUrl = 'https://api-inference.modelscope.cn/v1';
    this.model = 'moonshotai/Kimi-K2.5';
    
    if (!this.apiKey) {
      throw new Error('ModelScope API Key is required for Kimi-K2.5 model');
    }
    
    // 初始化OpenAI兼容客户端
    this.client = new OpenAI({
      baseURL: this.baseUrl,
      apiKey: this.apiKey,
    });
  }

  /**
   * 调用Kimi-K2.5模型
   * @param {Array} messages - 对话消息数组
   * @param {Object} options - 额外选项
   */
  async callKimiModel(messages, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        stream: options.stream || false,
        ...options
      });

      if (options.stream) {
        // 处理流式响应
        const chunks = [];
        for await (const chunk of response) {
          if (chunk.choices && chunk.choices[0]) {
            const content = chunk.choices[0].delta?.content;
            if (content) {
              chunks.push(content);
              if (options.onStreamChunk) {
                options.onStreamChunk(content);
              }
            }
          }
        }
        return { content: chunks.join(''), model: this.model };
      } else {
        // 处理非流式响应
        return {
          content: response.choices[0]?.message?.content || '',
          model: response.model,
          usage: response.usage
        };
      }
    } catch (error) {
      console.error('Error calling Kimi-K2.5 model:', error);
      throw error;
    }
  }

  /**
   * 处理带图像的消息
   */
  async callWithImage(userText, imageUrl, options = {}) {
    const messages = [{
      role: 'user',
      content: [
        { type: 'text', text: userText },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    }];

    return this.callKimiModel(messages, options);
  }

  /**
   * 简单文本对话
   */
  async callSimple(text, options = {}) {
    const messages = [{
      role: 'user',
      content: text
    }];

    return this.callKimiModel(messages, options);
  }
}

/**
 * 注册Kimi模型到OpenClaw
 */
async function registerKimiModel() {
  console.log('Registering Kimi-K2.5 model for OpenClaw...');
  
  const kimiAdapter = new KimiModelScopeAdapter();
  
  const kimiModelConfig = {
    id: 'modelscope/kimi-k2.5',
    name: 'Kimi-K2.5 (ModelScope)',
    description: 'Moonshot AI Kimi模型，支持图像理解',
    capabilities: ['text-generation', 'image-understanding'],
    adapter: kimiAdapter
  };
  
  console.log('Kimi-K2.5 model registered successfully!');
  return kimiModelConfig;
}

// 导出适配器和注册函数
export { KimiModelScopeAdapter, registerKimiModel };

// 如果直接运行此文件
if (import.meta.url === new URL(import.meta.url, 'file:').href) {
  registerKimiModel().catch(console.error);
}