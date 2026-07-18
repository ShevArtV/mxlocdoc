<?php
/**
 * Stream a protected documentation asset.
 *
 * @package mxlocdoc
 * @subpackage processors
 */
class mxLocDocAssetGetProcessor extends modProcessor
{
    /** @var mxLocDoc */
    protected $mxlocdoc;

    public $languageTopics = array('mxlocdoc:default');

    public function initialize()
    {
        $corePath = $this->modx->getOption(
            'mxlocdoc.core_path',
            null,
            $this->modx->getOption('core_path') . 'components/mxlocdoc/'
        );
        $this->mxlocdoc = $this->modx->getService(
            'mxlocdoc',
            'mxLocDoc',
            $corePath . 'model/mxlocdoc/',
            array('core_path' => $corePath)
        );

        if (!$this->mxlocdoc) {
            return $this->modx->lexicon('mxlocdoc_error_service_unavailable');
        }

        return parent::initialize();
    }

    public function process()
    {
        $result = $this->mxlocdoc->getAssetRepository()->get($this->getProperty('path', ''));
        if (empty($result['success'])) {
            return $this->failure($result['message'], array('code' => $result['code']));
        }

        @session_write_close();
        header('Content-Type: ' . $result['mime']);
        header('Content-Length: ' . $result['size']);
        header('Content-Disposition: inline; filename="' . str_replace('"', '', $result['name']) . '"');
        header('X-Content-Type-Options: nosniff');
        readfile($result['path']);
        exit;
    }
}

return 'mxLocDocAssetGetProcessor';
