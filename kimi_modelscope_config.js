/*
 * Kimi-K2.5 ModelScope Integration Configuration
 * 
 * 特定于 moonshotai/Kimi-K2.5 模型的配置
 */

const kimiModelConfig = {
  models: {
    providers: {
      modelscope: {
        enabled: true,
        baseUrl: 'https://api-inference.modelscope.cn/v1',
        apiKey: process.env.MODELScope_API_KEY || 'ms-70f49a15-9dd0-46cd-b232-edd68d2513f7',  // 使用您提供的API密钥
        defaultModel: 'moonshotai/Kimi-K2.5',
        models: {
          'moonshotai/Kimi-K2.5': {
            name: 'Kimi-K2.5',
            description: 'Moonshot AI Kimi模型，支持高级图像理解和文本处理',
            maxTokens: 32768,
            capabilities: ['text-generation', 'image-understanding', 'multimodal'],
            // 特定于Kimi模型的参数
            parameters: {
              temperature: 0.7,
              top_p: 0.9,
            }
          }
        }
      }
    },
    defaults: {
      // Kimi模型的特定配置
      'modelscope/kimi-k2.5': {
        description: '魔搭 - Kimi-K2.5 (Moonshot AI)',
        provider: 'modelscope',
        model: 'moonshotai/Kimi-K2.5',
        capabilities: ['text-generation', 'image-understanding', 'multimodal'],
        // 默认参数
        parameters: {
          temperature: 0.7,
          max_tokens: 4096
        }
      }
    }
  }
};

// 测试Kimi模型的函数
async function testKimiModel() {
  console.log('Testing Kimi-K2.5 model connection...');
  
  // 注意：这里仅作演示，实际测试需要在Node.js环境中运行
  console.log('Kimi-K2.5 model configured with:');
  console.log('- Model ID: moonshotai/Kimi-K2.5');
  console.log('- Base URL: https://api-inference.modelscope.cn/v1');
  console.log('- API Key: Provided');
  console.log('- Capabilities: text-generation, image-understanding, multimodal');
  
  console.log('Configuration ready for OpenClaw integration!');
}

// 使用示例
const kimiUsageExample = `
# 使用Kimi-K2.5模型的示例
const { KimiModelScopeAdapter } = require('./kimi_modelscope_adapter.js');

// 初始化适配器
const kimiAdapter = new KimiModelScopeAdapter('ms-70f49a15-9dd0-46cd-b232-edd68d2513f7');

// 简单文本调用
const result = await kimiAdapter.callSimple("你好，请介绍一下自己");

// 带图像的调用
const imageResult = await kimiAdapter.callWithImage(
  "请描述这张图片", 
  "https://modelscope.oss-cn-beijing.aliyuncs.com/demo/images/audrey_hepburn.jpg"
);
`;

console.log("Kimi-K2.5 ModelScope Configuration Ready!");
console.log("Model: moonshotai/Kimi-K2.5");
console.log("API Key: ms-70f49a15-9dd0-46cd-b232-edd68d2513f7");

module.exports = { kimiModelConfig, testKimiModel, kimiUsageExample };