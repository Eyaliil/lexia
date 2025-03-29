// Tree.js
Tree = function () {
    this.threeGroup = new THREE.Group();
  
    // 🟤 Tree trunk
    const trunkGeo = new THREE.CylinderGeometry(2, 2, 20, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 10;
    this.threeGroup.add(trunk);
  
    // 🌿 Tree foliage (canopy)
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(8, 12, 12), leafMat);
    leaf1.position.y = 22;
    this.threeGroup.add(leaf1);
  
    const leaf2 = leaf1.clone();
    leaf2.scale.set(0.8, 0.8, 0.8);
    leaf2.position.set(2, 26, 0);
    this.threeGroup.add(leaf2);
  
    const leaf3 = leaf1.clone();
    leaf3.scale.set(0.8, 0.8, 0.8);
    leaf3.position.set(-2, 26, 1);
    this.threeGroup.add(leaf3);
  
    this.threeGroup.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  };
  