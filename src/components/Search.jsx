import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value)
  }
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Animeboxd"
        defaultValue={searchTerm}
        onChange={handleSearchTerm}
      />
    </div>
  );
};

export default Search;
