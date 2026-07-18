<?php
/**
 * mxLocDoc plugins.
 *
 * @var modxBuilder $this
 */

$plugins = array();

/** @var modPlugin $plugin */
$plugin = $this->modx->newObject('modPlugin');
$plugin->fromArray(array(
    'id' => 0,
    'name' => 'mxLocDocCacheClear',
    'description' => 'Clears mxLocDoc cache when MODX manager cache is cleared.',
    'plugincode' => file_get_contents($this->config['source_core'] . 'elements/plugins/plugin.mxlocdoc_cache_clear.php'),
    'category' => 0,
    'disabled' => 0,
    'static' => 1,
    'static_file' => '{core_path}components/mxlocdoc/elements/plugins/plugin.mxlocdoc_cache_clear.php',
), '', true, true);

/** @var modPluginEvent $event */
$event = $this->modx->newObject('modPluginEvent');
$event->fromArray(array(
    'event' => 'OnBeforeCacheUpdate',
    'priority' => 0,
    'propertyset' => 0,
), '', true, true);

$events = array($event);
$plugin->addMany($events);
$plugins[] = $plugin;

unset($plugin, $event, $events);

return $plugins;
