<?php
/**
* CG Panorama Module  - Joomla 4.x/5.x Module 
* Package			: CG Panorama
* copyright 		: Copyright (C) 2023 ConseilGouz. All rights reserved.
* license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
*/
// No direct access to this file
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Filesystem\Folder;
use Joomla\CMS\Version;
use Joomla\Filesystem\File;
use Joomla\CMS\Log\Log;

class mod_cg_panoramaInstallerScript
{
	private $min_joomla_version      = '4.0.0';
	private $min_php_version         = '8.0';
	private $name                    = 'CG Panorama';
	private $exttype                 = 'module';
	private $extname                 = 'cg_panorama';
	private $previous_version        = '';
	private $dir           = null;
	private $lang;
	private $installerName = 'cg_panoraminstaller';
	public function __construct()
	{
		$this->dir = __DIR__;
		$this->lang = Factory::getLanguage();
		$this->lang->load($this->extname);
	}

    function preflight($type, $parent)
    {
		if ( ! $this->passMinimumJoomlaVersion())
		{
			$this->uninstallInstaller();
			return false;
		}

		if ( ! $this->passMinimumPHPVersion())
		{
			$this->uninstallInstaller();
			return false;
		}
		// To prevent installer from running twice if installing multiple extensions
		if ( ! file_exists($this->dir . '/' . $this->installerName . '.xml'))
		{
			return true;
		}
    }
    
    function postflight($type, $parent)
    {
		if (($type=='install') || ($type == 'update')) { // remove obsolete dir/files
			$this->postinstall_cleanup();
		}

		switch ($type) {
            case 'install': $message = Text::_('ISO_POSTFLIGHT_INSTALLED'); break;
            case 'uninstall': $message = Text::_('ISO_POSTFLIGHT_UNINSTALLED'); break;
            case 'update': $message = Text::_('ISO_POSTFLIGHT_UPDATED'); break;
            case 'discover_install': $message = Text::_('ISO_POSTFLIGHT_DISC_INSTALLED'); break;
        }
		return true;
    }
	private function postinstall_cleanup() {
	// remove mod_simple_panorama files
		$obsloteFolders = ['mod_simple_panorama'];
		foreach ($obsloteFolders as $folder) {
			$f = JPATH_SITE . '/modules/'.$folder;
			if (!@file_exists($f) || !is_dir($f) || is_link($f)) {
				continue;
			}
			Folder::delete($f);
		}
		$langFiles = [
			sprintf("%s/language/fr-FR/fr-FR.mod_simple_panorama.ini", JPATH_SITE),
			sprintf("%s/language/fr-FR/en-GB.mod_simple_panorama.sys.ini", JPATH_SITE),
			];
		foreach ($langFiles as $file) {
			if (@is_file($file)) {
				File::delete($file);
			}
		}
		// Delete 3.9 and older language files
		$langFiles = [
			sprintf("%s/language/en-GB/en-GB.mod_%s.ini", JPATH_SITE, $this->extname),
			sprintf("%s/language/en-GB/en-GB.mod_%s.sys.ini", JPATH_SITE, $this->extname),
			sprintf("%s/language/fr-FR/fr-FR.mod_%s.ini", JPATH_SITE, $this->extname),
			sprintf("%s/language/fr-FR/fr-FR.mod_%s.sys.ini", JPATH_SITE, $this->extname),
		];
		foreach ($langFiles as $file) {
			if (@is_file($file)) {
				File::delete($file);
			}
		}

		// update existing modules to cg_panorama
		$db = Factory::getDbo();
        $conditions = array($db->qn('module') . ' = ' . $db->q('mod_simple_panorama'));
        $fields = array($db->qn('module') . ' = '. $db->q('mod_cg_panorama'));
        $query = $db->getQuery(true);
		$query->update($db->quoteName('#__modules'))->set($fields)->where($conditions);
		$db->setQuery($query);
        try {
	        $db->execute();
        }
        catch (\RuntimeException $e) {
            Log::add('unable to update mod_post_it to cg_panorama', Log::ERROR, 'jerror');
        }
		// delete mod_simple_panorama from extensions
        $conditions = array(
			$db->quoteName('type').'='.$db->quote('module'),
			$db->quoteName('element').'='.$db->quote('mod_simple_panorama')
        );
        $query = $db->getQuery(true);
		$query->delete($db->quoteName('#__extensions'))->where($conditions);
		$db->setQuery($query);
        try {
	        $db->execute();
        }
        catch (\RuntimeException $e) {
            Log::add('unable to delete mod_postit from extensions', Log::ERROR, 'jerror');
        }

		// remove obsolete update sites
		$db = Factory::getDbo();
		$query = $db->getQuery(true)
			->delete('#__update_sites')
			->where($db->quoteName('location') . ' like "%432473037d.url-de-test.ws/%"');
		$db->setQuery($query);
		$db->execute();
		// CG Panorama is now on Github
		$query = $db->getQuery(true)
			->delete('#__update_sites')
			->where($db->quoteName('location') . ' like "%conseilgouz.com/updates/simple_panorama%"');
		$db->setQuery($query);
		$db->execute();
		$query = $db->getQuery(true)
			->delete('#__update_sites')
			->where($db->quoteName('location') . ' like "%conseilgouz.com/updates/cg_panorama%"');
		$db->setQuery($query);
		$db->execute();
		
	}

	// Check if Joomla version passes minimum requirement
	private function passMinimumJoomlaVersion()
	{
		$j = new Version();
		$version=$j->getShortVersion(); 
		if (version_compare($version, $this->min_joomla_version, '<'))
		{
			Factory::getApplication()->enqueueMessage(
				'Incompatible Joomla version : found <strong>' . $version . '</strong>, Minimum : <strong>' . $this->min_joomla_version . '</strong>',
				'error'
			);

			return false;
		}

		return true;
	}

	// Check if PHP version passes minimum requirement
	private function passMinimumPHPVersion()
	{

		if (version_compare(PHP_VERSION, $this->min_php_version, '<'))
		{
			Factory::getApplication()->enqueueMessage(
					'Incompatible PHP version : found  <strong>' . PHP_VERSION . '</strong>, Minimum <strong>' . $this->min_php_version . '</strong>',
				'error'
			);
			return false;
		}

		return true;
	}
	private function uninstallInstaller()
	{
		if ( ! is_dir(JPATH_PLUGINS . '/system/' . $this->installerName)) {
			return;
		}
		$this->delete([
			JPATH_PLUGINS . '/system/' . $this->installerName . '/language',
			JPATH_PLUGINS . '/system/' . $this->installerName,
		]);
		$db = Factory::getDbo();
		$query = $db->getQuery(true)
			->delete('#__extensions')
			->where($db->quoteName('element') . ' = ' . $db->quote($this->installerName))
			->where($db->quoteName('folder') . ' = ' . $db->quote('system'))
			->where($db->quoteName('type') . ' = ' . $db->quote('plugin'));
		$db->setQuery($query);
		$db->execute();
		Factory::getCache()->clean('_system');
	}
	
}