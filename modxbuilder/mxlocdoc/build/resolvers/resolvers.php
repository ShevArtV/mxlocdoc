<?php
/**
 * mxLocDoc resolvers.
 *
 * @var modxBuilder $this
 */
return array(
    'file' => array(
        array(
            'source' => $this->config['source_core'],
            'target' => "return MODX_CORE_PATH.'components/';",
        ),
        array(
            'source' => $this->config['source_assets'],
            'target' => "return MODX_ASSETS_PATH.'components/';",
        ),
    ),
);
