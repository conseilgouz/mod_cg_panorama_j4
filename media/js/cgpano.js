/**
* CG Panorama - Joomla Module 
* Version			: 2.0.0
* Package			: Joomla 3.10.x - 4.0
* copyright 		: Copyright (C) 2021 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
*/
jQuery(document).ready(function($) {
	$('.cg_pano').each(function() {
		var $this = $(this);
		var myid = $this.attr("data");;
		if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
			console.error('Joomla.getOptions not found!\nThe Joomla core.js file is not being loaded.');
			return false;
		}
		var me = "#cg_pano_"+myid+" ";
		var options = Joomla.getOptions('mod_cg_pano_'+myid);

		if (typeof options === 'undefined' ) {return false}
		
		go_pano(me,options);
		
	});
	function go_pano(me,options) {
		
		jQuery(me).css("height",options.height+"px");

		var pano = jQuery(me).pano({
			img: options.img,
			height: options.height,
			interval: 100,
			speed: options.speed,
			img360: options.img360,
			anim:  options.anim
		});

	};
});