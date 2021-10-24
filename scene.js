
var W = 1000;
var H = 700;

var container = document.querySelector('#threejsContainer');

var scene, camera;

var geometry, mesh;

var material;

//fonction pour placer un objet au sol(a faire apres rotation)
function onTheGround(object) {
        var lowestPoint = Infinity; // wooooooo
        object.children.forEach(child => {
                child.geometry.computeBoundingBox();
                var boundingBox =  child.geometry.boundingBox;
                var y =  boundingBox.min.y;
                if(y<lowestPoint)
                {
                        lowestPoint = y;
                }
        })
    object.translateY(-lowestPoint);  

}
//plus utilisée , juste utilisée pour tester les changements de lumiere
function changeLights(ambientLight , hemisphereLight) {
        if(ambientLight.intensity ==0)
        {
                hemisphereLight.intensity =0;
                ambientLight.intensity = 0.3;
                console.log("switched to ambient Light");

        }else
        {
                hemisphereLight.intensity = 0.3;
                ambientLight.intensity = 0;  
                console.log("switched to hemisphere  Light");

        }

}


function onProgress(xhr) {
        console.log(("object " + xhr.loaded / xhr.total * 100) + '% loaded');

}

function onError(error)
{

        console.log('An error happened');

}




function init() {        
        //la scene
        scene = new THREE.Scene();        


        //la camera
        camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.set(0, 10, 10);
        camera.lookAt(scene.position);
        scene.add(camera);
        //le renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(W, H);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
        container.appendChild(renderer.domElement);
        //le fond
        const loader = new THREE.TextureLoader();
        loader.load('textures/paradis.jpg ', function (texture)
        {
                scene.background = texture;
        });

        //les controles
        var controls = new THREE.OrbitControls(camera , renderer.domElement); 
        //le repere
        var axesHelper = new THREE.AxesHelper( 30 );
        scene.add( axesHelper );
        //le sol
        var plan = new THREE.Mesh( // pseudo plan
                new THREE.PlaneGeometry(10000, 10000),
                new THREE.MeshPhongMaterial({ color: "#6e5a48" })

        );
        plan.rotateX(- Math.PI/2);
        plan.receiveShadow = true;
        scene.add(plan);


        //creation menu
        var lightPos = {
                x: 10,
                y: 10,
                z: 10
        };

        var gui = new dat.GUI();

        var folderLight = gui.addFolder(' light isettings');

        var lightposX = folderLight.add(lightPos, "x").min(-30).max(30).step(1).listen();
        var lightposY = folderLight.add(lightPos, "y").min(-30).max(30).step(1).listen();
        var lightposZ = folderLight.add(lightPos, "z").min(-30).max(30).step(1).listen();



        folderLight.open();
        var light = new THREE.PointLight(0xffffff, 2, 0, 2);
        dict['light'] = light;
        light.castShadow = true;
        light.position.set(lightPos.x, lightPos.y, lightPos.z);
        scene.add(light);
        var sphere = new THREE.Mesh( // sphere de cote 1
                new THREE.SphereGeometry(1, 20, 20),
                new THREE.MeshBasicMaterial({ color: "#00FF00" })
        );
        sphere.position.set(lightPos.x, lightPos.y, lightPos.z);
        scene.add(sphere);

        lightposX.onChange(
                function (value) 
                {
                        light.position.x = value;
                        sphere.position.x = value;
                        //testShaderMaterial.uniforms["lightPos"].value = light.position;

                }
        );
        lightposY.onChange(
                function (value) 
                {
                        light.position.y = value;
                        sphere.position.y = value;
                        //testShaderMaterial.uniforms["lightPos"].value = light.position;

                }
        );
        lightposZ.onChange(
                function (value) 
                {
                        light.position.z = value;
                        sphere.position.z = value;
                      //  testShaderMaterial.uniforms["lightPos"].value = light.position;
                }
        );



        

        scene.add(new THREE.AmbientLight("#FFFFFF", 0.8));
	
 
        

        //on cree les maisons
        var listeMaison = [];
        for(let block = 0 ; block<7 ; block++)
        {
                for (let i = 0; i < 10; i++)
                {
                        listeMaison[i] = [];
                        for (let j = 0; j <2 ; j++)
                        {
                                listeMaison[i][j] = new Maison(10 * i, 10 * j + 30*block, scene);
                        }
                }   
		}
	
        dict["instancedSmokeGen"] = new InstancedSmoke(-10,0,-10,30,150,0.06,scene);



		
}




function animate() {    
       dict["instancedSmokeGen"].nextParticleInstance();
     




	//console.log(renderer.info.render.calls);
	requestAnimationFrame(animate);
	renderer.render(scene, camera);     
}
 
var dict = {}; // pour éviter d'avoir 30000 variables globales visibles
var scene;
init();
animate();
