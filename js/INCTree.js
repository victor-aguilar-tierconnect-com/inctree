

var INCTree = INCTree || {};

INCTree = function (config) {

    var self = this;
    var cache = {};

    var defaults = {
        container: "tree",
        data: [],
        onAddSave: function (parent, object, context) {
        },
        onEditSave: function (object, context) {
        },
        onDelete: function (object, context) {
        },
        collapsedIcon: "ic-plus-squared",
        expandedIcon: "ic-minus-squared",
        leafIcon: "ic-minus-squared",
        periods: [
        	"Both",
        	"Classic",
        	"Modern"
        ]
    };

    var defaultObj = {
        category_id: "",
        category_parent_id: "",
        category_type: "",
        level: "",
        name: "",
        period_type: "",
        weight: null,
        children: []
    };

    var options = jQuery.extend(defaults, config, {});

    var templates = {
        root: jQuery("#tree-root-template").html(),
        child: jQuery("#tree-child-template").html(),
        editbox: jQuery("#tree-editbox-template").html(),
        addbox: jQuery("#tree-addbox-template").html()
    };


    tree.init = function () {
        self.depth = 0;
        self.INPUT_FLAG = false;
        self.render();
    };

    this.renderChildren = function (parent, stack) {
        if(stack) {
        	if (stack.length > 0) parent.addClass("unbordered");
            jQuery.each(stack, function (index, item) {

                var $row = self.makeChild();

                parent.$subtree.append($row);
                parent.children = [];
                parent.children.push($row);

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

                $row.$actions.$add.click(function (e) {
                    if (!self.INPUT_FLAG) {
                        $row.$add = self.makeAddBox($row, $row.data);
                        $row.$subtree.prepend($row.$add);
                        self.INPUT_FLAG = true;

                    } else {
                        $row.$add.$category.focus();
                    }

                    if ($row.data.children && $row.data.children.length > 0 &&
                        $row.$subtree.hasClass("collapsed") ) {

                    	$row.$subtree.toggleClass("collapsed");
	                	self.toggleIcon($row.$actions.$toggleIcon, options.collapsedIcon, options.expandedIcon);
                    }

                });



                $row.$actions.$edit.click(function (e) {
                    if (!self.INPUT_FLAG) {
                        $row.$edit = self.makeEditBox($row, $row.data);
                        $row.$subtree.prepend($row.$edit);
                        self.INPUT_FLAG = true;

                    } else {
                        //$row.$edit.$category.focus();
                    }

                    if ($row.data.children && $row.data.children.length > 0 &&
                        $row.$subtree.hasClass("collapsed") ) {

                    	$row.$subtree.toggleClass("collapsed");
	                	self.toggleIcon($row.$actions.$toggleIcon, options.collapsedIcon, options.expandedIcon);
                    }
                });

                $row.$actions.$delete.click(function (e) {
                    self.previousDelete($row, $row.data);
                });

                // Attach toogle icon click event
                if ($row.data.children && $row.data.children.length > 0) {
                	$row.$box.dblclick(function(){
	                	$row.$subtree.toggleClass("collapsed");
	                	self.toggleIcon($row.$actions.$toggleIcon, options.collapsedIcon, options.expandedIcon);
	                });

                    $row.$actions.$toggle.click(function (e) {
                        e.preventDefault();
                        $row.$subtree.toggleClass("collapsed");
                        self.toggleIcon($row.$actions.$toggleIcon, options.collapsedIcon, options.expandedIcon);
                    });
                } else {
                    $row.$actions.$toggleIcon.attr("class", "icon-angle-right");
                }


                $row.$box.mouseenter(function () {
                    $row.$actions.addClass("visible");
                    $row.addClass("highlinted");
                });

                $row.$box.mouseleave(function () {
                    $row.$actions.removeClass("visible");
                    $row.removeClass("highlinted");
                });

                if (item.children && item.children.length > 0) {
                    self.depth++;
                    $row.$subtree.addClass("depth-" + self.depth);
                }

                self.renderChildren($row, item.children);
                if (index == (stack.length - 1)) self.depth--;
            });
        }

    };

    this.toggleIcon = function( $iconDom, iconClass1, iconClass2 ){
    	if ($iconDom.hasClass(iconClass1)) {
            $iconDom.removeClass(iconClass1);
            $iconDom.addClass(iconClass2);
        } else {
            $iconDom.removeClass(iconClass2);
            $iconDom.addClass(iconClass1);
        }
    };

    this.makeEditBox = function ($row, object) {
        var edit = jQuery(templates.editbox);
        edit.$save = edit.find(".action-save");
        edit.$weight = edit.find(".input-weight");
        edit.$category = edit.find(".input-category");
        edit.$cancel = edit.find(".action-cancel");
        edit.$close = edit.find(".action-close");
        edit.$periodType = edit.find(".period-type");


        // Creado el select de periodos
        var strPeriod = edit.$periodType.html();
        edit.$periodType.empty();
        jQuery.each(options.periods, function (index, item) {
        	var $period = jQuery(strPeriod);
        	$period.attr( "value", index );
        	$period.text( item );
        	edit.$periodType.append( $period );
        });

        // Asignando Valores
        edit.$category.val(object.name);
        edit.$periodType.val( parseInt(object.period_type) );
        edit.$weight.val(object.weight);

        edit.$save.click(function (e) {
            console.log($row.data);
            var values = {
                name: edit.$category.val(),
                period_type: ""+add.$periodType.val(),
                weight: add.$weight.val()
            };

            var newObj = jQuery.extend({}, object, values);
            object = newObj;

            $row.$box.$category.text(newObj.name);

            options.onEditSave(newObj, self);
            edit.remove();
            self.INPUT_FLAG = false;
        });

        edit.$cancel.click(function(){
        	edit.remove();
            self.INPUT_FLAG = false;
        });

        edit.$close.click(function(){
        	edit.$cancel.click();
        });

        return edit;
    };


    this.makeAddBox = function ($row, parent) {
        var add = jQuery(templates.addbox);


        add.$save = add.find(".action-save");
        add.$category = add.find(".input-category");
        add.$cancel = add.find(".action-cancel");
        add.$close = add.find(".action-close");
        add.$periodType = add.find(".period-type");
        add.$weight = add.find(".input-weight");



        // Creado el select de periodos
        var strPeriod = add.$periodType.html();
        add.$periodType.empty();
        jQuery.each(options.periods, function (index, item) {
        	var $period = jQuery(strPeriod);
        	$period.attr( "value", index );
        	$period.text( item );
        	add.$periodType.append( $period );
        });

        add.$save.click(function (e) {
            var values = {
                name: add.$category.val(),
                category_parent_id: parent.category_id,
                category_type: parent.category_type,
                period_type: ""+add.$periodType.val(),
                weight: add.$weight.val()
            };

            var newObj = jQuery.extend({}, defaultObj, values);

            options.onAddSave(parent, newObj, self);
            add.remove();
            self.INPUT_FLAG = false;
        });

        add.$cancel.click(function(){
        	add.remove();
            self.INPUT_FLAG = false;
        });

        add.$close.click(function(){
        	add.$cancel.click();
        });

        return add;
    };

    this.makeRoot = function () {
        var root = jQuery(options.container).append(templates.root);
        root.$subtree = root.find(".inc-tree");
        return root;
    };
    this.makeChild = function () {
        var node = jQuery(templates.child);
        node.$subtree = node.find(".inc-tree");
        return node;
    };

    this.render = function () {
        jQuery(options.container).empty();
        self.$root = self.makeRoot();
        self.renderChildren(self.$root, options.data);
    };

    this.refresh = function (newData) {
        self.depth = 0;
        self.INPUT_FLAG = false;
        jQuery(options.container).empty();
        self.$root = self.makeRoot();
        self.renderChildren(self.$root, newData);
    };

    this.previousDelete = function ($row, object) {
        options.onDelete(object, self);
    };


    tree.init();
};
