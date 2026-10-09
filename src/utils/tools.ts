interface Categorised {
  name: string;
  description: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

export interface ToolGroup<T> extends Category {
  tools: readonly T[];
}

/**
 * Sorts the tools under their categories, in the order of the categories. With a query,
 * keeps the tools whose name, description or category contains every word of it, and
 * leaves out the categories with nothing left.
 */
export const groupTools = <T extends Categorised>(
  tools: readonly T[],
  categories: readonly Category[],
  query = ""
): ToolGroup<T>[] => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  return categories
    .map((category) => ({
      ...category,
      tools: tools.filter((tool) => {
        if (tool.category !== category.id) return false;
        const text =
          `${tool.name} ${tool.description} ${category.name}`.toLowerCase();
        return words.every((word) => text.includes(word));
      }),
    }))
    .filter((group) => group.tools.length > 0);
};
