/**
 * Text Editor component which can be used as a handful
 * browser-embedded text editor.
 */

function TextEditor(options) {
  var elem = options.elem,
      tab = options.tab;

  elem.addEventListener("keydown", function(event) {
    var selStart = this.selectionStart,
        selEnd = this.selectionEnd,
        oldValue,
        selValue,
        i,
        counter = 0;
    if (event.key === "Tab") {
      if (event.ctrlKey || event.altKey) {
        return true;
      }
      event.preventDefault();
      oldValue = this.value;
      selValue = oldValue.slice(selStart, selEnd);
      for (i = selValue.length; i--;) {
        if (selValue[i] === "\n") {
          selValue = selValue.slice(0, i + 1) + tab + selValue.slice(i + 1);
          counter++;
        }
      }
      if (counter) {
        this.value = oldValue.slice(0, selStart) + tab + selValue + oldValue.slice(selEnd);
        this.selectionStart = selStart;
        this.selectionEnd = selEnd + (counter + 1) * tab.length;
      } else {
        this.value = oldValue.slice(0, selStart) + tab + oldValue.slice(selEnd);
        this.selectionStart = this.selectionEnd = selStart + (counter + 1) * tab.length;
      }
    }

    if (event.key === "Enter") {
      var self = this;
      setTimeout(function() {
        var leftHalf,
            ind,
            spaceEnd = 0,
            spaces;
        selStart = self.selectionStart;
        selEnd = self.selectionEnd;
        leftHalf = self.value.slice(0, selStart - 1);
        ind = leftHalf.lastIndexOf("\n");
        ind = ~ind && ind + 1;
        while(~" \t".indexOf(leftHalf[ind + spaceEnd++]));
        spaces = leftHalf.slice(ind, ind + spaceEnd - 1);
        oldValue = self.value;
        self.value = oldValue.slice(0, selStart) + spaces + oldValue.slice(selStart);
        self.selectionStart = self.selectionEnd = selStart + spaces.length;
      }, 0);
    }
  });
}