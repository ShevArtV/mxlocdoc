var MxLocDoc = window.MxLocDoc || {};

Ext.onReady(function () {
    var root = document.getElementById('mxlocdoc-app');

    if (!root || !MxLocDoc.config || !MxLocDoc.config.connector_url) {
        return;
    }

    var state = {
        nav: null,
        activePath: '',
        documents: {},
        flatItems: []
    };
    var lexicon = MxLocDoc.config.lexicon || {};

    var ui = {
        shell: root.querySelector('[data-mxlocdoc-shell]'),
        sidebar: root.querySelector('[data-mxlocdoc-sidebar]'),
        sidebarOpen: root.querySelector('[data-mxlocdoc-sidebar-open]'),
        sidebarClose: root.querySelector('[data-mxlocdoc-sidebar-close]'),
        nav: root.querySelector('[data-mxlocdoc-nav]'),
        search: root.querySelector('[data-mxlocdoc-search]'),
        searchHint: root.querySelector('[data-mxlocdoc-search-hint]'),
        searchResults: root.querySelector('[data-mxlocdoc-search-results]'),
        state: root.querySelector('[data-mxlocdoc-state]'),
        documentPanel: root.querySelector('.mxlocdoc-document-panel'),
        breadcrumbs: root.querySelector('[data-mxlocdoc-breadcrumbs]'),
        article: root.querySelector('[data-mxlocdoc-article]'),
        warnings: root.querySelector('[data-mxlocdoc-warnings]'),
        toc: root.querySelector('[data-mxlocdoc-toc]'),
        tocList: root.querySelector('[data-mxlocdoc-toc-list]')
    };
    var searchTimer = null;

    function request(action, params, callback) {
        var xhr = new XMLHttpRequest();
        var data = {action: action};
        var body;

        if (window.MODx && MODx.siteId) {
            data.HTTP_MODAUTH = MODx.siteId;
        }
        Object.keys(params || {}).forEach(function (key) {
            data[key] = params[key];
        });
        body = buildQuery(data);

        xhr.open('POST', MxLocDoc.config.connector_url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = function () {
            var response;

            if (xhr.readyState !== 4) {
                return;
            }

            try {
                response = JSON.parse(xhr.responseText || '{}');
            } catch (error) {
                callback({success: false, message: text('invalid_json', 'Invalid JSON response')});
                return;
            }

            callback(response);
        };
        xhr.send(body);
    }

    function text(key, fallback) {
        return lexicon[key] || fallback || '';
    }

    function hydrateLexicon() {
        hydrateAttribute('data-mxlocdoc-text', function (element, value) {
            element.textContent = value;
        });
        hydrateAttribute('data-mxlocdoc-title', function (element, value) {
            element.setAttribute('title', value);
        });
        hydrateAttribute('data-mxlocdoc-aria', function (element, value) {
            element.setAttribute('aria-label', value);
        });
        hydrateAttribute('data-mxlocdoc-placeholder', function (element, value) {
            element.setAttribute('placeholder', value);
        });
    }

    function hydrateAttribute(attribute, setter) {
        var elements = root.querySelectorAll('[' + attribute + ']');
        Array.prototype.forEach.call(elements, function (element) {
            var key = element.getAttribute(attribute);
            var value = text(key, '');

            if (value) {
                setter(element, value);
            }
        });
    }

    function buildQuery(data) {
        var parts = [];
        Object.keys(data).forEach(function (key) {
            if (data[key] !== undefined && data[key] !== null) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        });
        return parts.join('&');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setState(message, type) {
        ui.state.textContent = message || '';
        ui.state.className = 'mxlocdoc-state' + (type ? ' mxlocdoc-state--' + type : '');
        ui.state.hidden = !message;
    }

    function flattenItems(items, level) {
        (items || []).forEach(function (item) {
            if (item.path) {
                state.flatItems.push({
                    title: item.title || item.path,
                    path: item.path,
                    level: level
                });
            }
            flattenItems(item.children || [], level + 1);
        });
    }

    function renderNavigation(items, level) {
        var list = document.createElement('ul');
        list.className = level === 0 ? 'mxlocdoc-nav__list' : 'mxlocdoc-nav__children';

        (items || []).forEach(function (item) {
            var li = document.createElement('li');
            var node;

            li.className = 'mxlocdoc-nav__item';
            if (item.path) {
                node = document.createElement('button');
                node.type = 'button';
                node.className = 'mxlocdoc-nav__link';
                node.dataset.path = item.path;
                node.textContent = item.title || item.path;
                node.title = item.path;
                li.dataset.search = ((item.title || '') + ' ' + item.path).toLowerCase();
                node.addEventListener('click', function () {
                    loadDocument(item.path, true);
                    closeSidebar();
                });
            } else {
                node = document.createElement('div');
                node.className = 'mxlocdoc-nav__section';
                node.textContent = item.title || '';
                li.dataset.search = String(item.title || '').toLowerCase();
            }

            li.appendChild(node);
            if (item.children && item.children.length) {
                li.appendChild(renderNavigation(item.children, level + 1));
            }
            list.appendChild(li);
        });

        return list;
    }

    function updateActiveNav(path) {
        var links = ui.nav.querySelectorAll('[data-path]');
        Array.prototype.forEach.call(links, function (link) {
            link.classList.toggle('is-active', link.dataset.path === path);
        });

        var items = ui.nav.querySelectorAll('.mxlocdoc-nav__item');
        Array.prototype.forEach.call(items, function (item) {
            item.classList.toggle('is-active-branch', !!item.querySelector('.mxlocdoc-nav__link.is-active'));
        });
    }

    function firstDocument(items) {
        var found = '';

        function walk(nodes) {
            (nodes || []).some(function (item) {
                if (item.path) {
                    found = item.path;
                    return true;
                }
                return walk(item.children || []);
            });
            return !!found;
        }

        walk(items);
        return found;
    }

    function loadNavigation() {
        setState(text('loading_navigation', 'Loading navigation...'), 'loading');
        request('mgr/navigation/get', {}, function (response) {
            var object = response.object || {};
            var items = object.items || [];
            var initialPath = getHashPath() || firstDocument(items);

            if (!response.success) {
                setState(response.message || text('navigation_error', 'Could not load navigation.'), 'error');
                return;
            }

            state.nav = object;
            state.flatItems = [];
            flattenItems(items, 0);
            ui.nav.innerHTML = '';
            ui.nav.appendChild(renderNavigation(items, 0));

            if (!items.length) {
                setState(text('documents_empty', 'No documents found.'), 'empty');
                return;
            }

            if (initialPath) {
                loadDocument(initialPath, false);
            }
        });
    }

    function loadDocument(path, pushHash) {
        if (!path) {
            return;
        }

        state.activePath = path;
        updateActiveNav(path);
        setState(text('loading_document', 'Loading document...'), 'loading');
        ui.article.innerHTML = '';
        ui.warnings.innerHTML = '';
        ui.breadcrumbs.innerHTML = '';
        ui.tocList.innerHTML = '';
        ui.toc.hidden = true;

        request('mgr/document/get', {path: path}, function (response) {
            var object = response.object || {};

            if (!response.success) {
                setState(response.message || text('document_error', 'Could not load document.'), 'error');
                return;
            }

            state.documents[path] = object;
            if (pushHash) {
                setHashPath(path);
            }
            setState('', '');
            renderDocument(object);
            resetDocumentScroll();
        });
    }

    function renderDocument(documentData) {
        renderBreadcrumbs(documentData.path || state.activePath);
        ui.article.innerHTML = documentData.html || '';
        authorizeAssetUrls();
        wireArticleLinks();
        prepareHeadings();
        renderWarnings(documentData.warnings || []);
    }

    function authorizeAssetUrls() {
        var auth = window.MODx && MODx.siteId ? MODx.siteId : '';
        if (!auth) {
            return;
        }

        var images = ui.article.querySelectorAll('img[data-mxlocdoc-asset-path]');
        Array.prototype.forEach.call(images, function (image) {
            var src = image.getAttribute('src') || '';
            if (src.indexOf('HTTP_MODAUTH=') !== -1) {
                return;
            }

            image.setAttribute('src', src + (src.indexOf('?') === -1 ? '?' : '&') + 'HTTP_MODAUTH=' + encodeURIComponent(auth));
        });
    }

    function renderBreadcrumbs(path) {
        var segments = String(path || '').split('/').filter(Boolean);
        var html = ['<span>' + escapeHtml(text('documentation', 'Documentation')) + '</span>'];

        segments.forEach(function (segment) {
            html.push('<span>' + escapeHtml(segment) + '</span>');
        });

        ui.breadcrumbs.innerHTML = html.join('<span class="mxlocdoc-breadcrumbs__sep">/</span>');
    }

    function wireArticleLinks() {
        var links = ui.article.querySelectorAll('a[data-mxlocdoc-path]');
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                loadDocument(link.getAttribute('data-mxlocdoc-path'), true);
            });
        });
    }

    function prepareHeadings() {
        var headings = ui.article.querySelectorAll('h1, h2, h3');
        var tocHtml = [];
        var seen = {};

        Array.prototype.forEach.call(headings, function (heading, index) {
            var id = uniqueHeadingId(heading.id || makeHeadingId(heading.textContent, index), seen);
            heading.id = id;
            tocHtml.push(
                '<button type="button" class="mxlocdoc-toc__link mxlocdoc-toc__link--' + heading.tagName.toLowerCase() +
                '" data-target="' + escapeHtml(id) + '">' + escapeHtml(heading.textContent) + '</button>'
            );
        });

        ui.tocList.innerHTML = tocHtml.join('');
        ui.toc.hidden = tocHtml.length === 0;
        wireTocLinks();
    }

    function wireTocLinks() {
        var links = ui.tocList.querySelectorAll('[data-target]');
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function (event) {
                var target = document.getElementById(link.getAttribute('data-target'));

                event.preventDefault();
                scrollDocumentTo(target);
            });
        });
    }

    function scrollDocumentTo(target) {
        if (!target) {
            return;
        }

        if (ui.documentPanel) {
            var panelBox = ui.documentPanel.getBoundingClientRect();
            var targetBox = target.getBoundingClientRect();
            ui.documentPanel.scrollTop += targetBox.top - panelBox.top - 12;
            return;
        }

        if (target.scrollIntoView) {
            target.scrollIntoView({block: 'start', inline: 'nearest'});
        }
    }

    function resetDocumentScroll() {
        if (ui.documentPanel) {
            ui.documentPanel.scrollTop = 0;
        }
    }
    function makeHeadingId(text, index) {
        var slug = String(text || '')
            .toLowerCase()
            .replace(/[^a-z0-9а-яё]+/gi, '-')
            .replace(/^-+|-+$/g, '');

        return 'mxlocdoc-heading-' + (slug || index);
    }

    function uniqueHeadingId(id, seen) {
        var base = id;
        var counter = 2;

        while (seen[id]) {
            id = base + '-' + counter;
            counter++;
        }
        seen[id] = true;

        return id;
    }

    function renderWarnings(warnings) {
        if (!warnings.length) {
            ui.warnings.innerHTML = '';
            return;
        }

        ui.warnings.innerHTML = warnings.map(function (warning) {
            return '<div class="mxlocdoc-warning">' +
                '<strong>' + escapeHtml(warning.type || 'warning') + '</strong>: ' +
                escapeHtml(warning.path || '') +
                (warning.code ? ' (' + escapeHtml(warning.code) + ')' : '') +
                '</div>';
        }).join('');
    }

    function getHashPath() {
        var hash = window.location.hash || '';
        try {
            return hash.indexOf('#doc=') === 0 ? decodeURIComponent(hash.substring(5)) : '';
        } catch (error) {
            return '';
        }
    }

    function setHashPath(path) {
        var next = '#doc=' + encodeURIComponent(path);
        if (window.location.hash !== next) {
            window.location.hash = next;
        }
    }

    function openSidebar() {
        ui.shell.classList.add('is-sidebar-open');
    }

    function closeSidebar() {
        ui.shell.classList.remove('is-sidebar-open');
    }

    if (ui.sidebarOpen) {
        ui.sidebarOpen.addEventListener('click', openSidebar);
    }
    if (ui.sidebarClose) {
        ui.sidebarClose.addEventListener('click', closeSidebar);
    }
    if (ui.search) {
        ui.search.addEventListener('input', handleSearchInput);
    }
    window.addEventListener('hashchange', function () {
        var path = getHashPath();
        if (path && path !== state.activePath) {
            loadDocument(path, false);
        }
    });

    hydrateLexicon();
    root.classList.add('mxlocdoc-ready');
    loadNavigation();

    function handleSearchInput() {
        var query = String(ui.search.value || '').trim();

        if (searchTimer) {
            window.clearTimeout(searchTimer);
        }
        if (query.length < 2) {
            renderSearchResults([]);
            return;
        }

        searchTimer = window.setTimeout(function () {
            runSearch(query);
        }, 220);
    }

    function runSearch(query) {
        request('mgr/search', {query: query, limit: 12}, function (response) {
            var object = response.object || {};

            if (!response.success) {
                renderSearchError(response.message || text('search_error', 'Search failed.'));
                return;
            }

            renderSearchResults(object.items || []);
        });
    }

    function renderSearchResults(items) {
        if (!ui.searchResults) {
            return;
        }

        if (!items.length) {
            var query = ui.search ? String(ui.search.value || '').trim() : '';
            ui.searchResults.innerHTML = query.length >= 2
                ? '<div class="mxlocdoc-search-result mxlocdoc-search-result--empty">' + escapeHtml(text('search_empty', 'No results found.')) + '</div>'
                : '';
            ui.searchResults.hidden = query.length < 2;
            return;
        }

        ui.searchResults.innerHTML = items.map(function (item) {
            return '<button type="button" class="mxlocdoc-search-result" data-path="' + escapeHtml(item.path) + '">' +
                '<span class="mxlocdoc-search-result__title">' + escapeHtml(item.title || item.path) + '</span>' +
                '<span class="mxlocdoc-search-result__path">' + escapeHtml(item.path) + '</span>' +
                '<span class="mxlocdoc-search-result__snippet">' + escapeHtml(item.snippet || '') + '</span>' +
                '</button>';
        }).join('');
        ui.searchResults.hidden = false;

        Array.prototype.forEach.call(ui.searchResults.querySelectorAll('[data-path]'), function (button) {
            button.addEventListener('click', function () {
                loadDocument(button.getAttribute('data-path'), true);
                ui.searchResults.hidden = true;
                ui.search.value = '';
            });
        });
    }

    function renderSearchError(message) {
        if (!ui.searchResults) {
            return;
        }

        ui.searchResults.innerHTML = '<div class="mxlocdoc-search-result mxlocdoc-search-result--empty">' + escapeHtml(message) + '</div>';
        ui.searchResults.hidden = false;
    }
});
