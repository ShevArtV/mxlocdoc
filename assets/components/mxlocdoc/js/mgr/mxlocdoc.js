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
        state: root.querySelector('[data-mxlocdoc-state]'),
        breadcrumbs: root.querySelector('[data-mxlocdoc-breadcrumbs]'),
        article: root.querySelector('[data-mxlocdoc-article]'),
        warnings: root.querySelector('[data-mxlocdoc-warnings]'),
        toc: root.querySelector('[data-mxlocdoc-toc]'),
        tocList: root.querySelector('[data-mxlocdoc-toc-list]')
    };

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
            filterNavigation();

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
        });
    }

    function renderDocument(documentData) {
        renderBreadcrumbs(documentData.path || state.activePath);
        ui.article.innerHTML = documentData.html || '';
        wireArticleLinks();
        prepareHeadings();
        renderWarnings(documentData.warnings || []);
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
                '<a class="mxlocdoc-toc__link mxlocdoc-toc__link--' + heading.tagName.toLowerCase() + '" href="#' +
                escapeHtml(id) + '">' + escapeHtml(heading.textContent) + '</a>'
            );
        });

        ui.tocList.innerHTML = tocHtml.join('');
        ui.toc.hidden = tocHtml.length === 0;
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
        ui.search.addEventListener('input', filterNavigation);
    }
    window.addEventListener('hashchange', function () {
        var path = getHashPath();
        if (path && path !== state.activePath) {
            loadDocument(path, false);
        }
    });

    root.classList.add('mxlocdoc-ready');
    loadNavigation();

    function filterNavigation() {
        var query = ui.search ? String(ui.search.value || '').toLowerCase().trim() : '';
        var items = ui.nav.querySelectorAll('li');
        var i;

        for (i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            var childMatched = false;
            var children = item.querySelectorAll('li');
            var selfMatched = !query || String(item.dataset.search || '').indexOf(query) !== -1;

            Array.prototype.forEach.call(children, function (child) {
                if (!child.hidden) {
                    childMatched = true;
                }
            });

            item.hidden = !(selfMatched || childMatched);
        }
    }
});
