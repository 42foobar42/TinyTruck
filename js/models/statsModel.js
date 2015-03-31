tinyTrucks.statsModel = (function (win) {
    var TruckStats = [];
    var distance = 0, money = 0, time = 0, cargocounter = 0, cargoamount = 0, costs = 0;
    function calcTruckStats(){
        for(var i = 0; i < TruckStats.length; i++){
            var stat = TruckStats[i];
            for(var key in stat){
                //console.log(stat);
                switch (key){
                    case 'length':
                        distance += stat[key];
                        break;
                    case 'money':
                        money += stat[key];
                        break;
                    case 'time':
                        time += stat[key];
                        break;
                    case 'cargo':
                        //console.log(stat[key]);
                        //console.log(stat[key].length);
                        cargocounter += 1;
                        if(stat[key].amount){
                            cargoamount += stat[key].amount;
                        }
                        break;
                    case 'truck':
                        //console.log(stat[key]);
                        costs += tinyTrucks.truckModel.getGasprice() * stat[key].data.fuelconsumption * stat.length;
                        break;
                }
            }
        }
    }
    return {
        addTruckStat: function (stat){
            TruckStats.push(stat);
            //console.log(stat);
        },
        getStatsAsHTML: function(){
            //console.log(TruckStats);
            distance = 0, money = 0, time = 0, cargocounter = 0, cargoamount = 0, costs = 0;
            var html = "";
            calcTruckStats();
            html += '<div class="infoStat">';
            html += '<div class="moneyInfo">';
            html += "<div><span>Revenue: </span><span>" + money + "</span></div>";
            html += "<div><span>Costs: </span><span>" + Math.round(costs) + "</span></div>";
            html += "<div><span>Profit: </span><span>" + Math.round(money - costs) + "</span></div>";
            html += '</div>';
            html += '<div class="cargoInfo">';
            html += "<div><span>Distance: </span><span>" + distance + "</span></div>";
            html += "<div><span>Number of trips: </span><span>" + cargocounter + "</span></div>";
            html += "<div><span>Amount of cargo: </span><span>" + cargoamount + "</span></div>";
            html += '</div>';
            html += '</div>';
            return html;
        }
    };
}(window));