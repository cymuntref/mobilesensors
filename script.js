// The three.js scene: the 3D world where you put objects
const scene = new THREE.Scene();

let torusGeometry = new THREE.TorusGeometry(7, 1.6, 4, 3, 6.3);
let material = new THREE.MeshBasicMaterial({ color: 0x0071C5 });
let torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);





if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(eventData) {   
        // Acceleration
        console.log(eventData.acceleration.x);
        console.log(eventData.acceleration.y);
        console.log(eventData.acceleration.z);
    
        // Acceleration including gravity
        console.log(eventData.accelerationIncludingGravity.x);
        console.log(eventData.accelerationIncludingGravity.y);
        console.log(eventData.accelerationIncludingGravity.z);

        // Rotation rate
        console.log(eventData.rotationRate.alpha);
        console.log(eventData.rotationRate.beta);
        console.log(eventData.rotationRate.gamma);
    }, false);
}

const sensorAbs = new AbsoluteOrientationSensor();
Promise.all([navigator.permissions.query({ name: "accelerometer" }),
             navigator.permissions.query({ name: "magnetometer" }),
             navigator.permissions.query({ name: "gyroscope" })])
       .then(results => {
         if (results.every(result => result.state === "granted")) {
           sensorAbs.start();
         } else console.log("No permissions to use AbsoluteOrientationSensor.");
       });
         


// Update mesh rotation using quaternion.
sensorAbs.onreading = () => torus.quaternion.fromArray(sensorAbs.quaternion);

// Update mesh rotation using rotation matrix.
const sensorRel = new RelativeOrientationSensor();
let rotationMatrix = new Float32Array(16);
sensor_rel.onreading = () => {
    sensorRel.populateMatrix(rotationMatrix);
    torus.matrix.fromArray(rotationMatrix);
}
sensorRel.start();


// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);


// A cube we are going to animate
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
};

// The mesh: the geometry and material combined, and something we can directly add into the scene (I had to put this line outside of the object literal, so that I could use the geometry and material properties)
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

// Add the cube into the scene
scene.add(cube.mesh);

// Make the camera further from the cube so we can see it better
camera.position.z = 5;

function render() {
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  cube.mesh.rotation.x += 0.05;
  cube.mesh.rotation.y -= 0.05;

  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();