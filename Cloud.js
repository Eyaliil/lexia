// Cloud.js
Cloud = function () {
    this.threeGroup = new THREE.Group();
  
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  
    // Create puffy cloud using spheres
    for (let i = 0; i < 5; i++) {
      const radius = 8 + Math.random() * 4;
      const geom = new THREE.SphereGeometry(radius, 8, 8);
      const mesh = new THREE.Mesh(geom, cloudMat);
  
      mesh.position.x = (i - 2) * 10 + Math.random() * 5;
      mesh.position.y = 0 + Math.random() * 5;
      mesh.position.z = Math.random() * 5;
  
      this.threeGroup.add(mesh);
    }
  
    // 🌧️ RAIN SETUP
    this.rainGroup = new THREE.Group();
    this.drops = [];
  
    const dropGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 6);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0x87cefa }); // light blue
  
    const numDrops = 80;
  
    for (let i = 0; i < numDrops; i++) {
      const drop = new THREE.Mesh(dropGeo, dropMat);
      drop.position.x = (Math.random() - 0.5) * 40;
      drop.position.y = -Math.random() * 15;
      drop.position.z = (Math.random() - 0.5) * 10;
  
      this.rainGroup.add(drop);
  
      this.drops.push({
        mesh: drop,
        speed: 0.5 + Math.random() * 0.7,
        startY: drop.position.y
      });
    }
  
    this.rainGroup.position.y = -10; // Slightly under the cloud
    this.threeGroup.add(this.rainGroup);
  
    this.threeGroup.visible = false; // initially hidden
  };
  
  // 🌧️ Animate falling rain
  Cloud.prototype.updateRain = function () {
    this.drops.forEach(drop => {
      drop.mesh.position.y -= drop.speed;
  
      if (drop.mesh.position.y < -100) {
        drop.mesh.position.y = drop.startY;
      }
    });
  };
  