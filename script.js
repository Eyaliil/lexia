
//THREEJS RELATED VARIABLES 
let currentMode = "mcq"; // or "speech"

var questions = [
	{
	  text: "What is the color of the wool ball?",
	  answers: ["Blue", "Red", "Green"],
	  correct: "red"
	},
	{
	  text: "How many legs does the cat have?",
	  answers: ["2", "4", "3"],
	  correct: "4"
	},
	{
	  text: "What shape is the cat's nose?",
	  answers: ["Triangle", "Circle", "Square"],
	  correct: "triangle"
	}
  ];
  var currentQuestionIndex = 0;

  
  const speechQuestions = [
	{
	  text: "Say the shape of the cat's nose",
	  correct: "triangle"
	}
  ];
  
  function initSpeechRecognition(correctAnswer) {
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	const resultDisplay = document.getElementById("speech-result");

	if (!SpeechRecognition) {
	  resultDisplay.textContent = "Speech recognition not supported 😞";
	  return;
	}

	const recognition = new SpeechRecognition();
	recognition.lang = "en-US";
	recognition.interimResults = false;
	recognition.continuous = false;

	resultDisplay.textContent = "🎙 Listening...";
	//to be fixed
	recognition.onresult = (event) => {
	  const spoken = event.results[0][0].transcript.trim().toLowerCase();
	  resultDisplay.textContent = `You said: "${spoken}"`;

	  if (spoken === correctAnswer.toLowerCase()) {
		showFeedback('Correct! 🎉', true);
		checkAnswer(spoken); // ✅ pass what the user actually said
	  } else {
		showFeedback('Nope! Try again.', false);
	  }
	  
	};

	recognition.onerror = (event) => {
	  resultDisplay.textContent = `Error: ${event.error}`;
	  resultDisplay.style.color = "red";
	};

	recognition.onend = () => {
	  setTimeout(() => {
		resultDisplay.textContent = "";
	  }, 2000);
	};

	recognition.start();
}

  
  function nextQuestion() {
	if (currentMode === "mcq") {
	  if (currentQuestionIndex < questions.length - 1) {
		currentQuestionIndex++;
		showQuestion(currentQuestionIndex);
	  } else {
		// Switch to speech mode
		currentMode = "speech";
		currentQuestionIndex = 0;
		showSpeechQuestion(currentQuestionIndex);
	  }
	} else if (currentMode === "speech") {
	  if (currentQuestionIndex < speechQuestions.length - 1) {
		currentQuestionIndex++;
		showSpeechQuestion(currentQuestionIndex);
	  } else {
		alert("🎉 You've completed all questions!");
	  }
	}
  
	allowCatToPlay = false;
  }
  
  function showFeedback(message, isCorrect) {
  // Remove existing feedback popup if any
  const existingPopup = document.querySelector('.feedback-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create new feedback popup
  const popup = document.createElement('div');
  popup.className = 'feedback-popup';
  popup.style.color = isCorrect ? '#4CAF50' : '#F44336';
  popup.textContent = message;
  document.body.appendChild(popup);

  // Remove popup after animation
  setTimeout(() => {
    popup.remove();
  }, 2000);
}


  function prevQuestion() {
	if (currentMode === "mcq" && currentQuestionIndex > 0) {
	  currentQuestionIndex--;
	  showQuestion(currentQuestionIndex);
	} else if (currentMode === "speech" && currentQuestionIndex > 0) {
	  currentQuestionIndex--;
	  showSpeechQuestion(currentQuestionIndex);
	} else if (currentMode === "speech" && currentQuestionIndex === 0) {
	  // 👇 Go back to last MCQ
	  currentMode = "mcq";
	  currentQuestionIndex = questions.length - 1;
	  showQuestion(currentQuestionIndex);
	}
  
	allowCatToPlay = false;
  }
  

  
	  
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    gobalLight, shadowLight, backLight,
    renderer,
    container,
    controls;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
    mousePos = { x: 0, y: 0 },
    oldMousePos = {x:0, y:0},
    ballWallDepth = 28;

var clock = new THREE.Clock();
var time = 0;
var deltaTime = 0;


//3D OBJECTS VARIABLES

var hero;
var score = 0;


//INIT THREE JS, SCREEN AND MOUSE EVENTS
var allowCatToPlay = false;

function initScreenAnd3D() {
  
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 250;
  camera.lookAt(new THREE.Vector3(0, 40,0));

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  
  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
} 

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

function createLights() {
  globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
  shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 100, 100);
  backLight.castShadow = true;
  backLight.shadowDarkness = .1;
  backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  
  scene.add(globalLight);
  scene.add(shadowLight);
  scene.add(backLight);
}

function createFloor(){ 
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0x6ecccc}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createHero() {
  hero = new Cat();
  hero.threeGroup.scale.set(1.5, 1.5, 1.5);
  scene.add(hero.threeGroup);
}

function createBall() {
  ball = new Ball();
  ball.threeGroup.visible = false; 
  scene.add(ball.threeGroup);
}

// BALL RELATED CODE


var woolNodes = 10,
	woolSegLength = 2,
	gravity = -.8,
	accuracy =1;


Ball = function(){

	var redMat = new THREE.MeshLambertMaterial ({
	    color: 0x630d15, 
	    shading:THREE.FlatShading
	});

	var stringMat = new THREE.LineBasicMaterial({
    	color: 0x630d15,
    	linewidth: 3
	});

	this.threeGroup = new THREE.Group();
	this.ballRadius = 8;

	this.verts = [];

	// string
	var stringGeom = new THREE.Geometry();

	for (var i=0; i< woolNodes; i++	){
		var v = new THREE.Vector3(0, -i*woolSegLength, 0);
		stringGeom.vertices.push(v);

		var woolV = new WoolVert();
		woolV.x = woolV.oldx = v.x;
		woolV.y = woolV.oldy = v.y;
		woolV.z = 0;
		woolV.fx = woolV.fy = 0;
		woolV.isRootNode = (i==0);
		woolV.vertex = v;
		if (i > 0) woolV.attach(this.verts[(i - 1)]);
		this.verts.push(woolV);
		
	}
  	this.string = new THREE.Line(stringGeom, stringMat);

  	// body
  	var bodyGeom = new THREE.SphereGeometry(this.ballRadius, 5,4);
	this.body = new THREE.Mesh(bodyGeom, redMat);
  	this.body.position.y = -woolSegLength * woolNodes;

  	var wireGeom = new THREE.TorusGeometry( this.ballRadius, .5, 3, 10, Math.PI*2 );
  	this.wire1 = new THREE.Mesh(wireGeom, redMat);
  	this.wire1.position.x = 1;
  	this.wire1.rotation.x = -Math.PI/4;

  	this.wire2 = this.wire1.clone();
  	this.wire2.position.y = 1;
  	this.wire2.position.x = -1;
  	this.wire1.rotation.x = -Math.PI/4 + .5;
  	this.wire1.rotation.y = -Math.PI/6;

  	this.wire3 = this.wire1.clone();
  	this.wire3.rotation.x = -Math.PI/2 + .3;

  	this.wire4 = this.wire1.clone();
  	this.wire4.position.x = -1;
  	this.wire4.rotation.x = -Math.PI/2 + .7;

  	this.wire5 = this.wire1.clone();
  	this.wire5.position.x = 2;
  	this.wire5.rotation.x = -Math.PI/2 + 1;

  	this.wire6 = this.wire1.clone();
  	this.wire6.position.x = 2;
  	this.wire6.position.z = 1;
  	this.wire6.rotation.x = 1;

  	this.wire7 = this.wire1.clone();
  	this.wire7.position.x = 1.5;
  	this.wire7.rotation.x = 1.1;

  	this.wire8 = this.wire1.clone();
  	this.wire8.position.x = 1;
  	this.wire8.rotation.x = 1.3;

  	this.wire9 = this.wire1.clone();
  	this.wire9.scale.set(1.2,1.1,1.1);
  	this.wire9.rotation.z = Math.PI/2;
  	this.wire9.rotation.y = Math.PI/2;
  	this.wire9.position.y = 1;
  	
  	this.body.add(this.wire1);
  	this.body.add(this.wire2);
  	this.body.add(this.wire3);
  	this.body.add(this.wire4);
  	this.body.add(this.wire5);
  	this.body.add(this.wire6);
  	this.body.add(this.wire7);
  	this.body.add(this.wire8);
  	this.body.add(this.wire9);

  	this.threeGroup.add(this.string);
	this.threeGroup.add(this.body);

	this.threeGroup.traverse( function ( object ) {
    if ( object instanceof THREE.Mesh ) {
      object.castShadow = true;
      object.receiveShadow = true;
    }});

}

/* 
The next part of the code is largely inspired by this codepen :
https://codepen.io/dissimulate/pen/KrAwx?editors=001
thanks to dissimulate for his great work
*/

WoolVert = function(){
	this.x = 0;
	this.y = 20;
	this.z = 0;
	this.oldx = 0;
	this.oldy = 20;
	this.fx = 0;
	this.fy = 0;
	this.isRootNode = false;
	this.constraints = [];
	this.vertex = null;
}


WoolVert.prototype.update = function(multiplier){
	var wind = 0;//.1+Math.random()*.5;
  var m = Math.max(multiplier, .1);
  this.add_force(wind, gravity);

  newx = this.x + ((this.x - this.oldx) * m) + this.fx;
  newy = this.y + ((this.y - this.oldy) * m) + this.fy;
  
  this.oldx = this.x;
  this.oldy = this.y;
  this.x = newx;
  this.y = newy;

  this.vertex.x = this.x;
  this.vertex.y = this.y;
  this.vertex.z = this.z;

  this.fy = this.fx = 0
}

WoolVert.prototype.attach = function(point) {
  this.constraints.push(new Constraint(this, point));
};

WoolVert.prototype.add_force = function(x, y) {
  this.fx += x;
  this.fy += y;
};

Constraint = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.length = woolSegLength;
};

Ball.prototype.update = function(posX, posY, posZ){
		
	var i = accuracy;
	
	while (i--) {
		
		var nodesCount = woolNodes;
		
		while (nodesCount--) {
		
			var v = this.verts[nodesCount];
			
			if (v.isRootNode) {
			    v.x = posX;
			    v.y = posY;
			    v.z = posZ;
			}
		
			else {
		
				var constraintsCount = v.constraints.length;
		  		
		  		while (constraintsCount--) {
		  			
		  			var c = v.constraints[constraintsCount];

		  			var diff_x = c.p1.x - c.p2.x,
					    diff_y = c.p1.y - c.p2.y,
					    dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
					    diff = (c.length - dist) / dist;

				  	var px = diff_x * diff * .5;
				  	var py = diff_y * diff * .5;

				  	c.p1.x += px;
				  	c.p1.y += py;
				  	c.p2.x -= px;
				  	c.p2.y -= py;
				  	c.p1.z = c.p2.z = posZ;
		  		}

		  		if (nodesCount == woolNodes-1){
		  			this.body.position.x = this.verts[nodesCount].x;
					this.body.position.y = this.verts[nodesCount].y;
					this.body.position.z = this.verts[nodesCount].z;

					this.body.rotation.z += (v.y <= this.ballRadius)? (v.oldx-v.x)/10 : Math.min(Math.max( diff_x/2, -.1 ), .1);
		  		}
		  	}
		  	
		  	if (v.y < this.ballRadius) {
		  		v.y = this.ballRadius;
		  	}
		}
	}

	nodesCount = woolNodes;
	while (nodesCount--) this.verts[nodesCount].update(deltaTime * 80);

	this.string.geometry.verticesNeedUpdate = true;

	
}

Ball.prototype.receivePower = function(tp, multiplier){
	this.verts[woolNodes-1].add_force(tp.x * multiplier, tp.y * multiplier);
}

// End of the code inspired by dissmulate


// Make everything work together :

var t=0;

function loop(){
  render();
  
  deltaTime = clock.getDelta();
  time += deltaTime;
  
  t+=.05;
  hero.updateTail(time * 2);
  
  if (t > 1) {
	var ballPos = getBallPos();
	ball.update(ballPos.x, ballPos.y, ballPos.z);
	ball.receivePower(hero.transferPower, deltaTime * 80);
  
	if (allowCatToPlay) {
	  hero.interactWithBall(ball.body.position);
	}
  }
  

  requestAnimationFrame(loop);
}


function getBallPos(){
  var vector = new THREE.Vector3();

  vector.set(
      ( mousePos.x / window.innerWidth ) * 2 - 1, 
      - ( mousePos.y / window.innerHeight ) * 2 + 1,
      0.1 );

  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = (ballWallDepth - camera.position.z) / dir.z;
  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  return pos;
}

function render(){
  if (controls) controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event){
  initScreenAnd3D();
  createLights();
  createFloor()
  createHero();
  createBall();
  loop();
  showQuestion(currentQuestionIndex);
  updateScoreDisplay();

}

function launchConfetti() {
	const confettiGroup = new THREE.Group();
	scene.add(confettiGroup);
  
	const colors = [0xff5f5f, 0xffd95f, 0x8aff5f, 0x5fdfff, 0xbf5fff];
	const count = 30;
  
	for (let i = 0; i < count; i++) {
	  const geometry = new THREE.PlaneGeometry(2, 6);
	  const material = new THREE.MeshBasicMaterial({
		color: colors[Math.floor(Math.random() * colors.length)],
		side: THREE.DoubleSide
	  });
	  const confetti = new THREE.Mesh(geometry, material);
	  confetti.position.set(
		hero.threeGroup.position.x + (Math.random() - 0.5) * 30,
		hero.threeGroup.position.y + 80,
		hero.threeGroup.position.z + (Math.random() - 0.5) * 30
	  );
	  confetti.rotation.set(Math.random(), Math.random(), Math.random());
	  confetti.velocity = {
		x: (Math.random() - 0.5) * 0.5,
		y: -0.5 - Math.random() * 1,
		z: (Math.random() - 0.5) * 0.5
	  };
	  confettiGroup.add(confetti);
	}
  
	// Animate falling confetti for 2 seconds
	const start = performance.now();
	function animateConfetti(time) {
	  const elapsed = time - start;
  
	  confettiGroup.children.forEach((confetti) => {
		confetti.position.x += confetti.velocity.x;
		confetti.position.y += confetti.velocity.y;
		confetti.position.z += confetti.velocity.z;
		confetti.rotation.x += 0.1;
		confetti.rotation.y += 0.1;
	  });
  
	  if (elapsed < 2000) {
		requestAnimationFrame(animateConfetti);
	  } else {
		scene.remove(confettiGroup);
	  }
	}
  
	requestAnimationFrame(animateConfetti);
  }
  function updateScoreDisplay() {
	document.getElementById('score-display').textContent = `Score: ${score}`;
  }


  function checkAnswer(selected) {
	const correctAnswer = getCurrentCorrectAnswer().toLowerCase();
  
	if (selected === correctAnswer) {
	  showFeedback('Correct! 🎉', true);
	  allowCatToPlay = true;
	  score++;
	  updateScoreDisplay();
  
	  if (hero && typeof hero.clap === 'function') {
		hero.clap();
		hero.celebrate();
	  }
  
	  if (ball) {
		ball.threeGroup.visible = true; // 👈 Show the ball when answer is correct
	  }
  
	} else {
	  showFeedback('Nope! Try again.', false);
	  allowCatToPlay = false;
	}
  }
  
  

  
  function showSpeechQuestion(index) {
	const q = speechQuestions[index];
  
	document.querySelector("#question-panel p").textContent = q.text;
  
	// Hide MCQ buttons
	const ul = document.querySelector("#question-panel ul");
	ul.innerHTML = "";
  
	// Show speech button
	document.getElementById("speech-btn").style.display = "inline-block";
	document.getElementById("speech-result").textContent = "";
  
	document.getElementById("speech-btn").onclick = () => initSpeechRecognition(q.correct);

	if (ball) {
		ball.threeGroup.visible = false;
	  }
	  
  }
  
  
  
  function getCurrentCorrectAnswer() {
	if (currentMode === "mcq") {
	  return questions[currentQuestionIndex].correct;
	} else if (currentMode === "speech") {
	  return speechQuestions[currentQuestionIndex].correct;
	}
	return "";
  }
  
  function showQuestion(index) {
	const q = questions[index];
  
	document.querySelector("#question-panel p").textContent = q.text;
  
	const ul = document.querySelector("#question-panel ul");
	ul.innerHTML = "";
  
	document.getElementById("speech-btn").style.display = "none";
	document.getElementById("speech-result").textContent = "";
  
	q.answers.forEach(answer => {
	  const li = document.createElement("li");
	  const btn = document.createElement("button");
	  btn.textContent = answer;
	  btn.onclick = () => checkAnswer(answer.toLowerCase());
	  li.appendChild(btn);
	  ul.appendChild(li);
	});
  
	// Optional: hide feedback
	document.getElementById("feedback").textContent = "";
  
	// 👇 Add this to hide the ball when a new question loads
	if (ball) {
	  ball.threeGroup.visible = false;
	}
  }
  