import React, { useState } from 'react';
import {QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Person from './Person';

const queryClient = new QueryClient();

export default function People() {
    return (
      <QueryClientProvider client={queryClient}>
        <Temp />
      </QueryClientProvider>
    )
};

const fetchPeople = async (page) => {
    // const page = page.queryKey[1];
    const res = await fetch(`http://swapi.dev/api/people/?page=${page}`);
    return res.json();
};

const Temp = () => {
    const [ page, setPage ] = useState(1);

    const { isLoading, error, data} = useQuery(
        ['people',page],
        ()=>fetchPeople(page),
        { keepPreviousData:true,            
            getFetchMore: (lastGroup) => {
            lastGroup.page=lastGroup.next?.split('=')[1];
            return lastGroup.page
        }  }
    );

    return (
        <div>
            <h2>People</h2>

            <button 
            onClick={
                ()=>setPage(old=>old-1)
            }
            disabled={page===1}
            >
            Previous
            </button>

            <span> {page} </span>

            <button 
            onClick={
                ()=>{ setPage(old=>old+1) }
            }
            disabled={page===9}
            >
            Next
            </button>

            { isLoading && (
                <div>Loading data....</div>
            )}
            { error && (
                <div>Error in Fetching Data</div>
            )}
            { data && data.results && (
                <div>
                    { data.results.map((person)=><div> <Person key={person.name} person={person}/> </div>)}
                </div>
            )}
            {
                (!data || !data.results) && (!isLoading)  && (<p> No Further Results</p>)
            }
        </div>
    );
};