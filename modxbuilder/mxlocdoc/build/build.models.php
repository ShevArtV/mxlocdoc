#!/usr/bin/env php
<?php
$mtime = microtime();
$mtime = explode(" ", $mtime);
$tstart = $mtime[1] + $mtime[0];
set_time_limit(0);

$buildConfig = include dirname(__FILE__) . '/config/config.inc.php';
require_once $buildConfig['tools_root'] . 'modxbuilder.class.php';

include_once $buildConfig['modx_root'] . 'core/config/config.inc.php';
include_once $buildConfig['modx_root'] . 'core/model/modx/modx.class.php';

$modx = new modX();
$modx->initialize('mgr');
$modx->setLogLevel(modX::LOG_LEVEL_INFO);
$modx->setLogTarget(XPDO_CLI_MODE ? 'ECHO' : 'HTML');

$modxBuilder = new modxBuilder($modx, $buildConfig);
$modxBuilder->parseSchema();
