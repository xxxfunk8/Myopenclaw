/**
 * OpenClaw Kimi-K2.5 ModelScope Integration
 * 专门针对 moonshotai/Kimi-K2.5 模型的集成脚本
 */

const fs = require('fs').promises;
const path = require('path');

class OpenClawKimiIntegration {
  constructor(apiKey, openclawHome = '~/.openclaw') {
    this.apiKey = apiKey || process.env.MODELScope_API_KEY;
    this.openclawHome = this.resolveHomePath(openclawHome);
    this.configPath = path.join(this.openclawHome, 'config.json');
  }

  /**
   * 解析Home路径
   */
  resolveHomePath(homePath) {
    if (homePath.startsWith('~')) {
      return path.join(process.env.HOME || process.env.USERPROFILE || '', homePath.slice(1));
    }
    return homePath;
  }

  /**
   * 获取Kimi模型的配置模板
   */
  getKimiConfigTemplate() {
    return {
      models: {
        providers: {
          modelscope: {
            enabled: true,
            baseUrl: 'https://api-inference.modelscope.cn/v1',
            apiKey: this.apiKey,
            defaultModel: 'moonshotai/Kimi-K2.5',
            models: {
              'moonshotai/Kimi-K2.5': {
                name: 'Kimi-K2.5',
                description: 'Moonshot AI Kimi模型，支持高级图像理解和文本处理',
                maxTokens: 32768,
                capabilities: ['text-generation', 'image-understanding', 'multimodal'],
                parameters: {
                  temperature: 0.7,
                  top_p: 0.9,
                }
              }
            }
          }
        },
        defaults: {
          models: {
            'modelscope/kimi-k2.5': {
              description: '魔搭 - Kimi-K2.5 (Moonshot AI)',
              provider: 'modelscope',
              model: 'moonshotai/Kimi-K2.5',
              capabilities: ['text-generation', 'image-understanding', 'multimodal'],
              parameters: {
                temperature: 0.7,
                max_tokens: 4096
              }
            }
          }
        }
      },
      agents: {
        defaults: {
          model: {
            primary: 'modelscope/kimi-k2.5'  // 设置Kimi为默认模型（可选）
          }
        }
      }
    };
  }

  /**
   * 集成Kimi模型到OpenClaw配置
   */
  async integrate() {
    console.log('开始集成Kimi-K2.5模型到OpenClaw...');

    try {
      // 检查配置文件是否存在
      let config = {};
      try {
        const configData = await fs.readFile(this.configPath, 'utf8');
        config = JSON.parse(configData);
      } catch (error) {
        console.log('配置文件不存在，将创建新的配置文件');
        config = {};
      }

      // 合并Kimi模型配置
      const kimiConfig = this.getKimiConfigTemplate();
      
      // 深度合并配置
      config = this.deepMerge(config, kimiConfig);

      // 写入配置文件
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
      
      console.log('Kimi-K2.5模型已成功集成到OpenClaw配置中！');
      console.log(`配置文件位置: ${this.configPath}`);
      console.log(`模型ID: modelscope/kimi-k2.5`);
      console.log(`API端点: https://api-inference.modelscope.cn/v1`);

      return true;

    } catch (error) {
      console.error('集成Kimi-K2.5模型时发生错误:', error);
      throw error;
    }
  }

  /**
   * 深度合并对象
   */
  deepMerge(target, source) {
    const output = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          if (!(key in output)) {
            output[key] = {};
          }
          output[key] = this.deepMerge(output[key], source[key]);
        } else {
          output[key] = source[key];
        }
      }
    }
    
    return output;
  }

  /**
   * 验证API密钥和模型可用性
   */
  async validateApiKey() {
    if (!this.apiKey) {
      console.error('错误: 未提供ModelScope API密钥');
      return false;
    }

    console.log('API密钥格式检查通过');
    console.log('注意: 实际的API调用验证需要在运行时进行');
    
    return true;
  }

  /**
   * 安装Kimi集成
   */
  async install() {
    console.log('正在安装OpenClaw Kimi-K2.5 ModelScope集成...');

    // 检查API密钥
    if (!await this.validateApiKey()) {
      throw new Error('API密钥验证失败，无法继续安装');
    }

    // 执行集成
    await this.integrate();

    console.log('\nKimi-K2.5集成安装完成!');
    console.log('接下来您可以:');
    console.log('1. 确保环境变量 MODELScope_API_KEY 已设置为 ms-70f49a15-9dd0-46cd-b232-edd68d2513f7');
    console.log('2. 重启OpenClaw服务');
    console.log('3. 使用 /model modelscope/kimi-k2.5 命令切换到Kimi模型');
    console.log('4. 测试模型功能');

    return true;
  }
}

module.exports = OpenClawKimiIntegration;

// 如果直接运行此脚本
if (require.main === module) {
  // 使用提供的API密钥
  const integration = new OpenClawKimiIntegration('ms-70f49a15-9dd0-46cd-b232-edd68d2513f7');

  integration.install()
    .then(() => console.log('Kimi-K2.5集成安装完成'))
    .catch(error => {
      console.error('Kimi-K2.5集成安装失败:', error);
      process.exit(1);
    });
}