<?php
/**
* CG Panorama - Joomla Module 
* Version			: 2.1.0 
* Package			: Joomla 4.x/5.x
* copyright 		: Copyright (C) 2023 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
* From              : https://www.cssscript.com/draggable-360-image-preview-threesixty/
*/
// no direct access
defined('_JEXEC') or die;
?>
<div id="cg_pano_<?php echo $module->id;?>" class="cg_pano" data="<?php echo $module->id;?>">
	<div class="controls" data="<?php echo $module->id;?>">
		<p class="left" id="prev<?php echo $module->id;?>" data="<?php echo $module->id;?>"  title="d&eacute;filer vers la gauche">&lt;</p>
		<p class="center" data="<?php echo $module->id;?>" title="stop le d&eacute;filement">x</p>
		<p class="right" id="next<?php echo $module->id;?>" data="<?php echo $module->id;?>" title="d&eacute;filer vers la droite">&gt;</p>
	</div>
</div>


