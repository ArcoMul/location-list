import jsonProjects from "../data/plantationProjects.json";
import { haversine } from "../lib/geo";

export function getNearbyProjects(latitude: number, longitude: number, n: number) {
    return Object.values(
        jsonProjects
            // Calculate distance for each project
            .map((project) => ({
                projectName: project.projectName,
                distance: haversine(
                    latitude,
                    longitude,
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
    ).slice(0, n)
}