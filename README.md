# INCTree

Definition mode

      var newTree = new INCTree({
				container: "#tree",
				data: data,
				onSave: function(object){
					console.log("save", object);
				},
				onEdit: function(object){
					console.log("edit", object);
				},
				onAdd: function(parent, object){
					console.log("add");
					console.log("parent",parent);
					console.log("object", object);
				},
				onDelete: function(object){
					console.log("delete",object);
				}
			});
