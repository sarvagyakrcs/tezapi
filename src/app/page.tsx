"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useEffect, useState } from "react";

export default function Home() {
    const [input, setInput] = useState<string>("");
    const [searchResults, setSearchResults] = useState<{
        results: string[],
        duration: number
    }>()

    useEffect(() => {
        const fetchData = async () => {
            if (!input) {
                setSearchResults(undefined);
                return;
            }
            const res = await fetch(`/api/search?q=${input}`);
            const data = (await res.json()) as {results: string[], duration: number};
            setSearchResults(data);
        }
        fetchData();
    }, [input])

    return (
        <main className="h-screen w-screen grainy">
            <div className="flex flex-col gap-6 text-zinc-900 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-botton-2.5">
                <h1 className="text-black text-5xl tracking-tight font-bold">
                    <span className="text-emerald-500">Tez</span>API {" | "} <span className="text-emerald-500">तेज़</span>API ⚡
                </h1>
                <p className="ext-zinc-600 text-lg text-center max-w-prose">
                    A high-performance API built with Hono, Next.js and Vercel. <br />{' '}
                    Type a query below and get your results in miliseconds.
                </p>
                <div className="max-w-md w-full">
                    <Command>
                        <CommandInput 
                            value={input}
                            onValueChange={setInput}
                            placeholder="Search Country"
                            className="placeholder:text-zinc-500"
                        />
                        <CommandList>
                            {searchResults?.results.length === 0 ? (<CommandEmpty> No results Found </CommandEmpty>) : null}
                            {searchResults?.results ? (
                                <CommandGroup heading="Results">
                                    {searchResults.results.map((result) => {
                                        return(
                                            <CommandItem 
                                                key={result} 
                                                value={result} 
                                                onSelect={setInput}
                                            >
                                                {result}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            ) : null}
                            
                        </CommandList>
                        {searchResults?.results ? (
                                <>
                                    <div className="h-px w-full bg-zing-200"/>
                                    <p className="p-2 text-xs text-zinc-500">
                                        Found <span className="text-emerald-500">{searchResults.results.length}</span> Results in <span className="text-emerald-500">{searchResults.duration.toFixed(2)} ms</span>.
                                    </p>
                                </>
                            ) : null}
                    </Command>
                </div>
            </div>

        </main>
    );
}
