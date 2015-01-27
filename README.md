# INCTree



Definition mode

	var newTree = new INCTree({
		container: "#tree",
		data: data,
		onAddSave: function(parent, object, context){
			console.log("ADD SAVE CALLBACK");
			console.log("parent",parent);
			console.log("object", object);
		},
		onEditSave: function(object, context){
			console.log("EDIT SAVE CALLBACK");
			console.log("object", object);
		},
		onDelete: function(object, context){
			console.log("DELETE CALLBACK");
			console.log("delete",object);
			console.log(context);

		}
	});