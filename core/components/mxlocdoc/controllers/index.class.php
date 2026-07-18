<?php
/**
 * mxLocDoc manager controller.
 *
 * @package mxlocdoc
 */
class mxLocDocIndexManagerController extends modExtraManagerController
{
    /** @var mxLocDoc */
    public $mxlocdoc;

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

        parent::initialize();
    }

    public function getLanguageTopics()
    {
        return array('mxlocdoc:default');
    }

    public function checkPermissions()
    {
        return true;
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('mxlocdoc');
    }

    public function loadCustomCssJs()
    {
        if (!$this->mxlocdoc) {
            return;
        }

        $assetsUrl = $this->mxlocdoc->config['assets_url'];
        $assetsPath = $this->mxlocdoc->config['assets_path'];

        $version = function ($relativePath) use ($assetsPath) {
            $file = $assetsPath . $relativePath;
            return is_file($file) ? '?v=' . filemtime($file) : '';
        };

        $this->addCss($assetsUrl . 'css/mgr/main.css' . $version('css/mgr/main.css'));
        $this->addJavascript($assetsUrl . 'js/mgr/mxlocdoc.js' . $version('js/mgr/mxlocdoc.js'));
        $this->addHtml('<script type="text/javascript">
            MxLocDoc = window.MxLocDoc || {};
            MxLocDoc.config = ' . $this->modx->toJSON(array(
                'connector_url' => $this->mxlocdoc->config['connector_url'],
                'assets_url' => $assetsUrl,
            )) . ';
        </script>');
    }

    public function getTemplateFile()
    {
        return $this->mxlocdoc->config['templates_path'] . 'home.tpl';
    }
}
