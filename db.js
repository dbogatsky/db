/**
* Created with JetBrains PhpStorm.
* User: dbogatsky
* Date: 06.09.13
* Time: 20:46
* To change this template use File | Settings | File Templates.
*/
(function() {
	window.onload = function() {
		_init();
	};

	var _init = function() {
		var dbModels = new DbModels(),
			bdVariables = new DbVariables(),
			allModels = dbModels.getAll(),
			allVariables = bdVariables.getAll(),
			events = new Events();

		events.bindEvent(allVariables, allModels)
	};

	var __extends = function (Child, Parent) {
	    function __() {
			this.constructor = Child;
		}
	    __.prototype = Parent.prototype;
	    Child.prototype = new __();
	};

	var Store = (function() {
		function Store() {
			this._store = [];
		}

		Store.prototype.getAll = function() {
			return this._store;
		};

		Store.prototype.getIfExists = function(name) {
			var length = this._store.length;
			for(var i = 0; i < length; i++) {
				if (this._store[i].name === name) {
					return this._store[i];
				}
			}
			return null;
		};

		Store.prototype.set = function(name, value) {
			for(var i, _max = this._store.length; i < _max; i++) {
				if (this._store[i].name == name) {
					this._store[i].name = value;
					return true;
				}
			}
			this._store.push({name : value});
			return true;
		};

		return Store;
	})();

	var DbDirectives = (function(_parent) {
		__extends(DbDirectives, _parent);

		function DbDirectives() {
			_parent.call(this);

			this._store.push(
				{name : 'model'},
				{name : 'repeat'}
			)
		}
		return DbDirectives;

	})(Store);

	var DbVariables = (function(_parent) {
		__extends(DbVariables, _parent);

		var _content;

		function DbVariables() {
			_parent.call(this);

			_content = document.body.innerHTML;
			this._store = /{{(.[^}]*)}}/gm.matchAll(_content);
		}

		return DbVariables;
	})(Store);

	var DbModels = (function(_parent) {
		__extends(DbModels, _parent);

		var _allPageAttributes = [],
			_allPageTags = document.getElementsByTagName("*");

		function DbModels() {
			_parent.call(this);
			for (var i = 0, _max = _allPageTags.length; i < _max; i++) {
				var _currTagAttributes = _allPageTags[i].attributes;
				for (var k = 0; k < _currTagAttributes.length; k++) {
					var _splitAttribute = _currTagAttributes[k].name.split('-');
					if (_splitAttribute.length == 2 && _splitAttribute[0] == 'db') {
						this._store.push({name : _currTagAttributes[k].value, tag : _allPageTags[i]});
					}
				}
				_allPageAttributes.push(_allPageTags[i].attributes);
			}
		}

		return DbModels;
	})(Store);

	var Events = (function(_parent) {
		__extends(Events, _parent);

		function Events() {
			_parent.call(this);
		}

		var replaceText = function(text, keyword) {
			var _node;

			var findText = function(element, pattern, callback) {
			   for (var i = element.childNodes.length; i-->0;) {
					var child = element.childNodes[i];
					if (child.nodeType == 1) {
						findText(child, pattern, callback);
					} else if (child.nodeType == 3) {
						var matches= [], match;
						while (match = pattern.exec(child.data)) {
							matches.push(match);
						}
						if (matches && matches.length > 0) {
							for (var k = matches.length; k-->0;) {
								callback.call(window, child, matches[k], text);
							}
						}
					}
			   }
			};

			findText(document.body, new RegExp(keyword, 'gm'), function (node, match, text) {
				var _keyword = match[0],
					_text = document.createTextNode(text),
					_span = document.createElement('span');
				node.splitText(match.index + _keyword.length);
				_span.appendChild(node.splitText(match.index));
				node.parentNode.replaceChild(_text, node.nextSibling);
				_node = _text;
			});

			return _node;
		};

		var replaceNode = function(node, text) {
			node.replaceData(0, node.data.length, text)
		};

		var bind = function(eventName, variable, tag) {
			var _node = replaceText(tag.value, variable);
			setEvent(tag, eventName, function() {
				replaceNode(_node, this.value);
			});
		};

		Events.prototype.bindEvent = function(variables, models) {
			var eventName = 'onkeyup';
			for (var i = 0, _maxM = models.length; i < _maxM; i++) {
				for (var j = 0, _maxV = variables.length; j < _maxV; j++) {
					if (variables[j][1] == models[i].name) {
						bind(eventName, variables[j][0], models[i].tag);
					}
				}
			}
		};

		var setEvent = function(_obj, eventName, callback) {
			switch (eventName)
			{
				case 'onkeyup':
					_obj.onkeyup = callback;
				break;
				default:
					return null;
				break;
			}
			return true;
		};

		return Events;
	})(Store);

	var Handlers = (function(_parent) {
		__extends(Handlers, _parent);

		function Handlers() {
			_parent.call(this);
		}

		return Handlers;
	})(Store);

	RegExp.prototype.matchAll = function(string) {
		var match = null, matches = [];
		while (match = this.exec(string)) {
			var matchArray = [];
			for (var i in match) {
				if (parseInt(i) == i) {
					matchArray.push(match[i]);
				}
			}
			matches.push(matchArray);
		}
		return matches;
	};
})();