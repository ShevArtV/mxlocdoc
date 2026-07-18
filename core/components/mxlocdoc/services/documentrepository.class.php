<?php
/**
 * Markdown document repository.
 *
 * @package mxlocdoc
 */
class mxLocDocDocumentRepository
{
    /** @var modX */
    protected $modx;

    /** @var mxLocDocPathResolver */
    protected $pathResolver;

    protected $allowedExtensions = array('md', 'markdown');

    public function __construct(modX &$modx, mxLocDocPathResolver $pathResolver)
    {
        $this->modx =& $modx;
        $this->pathResolver = $pathResolver;
    }

    public function get($path)
    {
        $resolved = $this->pathResolver->resolveFile($path);
        if (!$resolved['success']) {
            return $resolved;
        }

        $extension = $this->pathResolver->normalizeExtension($resolved['path']);
        if (!in_array($extension, $this->allowedExtensions, true)) {
            return $this->failure('extension_not_allowed', $this->modx->lexicon('mxlocdoc_error_document_extension'));
        }

        $sizeCheck = $this->pathResolver->checkFileSize($resolved['path']);
        if (!$sizeCheck['success']) {
            return $sizeCheck;
        }

        $content = file_get_contents($resolved['path']);
        if ($content === false) {
            return $this->failure('file_not_readable', $this->modx->lexicon('mxlocdoc_error_file_not_readable'));
        }

        return array(
            'success' => true,
            'path' => $resolved['relative_path'],
            'name' => basename($resolved['path']),
            'extension' => $extension,
            'size' => filesize($resolved['path']),
            'content' => $content,
        );
    }

    protected function failure($code, $message)
    {
        return array(
            'success' => false,
            'code' => $code,
            'message' => $message,
        );
    }
}
