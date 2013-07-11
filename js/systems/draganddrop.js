/**
 * Playcraft Engine - (C)2012 Playcraft Labs, Inc.
 * See licence.txt for details
 */

/**
 * @class pc.systems.DragandDrop
 * @description
 * [Extends <a href='pc.systems.System'>pc.systems.System</a>]
 * <p>
 * A drag and drop system that allows for spatials to be dragable and drop using touch and mouse controls
 */

pc.systems.DragAndDrop = pc.systems.Input.extend('pc.systems.DragAndDrop',
    {
    },
    {
        /**
                 * Constructs (or acquires from the pool) a spatial component configuring it with the given options            
                 * @param {pc.Scene} options.scene Action Current scene object that the entity is a member of
                 * @return {pc.components.DragAndDrop} A shiney new component
                 */

        /** Dimensions and position of the spatial component */
        spatialX: null,
        spatialY: null,
        spatialW: null,
        spatialH: null,  
        /** the offset position helps keep the entity centered on the mouse point during the dragging process */
        offSetX: null,
        offSetY: null,
        prevMouseX: null,
        prevMouseY: null,        
        velocityX: null,
        velocityY: null,
        constants: null,
        entity: null,		
		
        /**
         * Constructs a new component. See create method for options
         * @param {Object} options Options
         */
        init: function () {
            this._super(['input'], 60);            
        },
        onAction: function (actionName, event, pos, uiTarget) {
            
            this.entity = uiTarget.getEntity();
        
            if (this.entity.getComponent('spatial') === null) {
                throw "Error: Spatial component not added.";
            }

            /** load the spatials dimensions and position */
            this.spatialX = this.entity.getComponent('spatial').pos.x;
            this.spatialY = this.entity.getComponent('spatial').pos.y;
            if (this.spatialH === null && this.spatialW === null) {
                this.spatialH = this.entity.getComponent('spatial').getScreenRect().h;
                this.spatialW = this.entity.getComponent('spatial').getScreenRect().w;
            }


            // ensure we have an action and a position from the OnAction event handler in the caliing scene
            if (actionName !== null && pos !== null) {
                //touch Event
                if (this.getAction(actionName) === 'TOUCH') {

                    // make sure touch is within the spatial 
                    // offset the spatial to keep the pointer in the middle of the shape
						this.entity.addTag('dragging');
						this.deactiveSpatials();
                        this.offSetX = pos.x - this.spatialX;
                        this.offSetY = pos.y - this.spatialY;
                }
                // move during a touch event
                if (this.getAction(actionName) === 'TOUCH_MOVE') {
                    //Speed set to 5 seems to make the motion the most fluid.  Speed and the easevalue can be tweaked
                    var dx = 0, dy = 0, theta = 0, newVelocityX = 0, newVelocityY = 0, speed = 5, easevalue = .05;
                    //providing acceleration for smoothing pointer movement
                    dx = pos.x - this.prevMouseX;
                    dy = pos.y - this.prevMouseY;

                    theta = Math.atan2(dy, dx);

                    newVelocityX = Math.cos(theta) * speed;
                    newVelocityY = Math.sin(theta) * speed;
                    this.velocityX = (this.velocityX + newVelocityX) * easevalue;
                    this.velocityY = (this.velocityY + newVelocityY) * easevalue;

                        if (this.offSetX > 0 && this.offSetY > 0) {
                            this.entity.getComponent('spatial').pos.y = pos.y - this.offSetY + this.velocityY;
                            this.entity.getComponent('spatial').pos.x = pos.x - this.offSetX + this.velocityX;
                        }
                    //}
                }
                if (this.getAction(actionName) === 'TOUCH_END') {
                    // no offset, no drag.  hence a drop					
                    this.offSetX = 0;
                    this.offSetY = 0;
					this.entity.removeTag('dragging');
					this.activateSpatials();
                }
                // mouse actions, left mouse click
                if (this.getAction(actionName) === 'MOUSE_BUTTON_LEFT_DOWN') {
				   
						this.entity.addTag('dragging');
						this.deactiveSpatials();
						this.offSetX = pos.x - this.spatialX;
                        this.offSetY = pos.y - this.spatialY;
                }           
                // mouse move
                if (this.getAction(actionName) === 'MOUSE_MOVE') {
                    if (this.offSetX > 0 && this.offSetY > 0) {                				
                        //check input state if the user is holding the left mouse button                        
                        if (this.isInputState(this.entity, this.getStateName('MOUSE_BUTTON_LEFT_DOWN')) && this.entity.hasTag('dragging')) {
							var dx = 0, dy = 0, theta = 0, newVelocityX = 0, newVelocityY = 0, speed = 5, easevalue = .5;

							//providing card acceleration for smoothing mouse movement
							dx = pos.x - this.prevMouseX;
							dy = pos.y - this.prevMouseY;
							theta = Math.atan2(dy, dx);

							newVelocityX = Math.cos(theta) * speed;
							newVelocityY = Math.sin(theta) * speed;
							this.velocityX = (this.velocityX + newVelocityX) * easevalue;
							this.velocityY = (this.velocityY + newVelocityY) * easevalue;
                
                            //move the component with the mouse
                            this.entity.getComponent('spatial').pos.x = Math.floor((pos.x - this.offSetX) + this.velocityX);
                            this.entity.getComponent('spatial').pos.y = Math.floor((pos.y - this.offSetY) + this.velocityY);
                        }
                        else {
                            this.offSetX = 0;
                            this.offSetY = 0;                         
                        }
                    }
                }
				 if (this.getAction(actionName)  === 'MOUSE_BUTTON_LEFT_UP') {
				 // cancel entity
					this.entity.removeTag('dragging');
					this.activateSpatials();
                }
                
            }
            this.prevMouseX = pos.x;
            this.prevMouseY = pos.y;

        },
		/**
		 * Translates the action name to the playcraft action 
		 * this keeps the system generic and no dependant on user defined values for action names
		 */
		getAction: function(actionName){
			var arrNames, arrActions;
			for(var i = 0; i < this.entity.getComponent('input').actions.length; i++){
				arrNames = this.entity.getComponent('input').actions[i]
				if(actionName == arrNames[0])
				{
					arrActions = arrNames[1]
					return arrActions[0];
				}
			}
			
		},
		/**
		 * Translates the state to the state name for determine if state by generic playcraft
		 * state names instead of user defined state names
		 */
		getStateName: function(state){
			var arrNames, arrStates;
			for(var i = 0; i < this.entity.getComponent('input').states.length; i++){
				arrNames = this.entity.getComponent('input').states[i]
				arrStates = arrNames[1];
				if(state == arrStates[0])
					return arrNames[0];
			}
		},
		/**
		 *  Updates all spatials input component's active state to false
		 *  This allows us to only act on the entity that is currently 
		 *  being dragged
		 */
		deactiveSpatials: function(){
			var next = this.entities.first;
            while (next)
            {
                if(!next.obj.hasTag('dragging')){			
					next.obj.getComponent('spatial').active = false;			
				}
				next = next.next();
            }
		},
		/**
		 * Sets input component to active for all spatials
		 * Essentially resets all entities to accept input up dropping an entity
		 */ 
		activateSpatials: function(){
			var next = this.entities.first;
            while (next)
            {
				next.obj.getComponent('spatial').active = true;				
                next = next.next();
            }
		},
        process: function (entity) {		
				this._super(entity);                    					
        }
    });
