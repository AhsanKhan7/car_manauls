import React from 'react';
import {Link, navigate} from 'gatsby';



const Autocomplete = ({hits, currentRefinement, refine, searchTerm, searchTermSetter}) => {

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            navigate('search/', {state: {searchTerm}});
        }
    }

    return (
    <ul>
        <li>
            <input
                type="search"
                value={currentRefinement}
                placeholder="Search by Year, Make, Model or Keyword"
                onChange={event => {
                    if(searchTermSetter)
                        searchTermSetter(event.currentTarget.value);
                    return refine(event.currentTarget.value)
                }}
                onKeyDown={handleKeyDown}
            />
        </li>
        <div className="dropdown-content">
            {currentRefinement && currentRefinement.length > 0 &&
                hits.map(hit => {
                        let make, model, year;
                        if(hit.context.manual) {
                            make = hit.context.manual.make;
                            model = hit.context.manual.model;
                            year = hit.context.manual.year;
                        } else if (hit.context.entry) {
                            make =  hit.context.entry.brand._text;
                            model = hit.context.entry.model._text;
                            year =  hit.context.entry.modelYear._text;
                        }
                        return (
                        <Link key={`${hit.objectID}Link`} to='/search' state={{searchTerm: make + ' ' + model + ' ' + year}}>
                            <li key={hit.objectID}>
                                {make} {model} {year}
                            </li>
                        </Link>
                        )
                    }
                )
            }
        </div>
    </ul>
)};



export default Autocomplete