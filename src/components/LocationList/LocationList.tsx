import { ChangeEvent, useEffect, useState } from "react";
import jsonLocations from "../../data/customerLocations.json";
import jsonProjects from "../../data/plantationProjects.json";
import { haversine } from "../../lib/geo";
import Card from "../Card/Card";
import classes from "./LocationList.module.css";

function LocationList() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState(jsonLocations);
  const [openLocation, setOpenLocation] = useState<Location | null>(null);
  const [projects, setProjects] = useState<LocationProject[] | null>(null);

  // Update location list based on query input
  useEffect(() => {
    const lquery = query.toLocaleLowerCase();
    setLocations(
      jsonLocations.filter((l) => l.name.toLowerCase().includes(lquery))
    );
  }, [query]);

  // Update projects when open location changes
  useEffect(() => {
    if (!openLocation) return;
    setProjects(
      jsonProjects
        .map((project) => ({
          projectName: project.projectName,
          distance: haversine(
            openLocation.latitude,
            openLocation.longitude,
            Number(project.latitude),
            Number(project.longitude)
          ),
        }))
        .sort((p1, p2) => (p2.distance = p1.distance))
        .slice(0, 3)
    );
  }, [openLocation]);

  const handleQueryInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleLocationOpen = (location: Location) => {
    setOpenLocation(location);
  };

  return (
    <div>
      <h1>Location List</h1>
      <input value={query} onChange={handleQueryInput} />
      <ul className={classes.ul}>
        {locations.map((location) => (
          <li>
            <Card
              title={location.name}
              open={!!openLocation && location.name === openLocation.name}
              onOpen={() => handleLocationOpen(location)}
            >
              {!!openLocation && location.name === openLocation.name && projects && (
                <div>
                  Nearest projects:
                  <ul>
                    {projects.map((p) => (
                      <li>
                        {p.projectName} ({Math.round(p.distance)} KM)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationList;
