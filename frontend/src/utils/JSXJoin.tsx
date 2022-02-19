import React from "react";

export default function JSXJoin<T extends React.ReactNode>(arr: T[], glue: React.ReactNode) {
    return <>
        {arr.map((item, i) => {
            {i !== 0 && glue}{item}
        })}
    </>;
}
