import { useRef, useEffect } from 'react';

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */
export function getSectionListData(data) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items.
  // Each item has the following properties: "id", "title" and "price"

  let structuredData = data.reduce((menu, item) => {
    let category = item.category;
    if (!menu[category]) {
      menu[category] = {
        category: category,
        data: [],
      };
    }
    menu[category].data.push({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    });
    return menu;
  }, {});
  return Object.values(structuredData);
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
