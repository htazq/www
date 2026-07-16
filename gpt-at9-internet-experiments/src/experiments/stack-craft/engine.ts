import { recipes, type Recipe } from './recipes';

export function recipeKey(a: string, b: string) {
  return [a, b].sort((left, right) => left.localeCompare(right)).join('::');
}

const recipeMap = new Map(recipes.map((recipe) => [recipeKey(...recipe.inputs), recipe]));

export function combineElements(a: string, b: string): Recipe | null {
  return recipeMap.get(recipeKey(a, b)) ?? null;
}

export function findDiscoveryPath(
  target: string,
  discovered: Set<string>,
  sourceRecipes = recipes,
): string[] {
  const recipe = sourceRecipes.find((item) => item.result === target);
  if (!recipe) return [target];
  const [a, b] = recipe.inputs;
  const prefixA = discovered.has(a) ? [a] : findDiscoveryPath(a, discovered, sourceRecipes);
  const prefixB = discovered.has(b) ? [b] : findDiscoveryPath(b, discovered, sourceRecipes);
  return [...prefixA, ...prefixB, target];
}
