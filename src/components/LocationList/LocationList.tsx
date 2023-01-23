import { ChangeEvent, useEffect, useState } from "react";
import { haversine } from "../../lib/geo";
import Card from "../Card/Card";
import classes from "./LocationList.module.css";

import jsonLocations from "../../data/customerLocations.json";
import jsonProjects from "../../data/plantationProjects.json";

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
      Object.values(
        jsonProjects
          // Calculate distance for each project
          .map((project) => ({
            projectName: project.projectName,
            distance: haversine(
              openLocation.latitude,
              openLocation.longitude,
              Number(project.latitude),
              Number(project.longitude)
            ),
          }))
          // Sort on distance
          .sort((p1, p2) => (p2.distance = p1.distance))
          // Remove double named projects, keep the closest one
          .reduce((map, project) => {
            if (!map[project.projectName]) {
              map[project.projectName] = project;
            }
            return map;
          }, {} as { [key: string]: LocationProject })
      ).slice(0, 3)
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
