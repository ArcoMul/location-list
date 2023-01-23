import { ChangeEvent, useEffect, useState } from "react";
import jsonLocations from "../../data/customerLocations.json";
import classes from "./LocationList.module.css";

function LocationList() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState(jsonLocations);

  useEffect(() => {
    const lquery = query.toLocaleLowerCase();
    setLocations(jsonLocations.filter((l) => l.name.toLowerCase().includes(lquery)));
  }, [query]);

  const handleQueryInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <h1>Location List</h1>
      <input value={query} onChange={handleQueryInput} />
      <ul className={classes.ul}>
        {locations.map((l) => (
          <li>{l.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default LocationList;
