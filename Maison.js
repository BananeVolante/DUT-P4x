class Maison
{
    constructor(posX, posZ, scene)
    {
        this.baseMaison = new THREE.Mesh( // sphere de cote 1
            new THREE.CubeGeometry(7, 6, 9),
            new THREE.MeshLambertMaterial({ color: "#b8c49f" })    
        );
        this.baseMaison.castShadow = true;
        this.baseMaison.receiveShadow = true;
        this.baseMaison.translateX(3.5 + posX);
        this.baseMaison.translateZ(4.5 + posZ);
        this.baseMaison.geometry.faces.splice(4,4);
        scene.add(this.baseMaison);
            
        

        this.geometryToit = new THREE.Geometry();
        this.geometryToit.vertices = [
            //la base
            new THREE.Vector3(0, 6, 0),
            new THREE.Vector3(7, 6, 0),
            new THREE.Vector3(7, 6, 9),
            new THREE.Vector3(0, 6, 9),
            //le haut
            new THREE.Vector3(3.5, 8, 7),
            new THREE.Vector3(3.5, 8, 2)

        ]
        this.geometryToit.faces = [
           // new THREE.Face3(0, 3, 1),
            //new THREE.Face3(2, 1, 3),
            new THREE.Face3(0, 5, 1),
            new THREE.Face3(3, 2, 4),
            new THREE.Face3(0, 3, 4),
            new THREE.Face3(4, 5, 0),
            new THREE.Face3(2, 1, 5),
            new THREE.Face3(4, 2, 5)
        ]
        this.geometryToit.computeFaceNormals();

        this.toitMaison = new THREE.Mesh(
            this.geometryToit,
            new THREE.MeshLambertMaterial({ color: "#ab7b3e" })
        );
        this.toitMaison.translateY(-3);
        this.toitMaison.translateX(posX);
        this.toitMaison.translateZ(posZ);
        this.toitMaison.castShadow = true;
       // this.toitMaison.receiveShadow = true;// pour éviter les artefacts
        scene.add(this.toitMaison);

    }


}