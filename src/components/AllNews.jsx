import React, { useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";

function AllNews() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // For storing the user input
  const [searchTerm, setSearchTerm] = useState("technology"); // Default search term

  const pageSize = 30;
  const apiKey = '61ace240f8a4478b8622f8a3fc52c646';

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then((data) => {
        setTotalResults(data.totalResults);
        setData(data.articles);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Failed to fetch news. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm, page]);

  const handleSearch = () => {
    setSearchTerm(query);
    setPage(1); // Reset to first page on new search
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for news..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3">
        {!isLoading ? (
          data.map((element, index) => (
            <EverythingCard
              title={element.title}
              description={element.description}
              imgUrl={element.urlToImage}
              publishedAt={element.publishedAt}
              url={element.url}
              author={element.author}
              source={element.source.name}
              key={index}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button
            disabled={page <= 1}
            className="pagination-btn text-center"
            onClick={() => setPage(page - 1)}
          >
            &larr; Prev
          </button>
          <p className="font-semibold opacity-80">
            {page} of {Math.ceil(totalResults / pageSize)}
          </p>
          <button
            className="pagination-btn text-center"
            disabled={page >= Math.ceil(totalResults / pageSize)}
            onClick={() => setPage(page + 1)}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}

export default AllNews;
