import React, { useState } from 'react';
import {QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Planet from './Planet';

const queryClient = new QueryClient();

export default function Planets() {
    return (
      <QueryClientProvider client={queryClient}>
        <Temp />
      </QueryClientProvider>
    )
};

const fetchPlanets = async (page) => {
    // const page = page.queryKey[1];
    const res = await fetch(`http://swapi.dev/api/planets/?page=${page}`);
    return res.json();
};

const Temp = () => {
    const [ page, setPage ] = useState(1);
    const { isLoading, error, data } = useQuery(
        ['planets', page],
        ()=>fetchPlanets(page),
        { 
            keepPreviousData:true,
            getFetchMore: (lastGroup) => {
                lastGroup.page=lastGroup.next?.split('=')[1];
                return lastGroup.page
            } 
        }
    );

    return (
        <div>
            <div className="pagination">   
            <h2>Planets</h2>         
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
                ()=>{setPage(old=>old+1) }
            }
            disabled={page===6}
            >
            Next
            </button></div>
            
            { isLoading && (
                <div>Loading data....</div>
            )}
            { error && (
                <div>Error in Fetching Data</div>
            )}
            { data && data.results && (
                <div>
                    { data.results.map((planet)=><div> <Planet key={planet.name} planet={planet}/> </div>)}
                </div>
            )}
            {
            (!data || !data.results) && (!isLoading) && (<p> No Further Results</p>)
            }
        </div>
    );
};