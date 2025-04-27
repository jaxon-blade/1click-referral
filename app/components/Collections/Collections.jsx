import { useState, useEffect, useCallback } from "react";
import {
  IndexTable,
  Card,
  Text,
  Thumbnail,
  useIndexResourceState,
  TextField,
  Icon,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";

export default function CollectionList({
  search,
  setSelectedCollections,
  collectionsData,
  setShowCollectionList,
}) {
  const [collections, setCollections] = useState([]);
  const [searchValue, setSearchValue] = useState(search);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(collections, {
      selectedResources: [...collectionsData],
    });

  const fetchCollections = useCallback(
    async (direction = null, start, end) => {
      setLoading(true); // Set loading to true before fetching
      let queryParam = "";
      if (direction === "next" && start) queryParam = `?after=${start}`;
      if (direction === "prev" && end) queryParam = `?before=${end}`;
      if (searchValue) queryParam = `?search=${searchValue}`;

      try {
        const response = await fetch(`/api/collections${queryParam}`);
        const data = await response.json();

        setCollections(data.collections);
        setCursor({ start: data.nextCursor, end: data.backCursor });
        setHasNextPage(data.hasNextPage);
        setHasPreviousPage(data.hasPreviousPage);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    },
    [searchValue],
  );

  useEffect(() => {
    fetchCollections(); // Load initial collections
  }, [fetchCollections]);
  useEffect(() => {
    if (searchValue) {
      fetchCollections(); // Fetch collections when search value changes
    }
  }, [searchValue, fetchCollections]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCursor(null); // Reset cursor when search value changes
  };
  const handleAddCollection = () => {
    setSelectedCollections("collections", selectedResources);
    setShowCollectionList(false);
  };

  return (
    <Card>
      <TextField
        prefix={<Icon source={SearchIcon} />}
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search collections"
      />
      <IndexTable
        loading={loading} // Use loading state here
        resourceName={{ singular: "collection", plural: "collections" }}
        itemCount={collections.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[{ title: "Image" }, { title: "Title" }, { title: "Handle" }]}
        pagination={{
          hasNext: hasNextPage,
          onNext: () => fetchCollections("next", cursor.start),
          hasPrevious: hasPreviousPage,
          onPrevious: () => fetchCollections("prev", cursor.end),
        }}
      >
        {collections.map((collection, index) => (
          <IndexTable.Row
            id={collection.id}
            key={collection.id}
            position={index}
            selected={selectedResources.includes(collection.id)}
          >
            <IndexTable.Cell>
              <Thumbnail
                source={collection.imageSrc}
                alt={collection.imageAlt}
                size="small"
              />
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text>{collection.title}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text>{collection.handle}</Text>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
      <InlineStack gap={"200"} align="end">
        <Button onClick={() => setShowCollectionList(false)}>Cancel</Button>
        <Button onClick={handleAddCollection} variant="primary">
          Add
        </Button>
      </InlineStack>
    </Card>
  );
}
