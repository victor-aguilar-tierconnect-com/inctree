var INCTree = INCTree || {};
$(document).on("ready", function(){
	INCTree = function(config) {

		var self = this;
		var cache = {};

		var defaults = {
			container: "tree",
			data: [],
			onSave: function(){},
			onEdit: function(){},
			onAdd: function(){},
			onDelete: function(){},
			collapsedIcon: "icon-plus-squared",
			expandedIcon: "icon-minus-squared",
			leafIcon: "icon-minus-squared"


		};

		var options = $.extend(defaults, config, {});

		var templates = {
			root: $("#tree-root-template").html(),
			child: $("#tree-child-template").html(),
			editbox: $("#tree-editbox-template").html(),
			addbox: $("#tree-addbox-template").html()
		}


		tree.init =  function() {

			self.depth = 0;
			self.INPUT_FLAG = false;

			self.render();
		}

		this.renderChildren = function(parent, stack ) {


			$.each( stack, function( index, item ) {

				var $row = self.makeChild();

				parent.$subtree.append( $row );
				parent.children = [];
				parent.children.push( $row );

				$row.data = item;
				$row.$name = $row.find(".category-name").text(item.name);
				$row.$weight = $row.find(".weight").text(item.weight);


				$row.$box = $row.find(".text-box");
				$row.$box.$category = $row.$box.find(".category-name");
				$row.$actions = $row.find(".actions");


				$row.$actions.$add = $row.$actions.find(".action-add-child");
				$row.$actions.$edit = $row.$actions.find(".action-edit");
				$row.$actions.$delete = $row.$actions.find(".action-delete");
				$row.$actions.$toggle = $row.find(".action-expand");
				$row.$actions.$toggleIcon = $row.$actions.$toggle.find("i")

				$row.$actions.$add.click(function(e){
					if(!self.INPUT_FLAG){
						$row.$add = self.makeAddBox( $row, $row.data );
						$row.$subtree.prepend ( $row.$add );
						self.INPUT_FLAG = true;

					} else {
						$row.$add.$category.focus();
					}
				});

				$row.$actions.$edit.click(function(e){
					if(!self.INPUT_FLAG){
						$row.$edit = self.makeEditBox( $row, $row.data );
						$row.$subtree.prepend ( $row.$edit );
						self.INPUT_FLAG = true;

					} else {
						$row.$edit.$category.focus();
					}
				});

				$row.$actions.$delete.click(function(e){
					self.previousDelete( $row, $row.data );
				});

				// Attach toogle icon click event
				if ( $row.data.children.length > 0 ) {
					$row.$actions.$toggle.click(function(e){
						e.preventDefault();
						$row.$subtree.toggleClass("collapsed");

						if( $row.$actions.$toggleIcon.hasClass(options.collapsedIcon) ) {
							$row.$actions.$toggleIcon.removeClass(options.collapsedIcon);
							$row.$actions.$toggleIcon.addClass(options.expandedIcon);
						} else {
							$row.$actions.$toggleIcon.removeClass(options.expandedIcon);
							$row.$actions.$toggleIcon.addClass(options.collapsedIcon);
						}

					});
				} else {
					$row.$actions.$toggleIcon.attr("class", "icon-angle-right");
				}


				$row.$box.mouseenter(function(){
					$row.$actions.addClass("visible");
				});
				$row.$box.mouseleave(function(){
					$row.$actions.removeClass("visible");
				});

				if(item.children.length > 0) {
					self.depth ++;
					$row.$subtree.addClass("depth-" + self.depth);
				}
				self.renderChildren( $row, item.children );
				if(index == (stack.length - 1) ) self.depth--;
			});
		};

		this.makeEditBox = function( $row, object ){
			var edit = $( templates.editbox );
			edit.$save = edit.find(".action-save");
			edit.$weight = edit.find(".input-weight");
			edit.$category = edit.find(".input-category");

			edit.$category.val(object.name);
			edit.$weight.val(object.weight);


			edit.$save.click(function(e){

				console.log( $row.data );
				var values = {
					name: edit.$category.val(),
					weight: edit.$weight.val()
				};

				var newObj = $.extend({}, object, values);
				object = newObj;

				$row.$box.$category.text(newObj.name);
				options.onEdit(newObj);
				edit.remove();
				self.INPUT_FLAG = false;
			});
			return edit;
		}


		this.makeAddBox = function($row, object){
			var add = $( templates.addbox );

			add.$save = add.find(".action-save");
			add.$category = add.find(".input-category");

			add.$save.click(function(e){
				var values = {
					name: add.$category.val()
				};

				var newObj = $.extend({}, object, values);
				options.onSave(newObj);
				add.remove();
				self.INPUT_FLAG = false;
			});

			return add;
		}

		this.makeRoot = function(){
			var root = $(options.container).append( templates.root );
			root.$subtree = root.find(".inc-tree");
			return root;
		}
		this.makeChild = function(){
			var node = $( templates.child );
			node.$subtree = node.find(".inc-tree");
			return node;
		}

		this.render = function(){
			$(options.container).empty();
			self.$root = self.makeRoot();
			self.renderChildren( self.$root, options.data );
		}

		this.refresh = function(newData){
			$(options.container).empty();
			self.$root = self.makeRoot();
			self.renderChildren( self.$root, newData );
		}

		this.previousDelete = function($row, object){
			options.onDelete(object);
		}

		tree.init();
	};
});
