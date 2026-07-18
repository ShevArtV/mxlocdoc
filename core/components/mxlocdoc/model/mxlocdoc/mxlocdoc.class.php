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
        ), $config);

        if ($this->modx->lexicon) {
            $this->modx->lexicon->load('mxlocdoc:default');
        }
    }
}
