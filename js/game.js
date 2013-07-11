/**
 * A sample game.js for you to work from
 */

TheGame = pc.Game.extend('TheGame',
    { },
    {
        gameScene:null,

        onReady:function ()
        {
            this._super();

            // disable caching when developing
             if (pc.device.devMode)
               pc.device.loader.setDisableCache();

            // no resources are loaded in this template, so this is all commented out
            // pc.device.loader.add(new pc.Image('an id', 'images/an image.png'));

            //if (pc.device.soundEnabled)
            //   pc.device.loader.add(new pc.Sound('fire', 'sounds/fire', ['ogg', 'mp3'], 15));

            // fire up the loader
            pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
			//pc.device.showDebug=true;
        },

        onLoading:function (percentageComplete)
        {
            // draw title screen -- with loading bar
        },

        onLoaded:function ()
        {
            // create the game scene (notice we do it here AFTER the resources are loaded)
            this.gameScene = new GameScene();
            this.addScene(this.gameScene);

            

            // resources are all ready, start the main game scene
            // (or a menu if you have one of those)
            this.activateScene(this.gameScene);
        },

        activateMenu:function()
        {
            this.deactivateScene(this.gameScene);
            
        },

        deactivateMenu:function()
        {
            
            this.activateScene(this.gameScene);
        }
    });


