
      function clickAction(e) {
        var t = e.target;
        if (t.localName === 'paper-icon-button') {
          if (t.hasAttribute('disabled')) {
            console.error('should not be able to click disabled button', t);
          } else {
            console.log('click', t);
          }
        }
      }
