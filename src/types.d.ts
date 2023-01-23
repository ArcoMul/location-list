interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface Project {
  projectName: string;
  latitude: string;
  longitude: string;
}

interface LocationProject {
  projectName: string;
  distance: number;
}
