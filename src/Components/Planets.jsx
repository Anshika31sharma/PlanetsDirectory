import React, { useState, useEffect } from "react";

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [residentData, setResidentData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    const fetchPlanets = async () => {
      const url = nextPage || "https://swapi.dev/api/planets/?format=json";
      const response = await fetch(url);
      const data = await response.json();

      if (!initialLoad) {
        const initialPlanets = data.results.slice(0, 6);
        setPlanets(initialPlanets);
        setInitialLoad(true);
      } else {
        setPlanets((prevPlanets) => [...prevPlanets, ...data.results]);
      }

      setNextPage(data.next);
    };

    fetchPlanets();
  }, [nextPage, initialLoad]);

  useEffect(() => {
    const fetchResidents = async () => {
      const data = await Promise.all(
        planets.flatMap((planet) =>
          planet.residents.map(async (residentUrl) => {
            const response = await fetch(residentUrl);
            return response.json();
          })
        )
      );

      setResidentData(data);
    };

    if (planets.length > 0) {
      fetchResidents();
    }
  }, [planets]);

  const handleLoadMore = () => {
    setNextPage(nextPage);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="relative z-10 text-6xl font-black mb-8 text-center text-transparent bg-gradient-to-b from-yellow-400 to-yellow-600 bg-clip-text ">
        <span>Star Wars</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-600">
          Planets
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planets.map((planet, planetIndex) => (
          <div
            key={planet.name}
            className="bg-gradient-to-b from-purple-500 to-pink-500 border rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-white">
                {planet.name}
              </h2>
              <p className="text-white">Climate: {planet.climate}</p>
              <p className="text-white">Population: {planet.population}</p>
              <p className="text-white">Terrain: {planet.terrain}</p>
              <h3 className="mt-3 mb-1 text-lg font-semibold text-white">
                Residents:
              </h3>
              <ul className="list-disc ml-4 text-white">
                {planet.residents.map((residentUrl, residentIndex) => (
                  <li key={residentIndex}>
                    {
                      residentData[
                        planetIndex * planet.residents.length + residentIndex
                      ]?.name
                    }{" "}
                    -{" "}
                    {
                      residentData[
                        planetIndex * planet.residents.length + residentIndex
                      ]?.height
                    }
                    cm,{" "}
                    {
                      residentData[
                        planetIndex * planet.residents.length + residentIndex
                      ]?.mass
                    }
                    kg,{" "}
                    {
                      residentData[
                        planetIndex * planet.residents.length + residentIndex
                      ]?.gender
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {nextPage && (
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 animate-fade-in"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Planets;
