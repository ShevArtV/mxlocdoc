<?php
/**
 * mxLocDoc service shell.
 *
 * @package mxlocdoc
 */
class mxLocDoc
{
    /** @var modX */
    public $modx;

    /** @var array */
    public $config = array();

    public function __construct(modX &$modx, array $config = array())
    {
        $this->modx =& $modx;

        $corePath = $this->modx->getOption(
            'mxlocdoc.core_path',
            $config,
            $this->modx->getOption('core_path') . 'components/mxlocdoc/'
        );
        $assetsUrl = $this->modx->getOption(
            'mxlocdoc.assets_url',
            $config,
            $this->modx->getOption('assets_url') . 'components/mxlocdoc/'
        );
        $assetsPath = $this->modx->getOption(
            'mxlocdoc.assets_path',
            $config,
            $this->modx->getOption('assets_path') . 'components/mxlocdoc/'
        );

        $this->config = array_merge(array(
            'core_path' => $corePath,
            'model_path' => $corePath . 'model/',
            'processors_path' => $corePath . 'processors/',
            'templates_path' => $corePath . 'templates/',
            'assets_url' => $assetsUrl,
            'assets_path' => $assetsPath,
            'connector_url' => $assetsUrl . 'connector.php',
            'docs_path' => $this->getOption('docs_path', ''),
            'default_file' => $this->getOption('default_file', 'README.md'),
            'nav_file' => $this->getOption('nav_file', '_sidebar.json'),
            'search_enabled' => $this->getBooleanOption('search_enabled', true),
            'cache_ttl' => $this->getIntegerOption('cache_ttl', 300),
            'max_file_size' => $this->getIntegerOption('max_file_size', 1048576),
            'allowed_asset_extensions' => $this->getListOption(
                'allowed_asset_extensions',
                array('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg')
            ),
        ), $config);

        if ($this->modx->lexicon) {
            $this->modx->lexicon->load('mxlocdoc:default', 'mxlocdoc:setting');
        }
    }

    /**
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getOption($key, $default = null)
    {
        return $this->modx->getOption('mxlocdoc.' . $key, null, $default);
    }

    /**
     * @param string $key
     * @param bool $default
     * @return bool
     */
    public function getBooleanOption($key, $default = false)
    {
        $value = $this->getOption($key, $default ? '1' : '0');
        return in_array(strtolower((string)$value), array('1', 'true', 'yes', 'on'), true);
    }

    /**
     * @param string $key
     * @param int $default
     * @return int
     */
    public function getIntegerOption($key, $default = 0)
    {
        $value = $this->getOption($key, $default);
        return is_numeric($value) ? (int)$value : (int)$default;
    }

    /**
     * @param string $key
     * @param array $default
     * @return array
     */
    public function getListOption($key, array $default = array())
    {
        $value = $this->getOption($key, implode(',', $default));
        if (is_array($value)) {
            $items = $value;
        } else {
            $items = explode(',', (string)$value);
        }

        $result = array();
        foreach ($items as $item) {
            $item = strtolower(trim((string)$item));
            if ($item !== '' && !in_array($item, $result, true)) {
                $result[] = $item;
            }
        }

        return $result;
    }
}
