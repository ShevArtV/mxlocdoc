<?php
/**
 * Safe filesystem path resolver for mxLocDoc.
 *
 * @package mxlocdoc
 */
class mxLocDocPathResolver
{
    /** @var modX */
    protected $modx;

    /** @var mxLocDoc */
    protected $mxlocdoc;

    /** @var string|null */
    protected $rootPath = null;

    public function __construct(modX &$modx, mxLocDoc $mxlocdoc)
    {
        $this->modx =& $modx;
        $this->mxlocdoc = $mxlocdoc;
    }

    public function getRootPath()
    {
        if ($this->rootPath !== null) {
            return $this->success($this->rootPath);
        }

        $path = trim((string)$this->mxlocdoc->config['docs_path']);
        if ($path === '') {
            return $this->failure('docs_path_empty', $this->modx->lexicon('mxlocdoc_error_docs_path_empty'));
        }

        $root = realpath($path);
        if ($root === false || !is_dir($root)) {
            return $this->failure('docs_path_invalid', $this->modx->lexicon('mxlocdoc_error_docs_path_invalid'));
        }

        $this->rootPath = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return $this->success($this->rootPath);
    }

    public function resolveFile($path)
    {
        $root = $this->getRootPath();
        if (!$root['success']) {
            return $root;
        }

        $relativePath = $this->normalizeRelativePath($path);
        if ($relativePath === '') {
            $relativePath = (string)$this->mxlocdoc->config['default_file'];
        }

        if ($relativePath === '' || $this->hasUnsafePathSegments($relativePath)) {
            return $this->failure('path_invalid', $this->modx->lexicon('mxlocdoc_error_path_invalid'));
        }

        $fullPath = realpath($root['path'] . $relativePath);
        if ($fullPath === false || !is_file($fullPath)) {
            return $this->failure('file_not_found', $this->modx->lexicon('mxlocdoc_error_file_not_found'));
        }

        $fullPath = $this->normalizeDirectorySeparators($fullPath);
        if (!$this->isInsideRoot($fullPath, $root['path'])) {
            return $this->failure('path_outside_root', $this->modx->lexicon('mxlocdoc_error_path_outside_root'));
        }

        return $this->success($fullPath, $this->getRelativePath($fullPath, $root['path']));
    }

    public function normalizeExtension($path)
    {
        return strtolower((string)pathinfo((string)$path, PATHINFO_EXTENSION));
    }

    public function checkFileSize($path)
    {
        $maxSize = (int)$this->mxlocdoc->config['max_file_size'];
        if ($maxSize <= 0) {
            return $this->success($path);
        }

        $size = filesize($path);
        if ($size === false) {
            return $this->failure('file_not_readable', $this->modx->lexicon('mxlocdoc_error_file_not_readable'));
        }

        if ($size > $maxSize) {
            return $this->failure('file_too_large', $this->modx->lexicon('mxlocdoc_error_file_too_large'));
        }

        return $this->success($path);
    }

    protected function normalizeRelativePath($path)
    {
        $path = str_replace('\\', '/', trim((string)$path));
        $path = preg_replace('#/+#', '/', $path);
        return ltrim($path, '/');
    }

    protected function normalizeDirectorySeparators($path)
    {
        return str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $path);
    }

    protected function hasUnsafePathSegments($path)
    {
        $segments = explode('/', str_replace('\\', '/', $path));
        foreach ($segments as $segment) {
            if ($segment === '..' || $segment === '') {
                return true;
            }
        }
        return false;
    }

    protected function isInsideRoot($path, $root)
    {
        $root = rtrim($this->normalizeDirectorySeparators($root), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return strpos($path, $root) === 0;
    }

    protected function getRelativePath($path, $root)
    {
        $root = rtrim($this->normalizeDirectorySeparators($root), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        return str_replace(DIRECTORY_SEPARATOR, '/', substr($path, strlen($root)));
    }

    protected function success($path, $relativePath = '')
    {
        return array(
            'success' => true,
            'path' => $path,
            'relative_path' => $relativePath,
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
