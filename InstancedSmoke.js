/*
Une classe pour générer de la fumée de maniere a peu pres optimisee
la fumee est "belle " avec des parametres de densite de 10-30 , un maxLevel aux alentours de 150-300, et une climbSpeed de 0.06
la fumee ne prend pas vraiment en compte les fps , et se déplace donc en fonction des fps
*/


class InstancedSmoke
{
    constructor(posX , posY, posZ , density , maxLevel , climbSpeed , scene)
    {

        this.particlePerLevel = density;
        this.maxLevel = maxLevel;
        this.climbSpeed = climbSpeed;
        this.opacityReduction = 1- (1/(this.maxLevel*0.3));
        this.instances = 0;
        this.currentMaxLevel = 0;



        //on initialise la position de base des particules
        this.translateArray = new Float32Array(this.particlePerLevel * this.maxLevel * 3);
        for (var i = 0, i3 = 0, l = this.particlePerLevel * this.maxLevel; i < l; i++ , i3 += 3)
        {
            this.translateArray[i3 + 0] = 0;
            this.translateArray[i3 + 1] = 0;
            this.translateArray[i3 + 2] = 0;
        }

        //leur opacité
        this.opacityArray = new Float32Array(this.particlePerLevel*this.maxLevel);
        for(let i=0 ; i<this.particlePerLevel* this.maxLevel ; i++)
        {
            this.opacityArray[i] = 1.0;
        }


        //leur material
        let material = new THREE.RawShaderMaterial({
            uniforms: {
                "opacity_uniform": {value: 0.1}

            },
            vertexShader: document.getElementById('vshader').textContent,
            fragmentShader: document.getElementById('fshader').textContent,
            depthTest: true,
            depthWrite: false,
            transparent: true
        });




        ///on donne une forme aux particules
        this.geometry = new THREE.InstancedBufferGeometry();
        let geometryForm = new THREE.PlaneBufferGeometry(0.5, 0.5);
        this.geometry.index = geometryForm.index;
        this.geometry.attributes = geometryForm.attributes;

        let mesh = new THREE.Mesh(this.geometry, material);
        scene.add(mesh);
        mesh.translateX(posX);
        mesh.translateY(posY);
        mesh.translateZ(posZ);

        //on associe les attributs
        this.translateAttribute = new THREE.InstancedBufferAttribute(this.translateArray, 3);
        this.opacityAttribute = new THREE.InstancedBufferAttribute(this.opacityArray, 1);

        this.geometry.setAttribute('translate', this.translateAttribute); // un new a chaque boucle
        this.geometry.setAttribute('opacity', this.opacityAttribute);



    }

    // a appeler a chaque frame pour passer a la suivante
    nextParticleInstance()
    {

        // permet d'éviter que les particules montent a l'infini
        this.currentMaxLevel++;
        if (this.currentMaxLevel > this.maxLevel)
        {
            this.currentMaxLevel = this.maxLevel;

        }
        //nbr de particules actuelles
        this.instances = this.particlePerLevel * this.currentMaxLevel;




        this.geometry.maxInstancedCount = this.instances;

        //met a jour la position et l'opacité des particules
        for (var i = 0, i3 = 0, l = this.instances; i < l; i++ , i3 += 3)
        {

            this.translateArray[i3 + 0] += (Math.random() * 0.2 - 0.1) * (1 + this.translateArray[i3 + 1]/13);
            this.translateArray[i3 + 1] += this.climbSpeed;
            this.translateArray[i3 + 2] += (Math.random() * 0.2 - 0.1)*(1 + this.translateArray[i3 + 1]/13);
            //le random est la pour ne pas avoir une coupure nette
            if (this.translateArray[i3 + 1] + Math.random() >= this.climbSpeed * this.maxLevel)
            {
                this.translateArray[i3 + 0] = 0;
                this.translateArray[i3 + 1] = 0;
                this.translateArray[i3 + 2] = 0;
                this.opacityArray[i3/3] = 1;
            }
            this.opacityArray[i3/3] = this.opacityArray[i3/3]*this.opacityReduction;

        }
        this.translateAttribute.needsUpdate = true;
        this.opacityAttribute.needsUpdate = true;
   


}



}