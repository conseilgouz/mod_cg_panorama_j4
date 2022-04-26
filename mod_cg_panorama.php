<?php
/**
* CG Panorama - Joomla Module 
* Version			: 2.0.0 
* Package			: Joomla 4.0.x
* copyright 		: Copyright (C) 2021 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
* From              : pano : https://github.com/seancoyne/pano
*/
// no direct access
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Helper\ModuleHelper;

$document 		= Factory::getDocument();
$baseurl 		= URI::base();
$modulefield	= ''.URI::base(true).'/media/mod_cg_panorama/';
//Get this module id
$nummod_sf		= $module->id;
$num_sf		= 'mod'.$nummod_sf;
$document->addStyleSheet($modulefield.'css/cgpano.css');
$document->addScript($modulefield.'js/jquery.pano.js');

$img = $baseurl.'/'.$params->get('pano_file','');
$height = $params->get('pano_height','300');
$speed = $params->get('pano_speed','50');
$img360= $params->get('pano_360','300');
$anim= $params->get('pano_anim','no');

$document->addScriptOptions('mod_cg_pano_'.$module->id, 
			array('id' => $module->id,
 				  'img' => $img, 'height' => $height, 'speed' => $speed, 'img360' => $img360, 'anim' => $anim
				  )
			);
$document->addScript($modulefield.'js/cgpano.js');

require ModuleHelper::getLayoutPath('mod_cg_panorama', $params->get('layout', 'default'));
?>