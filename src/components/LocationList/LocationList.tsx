import { ChangeEvent, useEffect, useState } from "react";
import { getNearbyProjects } from "../../services/project";
import {
  matchLocationsByName,
  locations as initialLocations,
} from "../../services/location";
import Card from "../Card/Card";
import classes from "./LocationList.module.css";

function LocationList() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState(initialLocations);
  const [openLocation, setOpenLocation] = useState<Location | null>(null);
  const [projects, setProjects] = useState<LocationProject[] | null>(null);

  // Update location list based on query input
  useEffect(() => {
    setLocations(matchLocationsByName(query));
  }, [query]);

  // Update projects when open location changes
  useEffect(() => {
    if (!openLocation) return;
    setProjects(
      getNearbyProjects(openLocation.latitude, openLocation.longitude, 3)
    );
  }, [openLocation]);

  const handleQueryInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleLocationOpen = (location: Location) => {
    setOpenLocation(location);
    setProjects(null);
  };

  const handleLocationClose = () => {
    setOpenLocation(null);
    setProjects(null);
  };

  return (
    <div>
      <h1>Location List</h1>
      <input
        className={classes.input}
        value={query}
        onChange={handleQueryInput}
        placeholder="Search..."
      />
      <ul className={classes.ul}>
        {locations.map((location) => (
          <li key={location.name}>
            <Card
              title={location.name}
              open={!!openLocation && location.name === openLocation.name}
              onOpen={() => handleLocationOpen(location)}
              onClose={() => handleLocationClose()}
            >
              <div>
                Nearest projects:
                <ul>
                  {!projects
                    ? [...Array(3).keys()].map((i) => <li>...</li>)
                    : projects.map((p) => (
                        <li key={p.projectName}>
                          {p.projectName} ({Math.round(p.distance)} KM)
                        </li>
                      ))}
                </ul>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationList;
