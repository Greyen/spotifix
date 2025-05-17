import React from "react";

// Define the props for a single related query item
interface RelatedQueryItemProps {
  query: string;
}

// Single related query component matching your provided markup
const RelatedQueryItem: React.FC<RelatedQueryItemProps> = ({ query }) => {
  return (
    <div className="py-sm cursor-pointer group flex items-center justify-between">
      <div className="md:group-hover:text-super md:dark:group-hover:text-superDark transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
        {query}
      </div>
      <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="plus"
          className="svg-inline--fa fa-plus"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"
          />
        </svg>
      </div>
    </div>
  );
};

// Define the props for the RelatedQueries component
interface RelatedQueriesProps {
  queries: string[];
}

// The parent component that maps through the list of queries
const RelatedQueries: React.FC<RelatedQueriesProps> = ({ queries }) => {
  return (
    <div>
      {queries.map((query, index) => (
        <RelatedQueryItem key={index} query={query} />
      ))}
    </div>
  );
};

export default RelatedQueries;

  