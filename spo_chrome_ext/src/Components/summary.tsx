import React from 'react'

type SummaryProps = {
    summary: string;
}

const Summary = ({summary}:SummaryProps) => {
    return <span>{summary}</span>
}
export default Summary;