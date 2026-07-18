/**
 * Clear mxLocDoc cache when MODX manager cache is cleared.
 *
 * @package mxlocdoc
 */
if (!$modx instanceof modX || !$modx->event || $modx->event->name !== 'OnBeforeCacheUpdate') {
    return;
}

$corePath = $modx->getOption(
    'mxlocdoc.core_path',
    null,
    $modx->getOption('core_path') . 'components/mxlocdoc/'
);
$mxlocdoc = $modx->getService(
    'mxlocdoc',
    'mxLocDoc',
    $corePath . 'model/mxlocdoc/',
    array('core_path' => $corePath)
);

if ($mxlocdoc) {
    $mxlocdoc->clearCache();
}
