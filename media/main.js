// This script will be run within the webview itself

// It cannot access the main VS Code APIs directly.
(function () {
    var state = 'idle'; // idle, walking-right, walking-left, climbing right
    const vscode = acquireVsCodeApi();
    var pet = document.getElementsByClassName("pet")[0];
    var petRoot = basePetUri;
    const oldState = vscode.getState();
    var idleCounter = 0;
    var petLeft = 0;
    var petBottom = 0;

    function faceLeft(){
        pet.style.webkitTransform = "scaleX(-1)";
    }

    function faceRight(){
        pet.style.webkitTransform = "scaleX(1)";
    }

    function setAnimation(face){
        if (pet.src === petRoot + face){
            return;
        }
        pet.src = petRoot + face;
    }

    function sitIdle(){
        setAnimation('/bwcat_idle_blink_8fps.gif');
        idleCounter++;
        if (idleCounter > 50) { // Sit for 5 seconds
            idleCounter = 0;
            return true ;
        }
    }

    function wallHangLeft(){
        setAnimation('/bwcat_wallgrab_8fps.gif');
        idleCounter++;
        if (idleCounter > 50) { // Sit for 5 seconds
            idleCounter = 0;
            return true ;
        }
    }

    function stepRight(){
        faceRight();
        setAnimation('/bwcat_sneak_8fps.gif');
        petLeft += 1;
        pet.style.left = `${petLeft}px`;
        if (petLeft >= (window.innerWidth - 30))
        {
            return true;
        }
    }

    function stepLeft(){
        faceLeft();
        setAnimation('/bwcat_sneak_8fps.gif');
        petLeft -= 1;
        pet.style.left = `${petLeft}px`;
        if (petLeft <= 0)
        {
            return true;
        }
    }

    function climbUpLeft(){
        faceLeft();
        setAnimation('/bwcat_wallclimb_8fps.gif');
        petBottom += 1;
        pet.style.bottom = `${petBottom}px`;
        if (petBottom >= 100)
        {
            return true;
        }
    }

    function climbDownLeft(){
        faceLeft();
        setAnimation('/bwcat_wallclimb_8fps.gif');
        petBottom -= 1;
        pet.style.bottom = `${petBottom}px`;
        if (petBottom <= 0)
        {
            return true;
        }
    }

    function nextPosition(){
        if (state === 'idle'){
            if (sitIdle()) {
                state = 'walking-right';
            }
        } else if (state === 'walking-right'){
            if (stepRight()){
                state = 'walking-left';
            }
        } else if (state === 'walking-left'){
            if (stepLeft()){
                state = 'climbing-up-left';
            }
        } else if (state === 'climbing-up-left'){
            if (climbUpLeft()){
                state = 'wall-hang-left';
            }
        } else if (state === 'wall-hang-left'){
            if (wallHangLeft()){
                state = 'climbing-down-left';
            }
        } else if (state === 'climbing-down-left'){
            if (climbDownLeft()){
                state = 'idle';
            }
        }
    }
    function startAnimations(){
        setInterval(() => {
            nextPosition();
        }, 100);
    }

    console.log("Using path " + petRoot);
    startAnimations();

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {

        }
    });

}());