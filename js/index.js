//颜色
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    green:0x61E708,
    yellow:0xF7F709,
    deepGreen:0x108A10,
    deepGreenTwo:0x30BE69,
    orange:0xFF9900,
};

var scene,camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//初始化场景、相机
function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  
   //透视相机PerspectiveCamera( fov视角, aspect纵横比, near近平面, far远平面 )
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

//雾化效果，可以产生隐藏远处物体的浓雾效果，Fog(颜色,开始的地方,结束的地方);
  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

//渲染
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;//光线投影
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  
  window.addEventListener('resize', handleWindowResize, false);
}

//随着屏幕尺寸的改变更新渲染器的尺寸和摄像机的纵横比
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// 灯光
var ambientLight, hemisphereLight, shadowLight;
function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  //阴影分辨率
  shadowLight.shadow.mapSize.width = 1024;
  shadowLight.shadow.mapSize.height = 1024;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

//飞机
var AirPlane = function(){
	this.mesh = new THREE.Object3D();
  	this.mesh.name = "airPlane";

  // 机身
  	var geomCockpit=new THREE.CylinderGeometry(15,25,60,40 ,40);
  	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  	cockpit.rotation.z=Math.PI/2;
	cockpit.castShadow = true;
  	cockpit.receiveShadow = true;
  	this.mesh.add(cockpit);
  	

// 机头
var geomEngine=new THREE.CylinderGeometry(25,20,25,40 ,40);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.rotation.z=Math.PI/2;
	engine.position.x = 60;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	
	 // 黄圈
  	var geomMiddle=new THREE.CylinderGeometry(25,25,20,40,40);
  	var matMiddle= new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
  	var middle= new THREE.Mesh(geomMiddle, matMiddle);
  	middle.rotation.z=Math.PI/2;
  	middle.position.x = 40;
  	middle.castShadow = true;
  	middle.receiveShadow = true;
	this.mesh.add(middle);

  //机尾
  	var geomTailPlane = new THREE.BoxGeometry(25,25,5,1,1,1);
  	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
  	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  	tailPlane.rotation.z=Math.PI/4;
  	tailPlane.position.set(-45,0,0);
  	tailPlane.castShadow = true;
  	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

  	//右机翼
  	var geomRightSideWing = new THREE.BoxGeometry(36,6,50,1,1,1);
  	var matRightSideWing = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
  	this.rightSideWing = new THREE.Mesh(geomRightSideWing, matRightSideWing);
  	this.rightSideWing.rotation.x=-Math.PI/8;
  	this.rightSideWing.rotation.y=-Math.PI/8;
  	this.rightSideWing.position.set(10,0,-45);
  	this.rightSideWing.castShadow = true;
  	this.rightSideWing.receiveShadow = true;
	this.mesh.add(this.rightSideWing);
	
	//左机翼
  	var geomLeftSideWing = new THREE.BoxGeometry(36,6,50,1,1,1);
  	var matLeftSideWing = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
  	this.leftSideWing = new THREE.Mesh(geomLeftSideWing, matLeftSideWing);
  	this.leftSideWing.rotation.x=Math.PI/8;
  	this.leftSideWing.rotation.y=-Math.PI/8;
  	this.leftSideWing.position.set(10,0,45);
  	this.leftSideWing.castShadow = true;
  	this.leftSideWing.receiveShadow = true;
	this.mesh.add(this.leftSideWing);
	
	//机头
	var geomHead = new THREE.SphereGeometry(20, 40, 40);
	var matHead= new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var head=new THREE.Mesh(geomHead,matHead);
	head.position.set(70,0,0);
	head.castShadow=true;
	head.receiveShadow = true;
	this.mesh.add(head);

};

//Sun=function(){
//	this.mesh = new THREE.Object3D();
//	//太阳
//	var geomSun=new THREE.SphereGeometry(60, 10,20);
//	var matSun = new THREE.MeshPhongMaterial({
//  color:Colors.orange,
//  shading:THREE.FlatShading,
//	});
//	this.sun=new THREE.Mesh(geomSun,matSun);
//	this.mesh.add(this.sun);
//}

//天空的云
Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

//大地
Ground = function(){
  this.mesh = new THREE.Object3D();
  
var geomGround=new THREE.CylinderGeometry(100,300,300,20,10);
var matGround = new THREE.MeshPhongMaterial({
    color:Colors.green,
    transparent:true,
    shading:THREE.FlatShading,
	});
var greenGround=new THREE.Mesh(geomGround,matGround);
greenGround.rotation.x=Math.PI/2;
greenGround.position.y=0;
greenGround.castShadow = true;
greenGround.receiveShadow = true;
this.mesh.add(greenGround);

//树
var geomTree=new THREE.CylinderGeometry(3,5,60,6,3);
var matTree = new THREE.MeshPhongMaterial({
    color:Colors.brown,
    transparent:true,
    shading:THREE.FlatShading,
	});
var tree=new THREE.Mesh(geomTree,matTree);

//树头
var geomTreeHead=new THREE.SphereGeometry(25, 10, 8);
var matTreeHead = new THREE.MeshPhongMaterial({
    color:Colors.deepGreen,
    transparent:true,
    shading:THREE.FlatShading,
	});
	
//树头2
var geomTreeHead2=new THREE.SphereGeometry(20, 16, 10);
var matTreeHead2 = new THREE.MeshPhongMaterial({
    color:Colors.deepGreenTwo,
    transparent:true,
    shading:THREE.FlatShading,
	});
	
var treeHead=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead.position.set(0,20,0);
treeHead.castShadow = true;
treeHead.receiveShadow = true;
tree.add(treeHead);
tree.rotation.x=Math.PI/12;
tree.position.set(10,280,-80);
tree.castShadow = true;
tree.receiveShadow = true;
this.mesh.add(tree);

var tree2=new THREE.Mesh(geomTree,matTree);
var treeHead2=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead2.position.set(0,30,0);
treeHead2.castShadow = true;
treeHead2.receiveShadow = true;
tree2.add(treeHead2);
tree2.rotation.x=Math.PI/12;
tree2.rotation.z=-Math.PI/32;
tree2.position.set(50,240,-40);
tree2.castShadow = true;
tree2.receiveShadow = true;
this.mesh.add(tree2);

var tree3=new THREE.Mesh(geomTree,matTree);
var treeHead3=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead3.position.set(0,40,0);
treeHead3.castShadow = true;
treeHead3.receiveShadow = true;
tree3.add(treeHead3);
tree3.rotation.x=Math.PI/12;
tree3.rotation.z=-Math.PI/5;
tree3.position.set(160,210,-70);
tree3.castShadow = true;
tree3.receiveShadow = true;
this.mesh.add(tree3);

var tree4=new THREE.Mesh(geomTree,matTree);
var treeHead4=new THREE.Mesh(geomTreeHead2,matTreeHead2);
treeHead4.position.set(0,30,0);
treeHead4.castShadow = true;
treeHead4.receiveShadow = true;
tree4.add(treeHead4);
tree4.rotation.x=Math.PI/12;
tree4.rotation.z=-Math.PI/4;
tree4.position.set(220,140,-40);
tree4.castShadow = true;
tree4.receiveShadow = true;
this.mesh.add(tree4);

var tree5=new THREE.Mesh(geomTree,matTree);
var treeHead5=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead5.position.set(0,50,0);
treeHead5.castShadow = true;
treeHead5.receiveShadow = true;
tree5.add(treeHead5);
tree5.rotation.y=-Math.PI/16;
tree5.rotation.z=-Math.PI/2;
tree5.position.set(280,60,-100);
tree5.castShadow = true;
tree5.receiveShadow = true;
this.mesh.add(tree5);

var tree6=new THREE.Mesh(geomTree,matTree);
var treeHead6=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead6.position.set(0,50,0);
treeHead6.castShadow = true;
treeHead6.receiveShadow = true;
tree6.add(treeHead6);
tree6.rotation.y=-Math.PI/16;
tree6.rotation.z=-Math.PI/2;
tree6.position.set(220,40,-20);
tree6.castShadow = true;
tree6.receiveShadow = true;
this.mesh.add(tree6);

var tree7=new THREE.Mesh(geomTree,matTree);
var treeHead7=new THREE.Mesh(geomTreeHead2,matTreeHead2);
treeHead7.position.set(0,30,0);
treeHead7.castShadow = true;
treeHead7.receiveShadow = true;
tree7.add(treeHead7);
tree7.rotation.y=-Math.PI/12;
tree7.rotation.z=-Math.PI*(5/8);
tree7.position.set(260,-60,-60);
tree7.castShadow = true;
tree7.receiveShadow = true;
this.mesh.add(tree7);

var tree8=new THREE.Mesh(geomTree,matTree);
var treeHead8=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead8.position.set(0,50,0);
treeHead8.castShadow = true;
treeHead8.receiveShadow = true;
tree8.add(treeHead8);
tree8.rotation.y=-Math.PI/12;
tree8.rotation.z=-Math.PI*(5/8);
tree8.position.set(220,-100,-40);
tree8.castShadow = true;
tree8.receiveShadow = true;
this.mesh.add(tree8);

var tree9=new THREE.Mesh(geomTree,matTree);
var treeHead9=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead9.position.set(0,30,0);
treeHead9.castShadow = true;
treeHead9.receiveShadow = true;
tree9.add(treeHead9);
tree9.rotation.y=-Math.PI/12;
tree9.rotation.z=-Math.PI*(6/8);
tree9.position.set(160,-220,-60);
tree9.castShadow = true;
tree9.receiveShadow = true;
this.mesh.add(tree9);

var tree10=new THREE.Mesh(geomTree,matTree);
var treeHead10=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead10.position.set(0,30,0);
treeHead10.castShadow = true;
treeHead10.receiveShadow = true;
tree10.add(treeHead10);
tree10.rotation.y=-Math.PI/6;
tree10.rotation.z=-Math.PI;
tree10.position.set(40,-280,-100);
tree10.castShadow = true;
tree10.receiveShadow = true;
this.mesh.add(tree10);

var tree11=new THREE.Mesh(geomTree,matTree);
var treeHead11=new THREE.Mesh(geomTreeHead2,matTreeHead2);
treeHead11.position.set(0,30,0);
treeHead11.castShadow = true;
treeHead11.receiveShadow = true;
tree11.add(treeHead11);
tree11.rotation.x=-Math.PI/12;
tree11.rotation.z=-Math.PI*(13/12);
tree11.position.set(-10,-260,-40);
tree11.castShadow = true;
tree11.receiveShadow = true;
this.mesh.add(tree11);

var tree12=new THREE.Mesh(geomTree,matTree);
var treeHead12=new THREE.Mesh(geomTreeHead2,matTreeHead2);
treeHead12.position.set(0,30,0);
treeHead12.castShadow = true;
treeHead12.receiveShadow = true;
tree12.add(treeHead12);
tree12.rotation.x=-Math.PI/12;
tree12.rotation.z=-Math.PI*(7/6);
tree12.position.set(-120,-240,-60);
tree12.castShadow = true;
tree12.receiveShadow = true;
this.mesh.add(tree12);

var tree13=new THREE.Mesh(geomTree,matTree);
var treeHead13=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead13.position.set(0,30,0);
treeHead13.castShadow = true;
treeHead13.receiveShadow = true;
tree13.add(treeHead13);
tree13.rotation.x=-Math.PI/12;
tree13.rotation.z=-Math.PI*(8/6);
tree13.position.set(-270,-140,-120);
tree13.castShadow = true;
tree13.receiveShadow = true;
this.mesh.add(tree13);

var tree14=new THREE.Mesh(geomTree,matTree);
var treeHead14=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead14.position.set(0,30,0);
treeHead14.castShadow = true;
treeHead14.receiveShadow = true;
tree14.add(treeHead14);
tree14.rotation.x=-Math.PI/12;
tree14.rotation.z=-Math.PI*(8/6);
tree14.position.set(-200,-150,40);
tree14.castShadow = true;
tree14.receiveShadow = true;
this.mesh.add(tree14);

var tree15=new THREE.Mesh(geomTree,matTree);
var treeHead15=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead15.position.set(0,30,0);
treeHead15.castShadow = true;
treeHead15.receiveShadow = true;
tree15.add(treeHead15);
tree15.rotation.x=-Math.PI/10;
tree15.rotation.z=-Math.PI*(9/6);
tree15.position.set(-270,0,-60);
tree15.castShadow = true;
tree15.receiveShadow = true;
this.mesh.add(tree15);

var tree16=new THREE.Mesh(geomTree,matTree);
var treeHead16=new THREE.Mesh(geomTreeHead,matTreeHead);
treeHead16.position.set(0,30,0);
treeHead16.castShadow = true;
treeHead16.receiveShadow = true;
tree16.add(treeHead16);
tree16.rotation.z=-Math.PI*(10/6);
tree16.position.set(-200,160,-50);
tree16.castShadow = true;
tree16.receiveShadow = true;
this.mesh.add(tree16);

}

//云
Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  
  //var geom = new THREE.SphereGeometry(25, 10, 10);
 var geom = new THREE.CubeGeometry(20,20,20);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
    
  	});

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

//场景元素
var ground,sun;
var airplane;

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function createGround(){
  ground = new Ground();
  ground.mesh.position.y = -250;
//ground.mesh.rotation.z =0.4;
  scene.add(ground.mesh);
}

function createSun(){
  sun = new Sun();
  sun.mesh.position.y = 100;
  sun.mesh.position.x =200;
  scene.add(sun.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

//物体移动
function loop(){
  updatePlane();
  ground.mesh.rotation.z +=.005;
//sun.mesh.rotation.z +=.005;
  sky.mesh.rotation.z += .01;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

//随鼠标移动
function updatePlane(){
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-80, 100);
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  airplane.leftSideWing.rotation.z+=0.1;
  airplane.rightSideWing.rotation.z+=0.1;
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}


function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createPlane();
  createGround();
  createSky();
//createSun();
  loop();
}

//鼠标移动触发事件
var mousePos = { x: 0, y: 0 };
function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
