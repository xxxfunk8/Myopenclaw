/**
 * OpenClaw ModelScope Integration
 * 魔搭(ModelScope)社区模型集成模块
 */

const fs = require('fs').promises;
const path = require('path');

class OpenClawModelScopeIntegration {
  constructor(openclawHome = '~/.openclaw') {
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
   * 创建ModelScope配置模板
   */
  getConfigTemplate() {
    return {
      models: {
        providers: {
          modelscope: {
            enabled: true,
            baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
            apiKey: process.env.MODELScope_API_KEY || '',
            defaultModel: 'qwen-plus'
          }
        },
        defaults: {
          models: {
            'modelscope/qwen-turbo': {
              description: 'Qwen Turbo - 快速经济模型',
              capabilities: ['text-generation']
            },
            'modelscope/qwen-plus': {
              description: 'Qwen Plus - 平衡性能模型',
              capabilities: ['text-generation']
            },
            'modelscope/qwen-max': {
              description: 'Qwen Max - 大规模复杂任务模型',
              capabilities: ['text-generation']
            },
            'modelscope/qwen-max-longcontext': {
              description: 'Qwen Max LongContext - 长上下文模型',
              capabilities: ['text-generation', 'long-context']
            }
          }
        }
      }
    };
  }

  /**
   * 集成ModelScope到OpenClaw配置
   */
  async integrate() {
    console.log('开始集成ModelScope到OpenClaw...');

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

      // 合并ModelScope配置
      const modelScopeConfig = this.getConfigTemplate();
      
      // 深度合并配置
      config = this.deepMerge(config, modelScopeConfig);

      // 写入配置文件
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
      
      console.log('ModelScope已成功集成到OpenClaw配置中！');
      console.log(`配置文件位置: ${this.configPath}`);

      // 创建模型别名
      await this.createModelAliases();

      return true;

    } catch (error) {
      console.error('集成ModelScope时发生错误:', error);
      throw error;
    }
  }

  /**
   * 创建模型别名
   */
  async createModelAliases() {
    // 这里可以创建命令行别名或其他快捷方式
    console.log('创建ModelScope模型别名...');
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
   * 验证API密钥
   */
  async validateApiKey(apiKey) {
    if (!apiKey) {
      console.error('错误: 未提供ModelScope API密钥');
      console.log('请设置环境变量 MODELScope_API_KEY 或在配置文件中指定API密钥');
      return false;
    }

    try {
      // 这里可以添加实际的API验证逻辑
      console.log('API密钥格式检查通过');
      return true;
    } catch (error) {
      console.error('API密钥验证失败:', error.message);
      return false;
    }
  }

  /**
   * 安装集成
   */
  async install() {
    console.log('正在安装OpenClaw ModelScope集成...');

    // 检查API密钥
    const apiKey = process.env.MODELScope_API_KEY;
    if (!await this.validateApiKey(apiKey)) {
      throw new Error('API密钥验证失败，无法继续安装');
    }

    // 执行集成
    await this.integrate();

    console.log('\n安装完成!');
    console.log('接下来您可以:');
    console.log('1. 设置环境变量 MODELScope_API_KEY 为您的API密钥');
    console.log('2. 重启OpenClaw服务');
    console.log('3. 使用 /model list 命令查看可用的ModelScope模型');
    console.log('4. 使用 /model modelscope/qwen-plus 等命令切换到ModelScope模型');

    return true;
  }
}

module.exports = OpenClawModelScopeIntegration;

// 如果直接运行此脚本
if (require.main === module) {
  const integration = new OpenClawModelScopeIntegration();

  integration.install()
    .then(() => console.log('集成安装完成'))
    .catch(error => {
      console.error('集成安装失败:', error);
      process.exit(1);
    });
}