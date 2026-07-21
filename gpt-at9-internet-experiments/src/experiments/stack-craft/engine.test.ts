import { combineElements, recipeKey } from './engine';
import { recipes } from './recipes';

describe('Stack Craft recipe engine', () => {
  it('treats input order as commutative', () => {
    expect(combineElements('Linux', '磁盘')?.result).toBe('文件系统');
    expect(combineElements('磁盘', 'Linux')?.result).toBe('文件系统');
    expect(recipeKey('b', 'a')).toBe(recipeKey('a', 'b'));
  });

  it('returns null for invalid pairs', () => expect(combineElements('Linux', 'Linux')).toBeNull());

  it('contains at least sixty deterministic recipes and fifty discoveries', () => {
    expect(recipes.length).toBeGreaterThanOrEqual(60);
    expect(new Set(recipes.map((recipe) => recipe.result)).size).toBeGreaterThanOrEqual(50);
  });

  it('contains the complete AI data center chain', () => {
    expect(combineElements('GPU 集群', '分布式存储')?.result).toBe('AI 基础设施');
    expect(combineElements('AI 基础设施', '供电')?.result).toBe('算力大厅');
    expect(combineElements('算力大厅', '散热')?.result).toBe('AI 数据中心');
  });
});
