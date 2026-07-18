<?php
/**
 * Search Markdown documentation.
 *
 * @package mxlocdoc
 * @subpackage processors
 */
class mxLocDocSearchProcessor extends modProcessor
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
        $this->mxlocdoc->setLanguage($this->getProperty('language', ''));

        return parent::initialize();
    }

    public function process()
    {
        $result = $this->mxlocdoc->getSearchIndex()->search(
            $this->getProperty('query', ''),
            $this->getProperty('limit', 20)
        );
        if (empty($result['success'])) {
            return $this->failure($result['message'], array('code' => $result['code']));
        }

        return $this->success('', $result);
    }
}

return 'mxLocDocSearchProcessor';
