<?php
/**
 * mxLocDoc system settings.
 *
 * @var modxBuilder $this
 * @var string $categoryName
 * @var string $namespace
 */

$definitions = array(
    'mxlocdoc.docs_path' => array(
        'value' => '',
        'xtype' => 'textfield',
        'area' => 'mxlocdoc:filesystem',
    ),
    'mxlocdoc.default_file' => array(
        'value' => 'README.md',
        'xtype' => 'textfield',
        'area' => 'mxlocdoc:navigation',
    ),
    'mxlocdoc.nav_file' => array(
        'value' => '_sidebar.json',
        'xtype' => 'textfield',
        'area' => 'mxlocdoc:navigation',
    ),
    'mxlocdoc.search_enabled' => array(
        'value' => '1',
        'xtype' => 'combo-boolean',
        'area' => 'mxlocdoc:search',
    ),
    'mxlocdoc.cache_ttl' => array(
        'value' => '300',
        'xtype' => 'numberfield',
        'area' => 'mxlocdoc:cache',
    ),
    'mxlocdoc.max_file_size' => array(
        'value' => '1048576',
        'xtype' => 'numberfield',
        'area' => 'mxlocdoc:filesystem',
    ),
    'mxlocdoc.allowed_asset_extensions' => array(
        'value' => 'jpg,jpeg,png,gif,webp,svg',
        'xtype' => 'textfield',
        'area' => 'mxlocdoc:filesystem',
    ),
);

$settings = array();

foreach ($definitions as $key => $definition) {
    /** @var modSystemSetting $setting */
    $setting = $this->modx->newObject('modSystemSetting');
    $setting->fromArray(array(
        'key' => $key,
        'value' => $definition['value'],
        'xtype' => $definition['xtype'],
        'namespace' => $namespace,
        'area' => $definition['area'],
        'editedon' => null,
    ), '', true, true);
    $settings[] = $setting;
}

unset($definitions, $definition, $key, $setting);

return $settings;
