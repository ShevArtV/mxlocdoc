<?php
/**
 * mxLocDoc manager connector.
 *
 * @package mxlocdoc
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

/** @var modX $modx */
$corePath = $modx->getOption(
    'mxlocdoc.core_path',
    null,
    $modx->getOption('core_path') . 'components/mxlocdoc/'
);

$modx->getService(
    'mxlocdoc',
    'mxLocDoc',
    $corePath . 'model/mxlocdoc/',
    array('core_path' => $corePath)
);
$modx->lexicon->load('mxlocdoc:default');

$modx->request->handleRequest(array(
    'processors_path' => $corePath . 'processors/',
    'location' => '',
));
