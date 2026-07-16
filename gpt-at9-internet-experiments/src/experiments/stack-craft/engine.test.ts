import { combineElements, recipeKey } from './engine';
import { recipes } from './recipes';

describe('Stack Craft recipe engine', () => {
  it('treats input order as commutative', () => {
    expect(combineElements('Linux', 'Disk')?.result).toBe('File System');
    expect(combineElements('Disk', 'Linux')?.result).toBe('File System');
    expect(recipeKey('b', 'a')).toBe(recipeKey('a', 'b'));
  });

  it('returns null for invalid pairs', () => expect(combineElements('Linux', 'Linux')).toBeNull());

  it('contains at least sixty deterministic recipes and fifty discoveries', () => {
    expect(recipes.length).toBeGreaterThanOrEqual(60);
    expect(new Set(recipes.map((recipe) => recipe.result)).size).toBeGreaterThanOrEqual(50);
  });

  it('contains the complete AI data center chain', () => {
    expect(combineElements('GPU Cluster', 'Distributed Storage')?.result).toBe('AI Infrastructure');
    expect(combineElements('AI Infrastructure', 'Power')?.result).toBe('Compute Hall');
    expect(combineElements('Compute Hall', 'Cooling')?.result).toBe('AI Data Center');
  });
});
