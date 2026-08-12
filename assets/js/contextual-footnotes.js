(function () {
  'use strict';

  function removeBacklinks(note) {
    note.querySelectorAll('.reversefootnote').forEach(function (backlink) {
      backlink.remove();
    });
  }

  function createContextualFootnotes() {
    var article = document.querySelector('.c-article__main');

    if (!article) {
      return;
    }

    var references = article.querySelectorAll('a.footnote[href^="#"]');

    references.forEach(function (reference, index) {
      var targetId = reference.getAttribute('href').slice(1);
      var endnote = document.getElementById(targetId);

      if (!endnote) {
        return;
      }

      var note = document.createElement('aside');
      var number = reference.textContent.trim();
      var contextualId = 'contextual-footnote-' + (index + 1);
      var referenceWrapper = reference.closest('sup') || reference;

      note.className = 'contextual-footnote';
      note.id = contextualId;
      note.dataset.footnoteNumber = number;
      note.setAttribute('role', 'note');
      note.setAttribute('aria-label', 'Footnote ' + number);
      note.innerHTML = endnote.innerHTML;
      removeBacklinks(note);

      reference.href = '#' + contextualId;
      reference.setAttribute('aria-describedby', contextualId);
      referenceWrapper.parentNode.insertBefore(note, referenceWrapper.nextSibling);
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
