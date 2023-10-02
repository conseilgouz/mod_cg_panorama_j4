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
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Helper\ModuleHelper;

$document 		= Factory::getDocument();
$baseurl 		= URI::base();
$modulefield	= 'media/mod_cg_panorama/';

/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$wa = Factory::getApplication()->getDocument()->getWebAssetManager();
$wa->registerAndUseStyle('cgpano', $modulefield.'css/cgpano.css');

$img = $baseurl.'/'.$params->get('pano_file','');

$height = $params->get('pano_height','300');
$speed = $params->get('pano_speed','2');
$img360= $params->get('pano_360','300');
$anim= $params->get('pano_anim','no');

$document->addScriptOptions('mod_cg_pano_'.$module->id, 
			array('id' => $module->id,
 				  'img' => $img, 'height' => $height, 'speed' => $speed, 'img360' => $img360, 'anim' => $anim
				  )
			);
$wa->registerAndUseScript('cgpano',$modulefield.'js/cgpano.js');

require ModuleHelper::getLayoutPath('mod_cg_panorama', $params->get('layout', 'default'));
?>