export default function draw(nodeArr) {
    console.log(nodeArr)
    var $ = go.GraphObject.make;
    var myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            "undoManager.isEnabled": false, // enable Ctrl-Z to undo and Ctrl-Y to redo
            layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
                {
                    angle: 90,
                    layerSpacing: 35
                })
        });

    // the template we defined earlier
    myDiagram.nodeTemplate =
        $(go.Node, "Horizontal", {
                background: "#44CCFF"
            },
            $(go.Picture, {
                    margin: 10,
                    width: 50,
                    height: 50,
                    background: "red"
                },
                new go.Binding("source")),
            $(go.TextBlock, "Default Text", {
                    margin: 12,
                    stroke: "white",
                    font: "bold 16px sans-serif"
                },
                new go.Binding("text", "name"))
        );

    // define a Link template that routes orthogonally, with no arrowhead
    myDiagram.linkTemplate =
        $(go.Link, {
                routing: go.Link.Orthogonal,
                corner: 5
            },
            $(go.Shape, {
                strokeWidth: 3,
                stroke: "#555"
            })); // the link shape

    var model = $(go.TreeModel);
    const tree = nodeArr.map(node => {
        return ({
            key: node.id,
            name: node.departName,
            parent: node.parentId
        })
    })
    model.nodeDataArray = tree

    myDiagram.model = model;
}