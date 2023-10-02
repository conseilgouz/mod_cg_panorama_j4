/**
* CG Panorama - Joomla Module 
* Version			: 2.1.3
* Package			: Joomla 4.x - 5.x
* copyright 		: Copyright (C) 2023 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
*/
var pano = [];

document.addEventListener('DOMContentLoaded', function() {
	mains = document.querySelectorAll('.cg_pano');
	for(var i=0; i<mains.length; i++) {
		var $this = mains[i];
		var myid = $this.getAttribute("data");
		if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
			console.error('Joomla.getOptions not found!\nThe Joomla core.js file is not being loaded.');
			return false;
		}
		me = "#cg_pano_"+myid+" ";
		options = Joomla.getOptions('mod_cg_pano_'+myid);

		if (typeof options === 'undefined' ) {return false}
		
		pano[myid] = new Pano(myid,options);
		pano[myid].go_pano();
	}
});
function Pano(myid,options) {
	this.options = options;
	this.myid = myid;
	this.mypano = document.getElementById('cg_pano_'+myid);
	this.mypano.style.height = options.height+"px";	
	this.ctrl = this.mypano.querySelector(".controls");
	this.leftCtrl = this.ctrl.querySelector("p.left");
	this.rightCtrl = this.ctrl.querySelector("p.right");
	this.centerCtrl = this.ctrl.querySelector("p.center");
	this.panoWidth  = this.mypano.style.width;
    this.img_360 = (options.img360 == 1);
    this.imgWidth = this.getImageInfo(options.img).width;
	this.imgHeight = this.getImageInfo(options.img).height;
    this.imgRatio = options.height / this.imgHeight; 
	this.img = options.img;
	this.anim = options.anim;
	this.ctrlSpeed = options.speed || 2;
	this.ctrlInterval = options.interval || 20;
}
Pano.prototype.go_pano = function() {
	this.init();
	this.animation(this);
};
Pano.prototype.moveBackgroundTo = function($this,newPos) {		
	$this.mypano.style.backgroundPosition =  newPos + 'px';
 };
Pano.prototype.moveBackgroundBy = function($this,distance) {
		var newMarginLeft = parseInt($this.mypano.style.backgroundPosition)+parseInt(distance);
		var elem_width = ($this.imgWidth * $this.imgRatio) - $this.clientWidth ;
		if ((!$this.img_360) && (newMarginLeft > 0)) newMarginLeft = 0;
		if ((!$this.img_360) && (newMarginLeft < -elem_width )) newMarginLeft = -elem_width; 
		$this.moveBackgroundTo($this,newMarginLeft);
};
hasClass = function (el, cl) {
      var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
      return !!el.className.match(regex);
}
Pano.prototype.init = function() {
	this.mypano.style.backgroundImage = "url('" + this.img + "')";
 	this.mypano.style.backgroundPosition ="50% 50%";
	this.mypano.style.backgroundSize = "auto 100%";
	this.mypano.style.backgroundRepeat ="repeat-x";
	$this = pano[this.myid];
	this.clientWidth = this.mypano.style.width.replace("px", "");
	halfWidth = (this.getImageInfo(this.img).width/ 2 );
	this.mypano.style.backgroundPosition = halfWidth;
	this.centerCtrl.style.display = "none";
	this.leftCtrl.addEventListener("mousedown", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.stopMoving($this);
		$this.moveLeft($this);
		if (!($this.anim == "no")) 	{
			$this.anim = "left"; 
			$this.centerCtrl.textContent = "x";			
		}
	});
	this.leftCtrl.addEventListener("touchstart", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.stopMoving($this);
		$this.moveLeft($this);
		if (!($this.anim == "no")) 	{
			$this.anim = "left";
			$this.centerCtrl.textContent = "x";			
		}
	});
	this.rightCtrl.addEventListener("mousedown", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.stopMoving($this);
		$this.moveRight($this);
		if (!($this.anim == "no")) 	{
			$this.anim = "right"; 
			$this.centerCtrl.textContent = "x";			
		}
	})
	this.rightCtrl.addEventListener("touchstart", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.stopMoving($this);
		$this.moveRight($this);
		if (!($this.anim == "no")) 	{
			$this.anim = "right";
			$this.centerCtrl.textContent = "x";			
		}
	});
	this.centerCtrl.addEventListener("mousedown", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		if ($this.centerCtrl.textContent =='x') {
			$this.stopMoving($this);
			$this.noMovement($this);
		} else {
			$this.animation($this);
			$this.indicateMovement($this);
		}
		$this.centerCtrl.textContent = "x"; 
	});
	this.centerCtrl.addEventListener("touchend", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		if ($this.centerCtrl.textContent =='x') {
			$this.stopMoving($this);
			$this.noMovement($this);
		} else {
			$this.animation($this);
			$this.indicateMovement($this);
		}
		$this.centerCtrl.textContent ="x"; 
	});
	this.mypano.addEventListener("mousedown", function(event){
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.stopMoving($this);
		var startPosition = event.pageX;
		$this.drag = true;
		this.addEventListener("mousemove", function(event){
			if (!$this.drag) return;
			if (hasClass($this.mypano,'moving')) return; // ignore
			var xPos = event.pageX;
			$this.dragMove($this,xPos, startPosition);
			startPosition =xPos;
		});
	});
	this.mypano.addEventListener("touchstart", function(event){
		event.stopPropagation();
		event.preventDefault();
		myid = this.getAttribute("data");
		$this = pano[myid];
		$this.indicateMovement($this);
		$this.stopMoving($this);
		$this.drag = true;
		var startPosition = event.pageX;
		this.addEventListener("touchmove", function(event){
			if (!$this.drag) return;
			if (hasClass($this.mypano,'moving')) return; // ignore
			var xPos = event.changedTouches[0].pageX;
			$this.dragMove($this,xPos, startPosition);
			startPosition = xPos;
			});
	});
	this.mypano.addEventListener('mouseover', function(){
		event.stopPropagation();
		event.preventDefault();
		ctl = this.querySelector('.controls');
		ctl.style.display = 'block';
		return false;
	})
	this.mypano.addEventListener('mouseout', function(){
		event.stopPropagation();
		event.preventDefault();
		ctl = this.querySelector('.controls');
		ctl.style.display = 'none';
		return false;
	}); 
}

Pano.prototype.animation = function($this) {
// 	$this = pano[this.myid];
	if (!($this.anim == "no")) 	{
		$this.centerCtrl.style.display = "block";
		if ($this.anim == "left") { 
			$this.moveLeft($this); 
			$this.centerCtrl.textContent = "x";
		} else {
			$this.moveRight($this); 
			$this.centerCtrl.textContent = "x";
		};
	}
}
Pano.prototype.getImageInfo = function(imgSrc) {
	var img = new Image();
	img.src = imgSrc;
	return img;
}
Pano.prototype.indicateMovement = function($this) {
	$this.mypano.classList.add("moving");
}
Pano.prototype.noMovement = function($this) {
	$this.mypano.classList.remove("moving");
}
Pano.prototype.dragMove = function($this,xPos, startPosition, cb) {
	var diff = (xPos - startPosition);
	$this.moveBackgroundBy($this,diff) 
}
Pano.prototype.moveLeft = function($this) {
	$this.indicateMovement($this);
	$this.moveBackgroundBy($this,$this.ctrlSpeed);
	$this.leftMover = setInterval(function(){
		$this.moveBackgroundBy($this,-($this.ctrlSpeed));
	}, parseInt($this.ctrlInterval));
	$this.centerCtrl.text = "x";
}
Pano.prototype.moveRight = function($this) {
	$this.indicateMovement($this);
	$this.moveBackgroundBy($this,-($this.ctrlSpeed));
	$this.rightMover = setInterval(function(){
		$this.moveBackgroundBy($this,parseInt($this.ctrlSpeed));
	}, parseInt($this.ctrlInterval));
	$this.centerCtrl.text = "x";
}
Pano.prototype.stopMoving = function($this) {
	$this.noMovement($this);
	$this.mypano.removeEventListener("touchmove",function(){});
	$this.mypano.removeEventListener("mousemove",function(){});
	$this.drag = false;
	clearInterval($this.leftMover);
	clearInterval($this.rightMover);
	clearInterval($this.intervalId);
	if (!($this.anim == "no")) 	{
		$this.centerCtrl.style.display ="initial";
	}
}
