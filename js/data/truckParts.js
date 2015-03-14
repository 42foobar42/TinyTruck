var Trucks = [
    {type: "truck", name: "Flatbed", id: 0, costs:1000, speed:80,
        parts: [{type: "Engine", costs: 500}, {type: "Axis", costs: 750}, {type: "Drivers cab", costs: 1000}],
        data: {capacity: 10, speed: 100, fuel: 200, type: "ordinary", trailers:0}}
    ,
    {type: "trailer", name: "Two-axle drawbar trailer", id:0, costs:700,
        parts: [{type: "Chassis", costs: 200}, {type: "Axis", costs: 250}, {type: "Platform", costs: 400}],
        data: {capacity: 10, fuel: 200, type: "ordinary"}}

];


//obj = { type:"truck", name:"Flatbed", parts:[{ type:"Engine", costs:500},{ type:"Axis", costs:750}, { type:"Drivers cab", costs:1000}], data: {capacity:10, speed:100, fuel:200}};