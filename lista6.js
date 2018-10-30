function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function (element) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  },

  pop: function () {
    var result = this.content[0];
    var end = this.content.pop();

    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function (node) {
    var length = this.content.length;

    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      var end = this.content.pop();

      if (i == length - 1) break;
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function () {
    return this.content.length;
  },

  bubbleUp: function (n) {
    var element = this.content[n], score = this.scoreFunction(element);

    while (n > 0) {
      var parentN = Math.floor((n + 1) / 2) - 1;
      var parent = this.content[parentN];

      if (score >= this.scoreFunction(parent))
        break;

      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function (n) {
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);

    while (true) {
      var child2N = (n + 1) * 2;
      var child1N = child2N - 1;
      var swap = null;

      if (child1N < length) {
        var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore)
          swap = child1N;
      }

      if (child2N < length) {
        var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      if (swap == null) break;

      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

function HuffmanEncoding(stringToEncoding) {
  this.stringToEncoding = stringToEncoding;

  var countChars = {};
  for (var i = 0; i < stringToEncoding.length; i++)
    if (stringToEncoding[i] in countChars)
      countChars[stringToEncoding[i]]++;
    else
      countChars[stringToEncoding[i]] = 1;

  var binaryHeap = new BinaryHeap(function (x) { return x[0]; });
  for (var char in countChars)
    binaryHeap.push([countChars[char], char]);

  while (binaryHeap.size() > 1) {
    var pair1 = binaryHeap.pop();
    var pair2 = binaryHeap.pop();
    binaryHeap.push([pair1[0] + pair2[0], [pair1[1], pair2[1]]]);
  }

  var tree = binaryHeap.pop();
  this.encoding = {};
  this._generate_encoding(tree[1], "");

  this.encodedString = ""
  for (var i = 0; i < this.stringToEncoding.length; i++) {
    this.encodedString += this.encoding[stringToEncoding[i]];
  }
}

HuffmanEncoding.prototype._generate_encoding = function (array, prefix) {
  if (array instanceof Array) {
    this._generate_encoding(array[0], prefix + "0");
    this._generate_encoding(array[1], prefix + "1");
  }
  else {
    this.encoding[array] = prefix;
  }
}

HuffmanEncoding.prototype.huffmanEncoding = function () {
  console.log("\n")
  for (var char in this.encoding) {
    console.log("'" + char + "': " + this.encoding[char])
  }
  console.log("\n")
}

HuffmanEncoding.prototype.decode = function (encoded) {
  var reverseEncode = {};
  for (var char in this.encoding)
    reverseEncode[this.encoding[char]] = char;

  var decoded = "";
  var position = 0;
  while (position < encoded.length) {
    var key = ""
    while (!(key in reverseEncode)) {
      key += encoded[position];
      position++;
    }
    decoded += reverseEncode[key];
  }
  return decoded;
}

var stringToEncoding = 'In computer science and information theory, a Huffman code is a particular type of optimal prefix code that is commonly used for lossless data compression. The process of finding and/or using such a code proceeds by means of Huffman coding, an algorithm developed by David A. Huffman while he was a Sc.D. student at MIT, and published in the 1952 paper "A Method for the Construction of Minimum-Redundancy Codes".';
console.log(stringToEncoding + "\n");

var huff = new HuffmanEncoding(stringToEncoding);
huff.huffmanEncoding();

var encodedString = huff.encodedString;
console.log(encodedString + "\n");

var translatedString = huff.decode(encodedString);
console.log(translatedString + "\n");

console.log("is translatedString same as original? " + (stringToEncoding === translatedString));