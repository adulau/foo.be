(function () {
  'use strict';

  function removeBacklinks(note) {
    note.querySelectorAll('.reversefootnote').forEach(function (backlink) {
      backlink.remove();
    });
  }

  function insertionPoint(reference) {
    // Kramdown places a footnote reference inside a paragraph (or another
    // flow-content element). Putting an <aside> directly beside the <sup>
    // would create invalid HTML by nesting a sectioning element in a <p>.
    return reference.closest('p, li, blockquote, dd, dt, figcaption') ||
      reference.closest('sup') ||
      reference;
  }

  function setScrollOffset(article, navigation) {
    // Keep a small gap below the navigation and its decorative shadow.
    var offset = Math.ceil(navigation.getBoundingClientRect().height) + 20;
    article.style.setProperty('--contextual-footnote-scroll-offset', offset + 'px');
  }

  function trackScrollOffset(article) {
    var navigation = document.querySelector('.c-navigation.is-fixed');

    if (!navigation) {
      return;
    }

    setScrollOffset(article, navigation);

    // Observing the element itself also catches height changes caused by web
    // fonts or wrapping, neither of which necessarily triggers window.resize.
    if ('ResizeObserver' in window) {
      var observer = new window.ResizeObserver(function () {
        setScrollOffset(article, navigation);
      });
      observer.observe(navigation);
    } else {
      window.addEventListener('resize', function () {
        setScrollOffset(article, navigation);
      });
    }
  }

  function createContextualFootnotes() {
    var article = document.querySelector('.c-article__main');

    if (!article) {
      return;
    }

    var references = article.querySelectorAll('a.footnote[href^="#"]');

    if (!references.length) {
      return;
    }

    trackScrollOffset(article);

    var lastNoteByInsertionPoint = new Map();

    references.forEach(function (reference, index) {
      var targetId = reference.getAttribute('href').slice(1);
      var endnote = document.getElementById(targetId);

      if (!endnote) {
        return;
      }

      var note = document.createElement('aside');
      var number = reference.textContent.trim();
      var contextualId = 'contextual-footnote-' + (index + 1);
      var point = insertionPoint(reference);
      var previousNote = lastNoteByInsertionPoint.get(point);

      note.className = 'contextual-footnote';
      note.id = contextualId;
      note.dataset.footnoteNumber = number;
      note.setAttribute('role', 'note');
      note.setAttribute('aria-label', 'Footnote ' + number);
      note.innerHTML = endnote.innerHTML;
      removeBacklinks(note);

      reference.href = '#' + contextualId;
      reference.setAttribute('aria-describedby', contextualId);
      point.parentNode.insertBefore(note, previousNote ? previousNote.nextSibling : point.nextSibling);
      lastNoteByInsertionPoint.set(point, note);
    });

    if (article.querySelector('.contextual-footnote')) {
      article.classList.add('has-contextual-footnotes');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createContextualFootnotes);
  } else {
    createContextualFootnotes();
  }
}());
