/*
* Simple Panorama - Joomla Module 
* Version			: 1.2.6 
* Package			: Joomla 3.9.x
* copyright 		: Copyright (C) 2021 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
* From              : pano : https://github.com/seancoyne/pano
*/

(function (factory) {
  if(typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(function(jQuery) {
	jQuery.fn.pano = function(options){
		this.version = "1.2.6";
		var $anim = options.anim; 
		var $pano = this;
		var $leftCtrl = $pano.find(".controls").find("p.left");
		var $rightCtrl = $pano.find(".controls").find("p.right");
		var $centerCtrl = $pano.find(".controls").find("p.center");
		var $panoWidth  = $pano.width();
		var getImageInfo = function(imgSrc) {
			var img = new Image();
			img.src = imgSrc;
			return img;
		};
		var img_360 = (options.img360 == 1);
		var imgWidth = getImageInfo(options.img).width;
		var imgHeight = getImageInfo(options.img).height;
		var imgRatio = options.height / imgHeight; 
		var moveBackgroundTo = function(newPos, duration, cb) {		
			duration = duration || 0;
			cb = cb || function(){};
			$pano.animate({
				"background-position": newPos.toString() + "px"
			}, duration, "linear", cb);
		};
		var moveBackgroundBy = function(distance, duration, cb) {
			duration = duration || 0;
			cb = cb || function(){};
		/*	var newMarginLeft = parseInt($pano.css('background-position'))+distance;
			var elem_width = (imgWidth * imgRatio) - clientWidth ;
			if ((!img_360) && (newMarginLeft > 0)) newMarginLeft = 0;
			if ((!img_360) && (newMarginLeft < -elem_width )) newMarginLeft = -elem_width; */
			moveBackgroundTo(newMarginLeft, duration, cb);
		};
		var getCurrentPosition = function() {
			var curr = $pano.css("background-position");
			return parseInt($pano.css("background-position").split(" ")[0].replace("px", ""));
		};
		var indicateMovement = function() {
			$pano.addClass("moving");
		};
		var noMovement = function() {
			$pano.removeClass("moving");
		};
		var dragMove = function(xPos, startPosition, cb) {
			var diff = (xPos - startPosition);
			moveBackgroundBy(diff, 0, cb);
		};
		var leftMover,
			rightMover,
			ctrlInterval = options.interval || 100,
			ctrlSpeed = options.speed || 50;
		$pano.css({
			"background-image": "url('" + options.img + "')",
		 	"background-position": "50% 50%",
			"background-size": "auto 100%",
			"background-repeat": "repeat-x"
		});
		var clientWidth = $pano.css("width").replace("px", "");
		var halfWidth = (getImageInfo(options.img).width/ 2 );
		moveBackgroundBy(halfWidth, 0);

		var intervalId;
		function goAnim() {
			if (!($anim == "no")) 	{
				if ($anim == "left") { 
					moveBackgroundBy(ctrlSpeed, 5000); 
					$centerCtrl.text("<");
					}
				else {
					moveBackgroundBy(-ctrlSpeed, 5000); 
					$centerCtrl.text(">");
				};
			}
		}
		function animation() {
			goAnim();
			intervalId = setInterval(goAnim,2000);	
		}
		$centerCtrl.css("display","none");
		animation();
		var moveLeft = function(interval, speed) {
			interval = interval || ctrlInterval;
			speed = speed || 50;
			indicateMovement();
			moveBackgroundBy(speed, 100);
			leftMover = setInterval(function(){
				moveBackgroundBy(speed, 100);
			}, interval);
		};
		var moveRight = function(interval, speed) {
			interval = interval || ctrlInterval;
			speed = speed || 50;
			indicateMovement();
			moveBackgroundBy(-speed, 100);
			rightMover = setInterval(function(){
				moveBackgroundBy(-speed, 100);
			}, interval);
			$centerCtrl.text(">");
		};
		var stopMoving = function() {
			$pano.off("touchmove");
			$pano.off("mousemove");
			$pano.stop(true, true);
			clearInterval(leftMover);
			clearInterval(rightMover);
			clearInterval(intervalId);
			noMovement();
			if (!($anim == "no")) 	{
				$centerCtrl.css("display","initial");
			}
		};
		$leftCtrl.on("mousedown", function(event){
			event.stopPropagation();
			stopMoving();
			moveLeft();
			if (!($anim == "no")) 	{
				$anim = "left"; 
				$centerCtrl.text("<");			
			}
		}).on("touchstart", function(event){
			event.stopPropagation();
			clearInterval(intervalId);
			event.preventDefault();
			moveLeft();
			if (!($anim == "no")) 	{
				$anim = "left";
				$centerCtrl.text("<");			
			}
		});
		$rightCtrl.on("mousedown", function(event){
			event.stopPropagation();
			stopMoving();
			moveRight();
			if (!($anim == "no")) 	{
				$anim = "right"; 
				$centerCtrl.text(">");			
			}
		}).on("touchstart", function(event){
			event.stopPropagation();
			stopMoving();
			event.preventDefault();
			moveRight();
			if (!($anim == "no")) 	{
				$anim = "right";
				$centerCtrl.text(">");			
			}
		});
		$centerCtrl.on("mouseup", function(event){
			stopMoving();
			indicateMovement();
			event.stopPropagation();
			event.preventDefault();
			animation();
			$centerCtrl.css("display","none"); 
		}).on("touchend", function(event){
			stopMoving();
			indicateMovement();
			event.stopPropagation();
			event.preventDefault();
			animation();
			$centerCtrl.css("display","none"); 
		});
		$pano.on("mousedown", function(event){
			indicateMovement();
			stopMoving();
			var startPosition = event.pageX;
			$pano.on("mousemove", function(event){
				var xPos = event.pageX;
				dragMove(xPos, startPosition, function(){
					startPosition =xPos;
				});
			});
		}).on("touchstart", function(event){
			indicateMovement();
			stopMoving();
			event.preventDefault();
			var startPosition = event.pageX;
			$pano.on("touchmove", function(event){
				var xPos = event.originalEvent.changedTouches[0].pageX;
				dragMove(xPos, startPosition, function(){
					startPosition = xPos;
				});
			});
		});
		$pano.bind('mouseover', function(){
					$pano.find('.panorama-control').show();
					return false;
				}).bind('mouseout', function(){
					$pano.find('.panorama-control').hide();
					return false;
				});
		
		jQuery("body").on("mouseup", function(){
			stopMoving();
		}).on("touchend", function(){
			stopMoving();
		});
		return {
			moveLeft: moveLeft,
			moveRight: moveRight,
			stopMoving: stopMoving
		};
	};
}));