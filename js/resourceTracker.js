import * as THREE from "three";

export class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }

  track(resource) {
    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    return resource;
  }

  dispose() {
    for (let resource of this.resources) {
      if (resource.dispose) {
        resource.dispose();
      }
      if (resource.parent) {
        resource.parent.remove(resource);
      }
    }
    this.resources.clear();
  }
}
