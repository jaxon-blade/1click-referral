import { useState, useEffect, useCallback } from "react";
import {
  IndexTable,
  Card,
  Text,
  Thumbnail,
  useIndexResourceState,
  TextField,
  Icon,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import useDebounce from "../../hooks/useDebounce"; // Import custom debounce hook

export default function ProductList({
  search,
  setSelectedProducts,
  productsData,
  setShowProductList,
}) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [searchValue, setSearchValue] = useState(search);
  const [loading, setLoading] = useState(false); // Add loading state
  const debouncedSearchValue = useDebounce(searchValue, 300); // Use custom debounce hook
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(items, { selectedResources: [...productsData] });

  const fetchProducts = useCallback(
    async (direction = null, start, end) => {
      setLoading(true); // Set loading to true before fetching
      let queryParam = "";
      if (direction === "next" && start) queryParam = `?after=${start}`;
      if (direction === "prev" && end) queryParam = `?before=${end}`;
      if (debouncedSearchValue)
        queryParam += `${queryParam ? "&" : "?"}search=${debouncedSearchValue}`;

      const response = await fetch(`/api/products${queryParam}`);
      const data = await response.json();

      setItems(data.products);
      setCursor({ start: data.nextCursor, end: data.backCursor });
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
      setLoading(false); // Set loading to false after fetching
    },
    [debouncedSearchValue], // Add cursor to dependencies
  );

  useEffect(() => {
    fetchProducts(); // Fetch products when debouncedSearchValue or pagination changes
  }, [debouncedSearchValue, fetchProducts]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  const handleAddProduct = () => {
    setSelectedProducts("products", selectedResources);
    setShowProductList(false);
  };

  return (
    <Card>
      <TextField
        prefix={<Icon source={SearchIcon} />}
        value={searchValue}
        onChange={handleSearchChange}
      />
      <IndexTable
        loading={loading} // Use loading state here
        resourceName={{ singular: "product", plural: "products" }}
        itemCount={items.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[{ title: "Product" }, { title: "Handle" }]}
        pagination={{
          hasNext: hasNextPage,
          onNext: () => fetchProducts("next", cursor.start),
          hasPrevious: hasPreviousPage,
          onPrevious: () => fetchProducts("prev", cursor.end),
        }}
      >
        {items.map((product, index) => (
          <IndexTable.Row
            id={product.id}
            key={product.id}
            position={index}
            selected={selectedResources.includes(product.id)}
          >
            <IndexTable.Cell>
              <Thumbnail
                source={product.imageSrc}
                alt={product.imageAlt}
                size="small"
              />
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text>{product.title}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text>{product.handle}</Text>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
      <InlineStack gap={"200"} align="end">
        <Button onClick={() => setShowProductList(false)}>Cancel</Button>
        <Button onClick={handleAddProduct} variant="primary">
          Add
        </Button>
      </InlineStack>
    </Card>
  );
}
