/**
 * GameScene
 * A template game scene
 */
GameScene = pc.Scene.extend('GameScene',
    { },
    {
        gameLayer:null,
        boxes:null,

        init:function ()
        {
            this._super();

            this.boxes = [];

            //-----------------------------------------------------------------------------
            // game layer
            //-----------------------------------------------------------------------------
            this.gameLayer = this.addLayer(new pc.EntityLayer('game layer', 10000, 10000));

            // all we need is the render and effects systems
            this.gameLayer.addSystem(new pc.systems.Render());
            this.gameLayer.addSystem(new pc.systems.Effects());
			this.gameLayer.addSystem(new pc.systems.DragAndDrop());

             for (var i = 0; i < 3; i++)
             {
                var box = pc.Entity.create(this.gameLayer);                
				box.addComponent(pc.components.Spatial.create({ x:200 + (i * 100), y:200, w:75, h:75 }));
                box.addComponent(pc.components.Rect.create({ color:[ pc.Math.rand(0, 255), pc.Math.rand(0, 255), pc.Math.rand(0, 255) ] }));
				box.addComponent(pc.components.Input.create(
				{
					states: [
						 ['clicking box', ['MOUSE_BUTTON_LEFT_DOWN'], false],
					],
					actions: [
							
							['box clicked', ['MOUSE_BUTTON_LEFT_DOWN']],
							['box clicked moved', ['MOUSE_MOVE']],
							['box unclicked', ['MOUSE_BUTTON_LEFT_UP']],
							['box touched', ['TOUCH']],
							['box touched stopped', ['TOUCH_END']],
							['box touched moved', ['TOUCH_MOVE']]
					]
				}));

                 this.boxes.push(box);
             }

            

        },

        // handle menu actions
        onAction:function (actionName, event, pos, uiTarget)
        {
            
        },

        process:function ()
        {
            // clear the background
            pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);

            // always call the super
            this._super();

            //
            // ... do extra processing in here
            //
        }
    });
