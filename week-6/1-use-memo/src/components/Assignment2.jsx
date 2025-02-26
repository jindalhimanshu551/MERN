import React, { useEffect, useMemo, useState } from "react";

// In this assignment, you will create a component that renders a large list of sentences and includes an input field for filtering these items. 
// The goal is to use useMemo to optimize the filtering process, ensuring the list is only re-calculated when necessary (e.g., when the filter criteria changes).
// You will learn something new here, specifically how you have to pass more than one value in the dependency array

const words = ["hi", "hello", "himanshu", "random", "what", "why", "job"];
const TOTAL_LINES = 1000;
const ALL_SENTENCES = [];
for (let i=0; i<TOTAL_LINES; i++) {
    let sentence = "";
    for (let j=0; j<words.length; j++) {
        sentence += (words[Math.floor(words.length * Math.random())])
        sentence += " "
    }
    ALL_SENTENCES.push(sentence);
}

export function Assignment2() {
    const [sentences, setSentences] = useState(ALL_SENTENCES);
    const [filterInput, setFilterInput] = useState("");

    const filteredSentences = useMemo(() => {
        return sentences.filter(x =>  x.includes(filterInput))
    }, [filterInput, sentences])

    return <div>
        <input type="text" onChange={(e) => { setFilterInput(e.target.value)}}></input>
        <ListComponent filteredSentences={filteredSentences}></ListComponent>
    </div>
}


function ListComponent({filteredSentences}) {
    return <>
        {filteredSentences.map((sentence) => {
            return(<div>
                {sentence}
            </div>)
        })}
    </>
}