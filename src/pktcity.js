
class PktCityIP {
    constructor(ip, time) {
        this.ip = ip;
        this.time = Date.parse(time);
        this.mesh = undefined;
    }

}

function PktCityCreateMesh(pktip, x, z, material, scene, time) {
    /* FIXME regle de trois sur le temps */
    var height = (time - pktip.time)/(1000 * 500);
    console.log(height);
    pktip.mesh = BABYLON.Mesh.CreateCylinder("cylinder", height, 1, 1, 16, 1, scene);
    pktip.mesh.position.x = x;
    pktip.mesh.position.z = z;
    /* TODO set time */
    //pktip.mesh.material = materialCylinder;
return;
}


/*
class PktCityAlert {
    constructor(jdata) {
        this.source = PktCityIPjdata['alert']['source']['ip'];
        this.target = jdata['alert']['target']['ip'];
        this.time = date.Parse();
    }
}
*/

function PktCityCreateScene(data) {

        // Get the data
        var lines = data.slice(0, -1).split('\n');
        var events = [];
        var SceneIPs = {};
        lines.forEach(function(item, index, array) {
            try {
                events.push(JSON.parse(item));
            }
            catch (err) {
                console.log(err);
            }
        });
        events.forEach(function(item, index, array) {
            if (!(item['alert']['source']['ip'] in SceneIPs)) {
                var evip = new PktCityIP(item['alert']['source']['ip'], item['timestamp']);
                SceneIPs[item['alert']['source']['ip']] = evip;
            }
            if (!(item['alert']['target']['ip'] in SceneIPs)) {
                var evip = new PktCityIP(item['alert']['target']['ip'], item['timestamp']);
                SceneIPs[item['alert']['target']['ip']] = evip;
            }
        });
        console.log(Object.keys(SceneIPs).length);
        // Get the canvas element from our HTML below
        var canvas = document.querySelector("#renderCanvas");
        // Load the BABYLON 3D engine
        var engine = new BABYLON.Engine(canvas, true);
        // -------------------------------------------------------------
        // Here begins a function that we will 'call' just after it's built
        var createScene = function() {
                // Now create a basic Babylon Scene object
                var scene = new BABYLON.Scene(engine);
                // Change the scene background color to green.
                scene.clearColor = new BABYLON.Color3(0, 1, 0);
                // This creates and positions a free camera
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(15, 20, -15), scene);
                // This targets the camera to scene origin
                camera.setTarget(new BABYLON.Vector3(0, 10, 0));
                // This attaches the camera to the canvas
                camera.attachControl(canvas, false);
                // This creates a light, aiming 0,1,0 - to the sky.
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Dim the light a small amount
                light.intensity = .5;

                var materialCylinder = new BABYLON.StandardMaterial("texture1", scene);
                materialCylinder.alpha = 1;
                var i = 0;
                var mod = Math.ceil(Math.sqrt(Object.keys(SceneIPs).length));
                /* FIXME we need to sort them by IP value */
                for (var scIP in SceneIPs) {
                    var x = Math.floor(i / mod);
                    var z = i % mod;
                    /* scale value */
                    x = x * 30 / mod;
                    z = z * 30 / mod;
                    i++;
                    console.log(scIP);
                    time = Date.parse("2016-12-07T17:24:53.139833+0100"); // - 3600 * 1000;
                    PktCityCreateMesh(SceneIPs[scIP], x, z, materialCylinder, scene, time);
                }

                // Let's try our built-in 'ground' shape. Params: name, width, depth, subdivisions, scene
                var materialGround = new BABYLON.StandardMaterial("texture1", scene);
                materialGround.alpha = 1;
                var ground = BABYLON.Mesh.CreateGround("ground1", 1000, 1000, 2, scene);
                ground.material = materialGround;
                // Leave this function
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;	
                skybox.infiniteDistance = true;
                skyboxMaterial.disableLighting = true;

                return scene;
        }; // End of createScene function

        // -------------------------------------------------------------
        // Now, call the createScene function that you just finished creating
        var scene = createScene();
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
                        scene.render();
                        });
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                        engine.resize();
                        });


}
