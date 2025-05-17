import React from "react";

const DetailedComponent = ({ data }: { data: Record<string, string[]> }) => {
  return (
    <div>
      {Object.entries(data).map(([heading, content], index) => (
        <div key={index}>
          <h4>
            <strong>{heading}</strong>
          </h4>
          {content.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      ))}
      <span></span> {/* Vacant span after heading */}    
    </div>
  );
};

export default DetailedComponent;
