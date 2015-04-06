/**
 * 
 * industries: Automotive i., building i., Chemical i., Electronics i., primary i., Wood economy,
 *              Industrial agriculture, Aviation i., Mechanical engineering, Metalworking, Textile i,
 *              food i., Luxury i., 
 * 
 * tpyes: ordinary =>,
 * 
 */
var Industries = [
    { name:'Automotive industry', shortcut:'auto'},
    { name:'Building industry', shortcut:'build'},
    { name:'Chemical industry', shortcut:'chem'},
    { name:'Electronics industry', shortcut:'elec'},
    { name:'Primary industry', shortcut:'prim'},
    { name:'Wood economy', shortcut:'wood'},
    { name:'Industrial agriculture', shortcut:'agri'},
    { name:'Aviation industry', shortcut:'avi'},
    { name:'Mechanical engineering', shortcut:'mech'},
    { name:'Metalworking', shortcut:'metal'},
    { name:'Textile industry', shortcut:'text'},
    { name:'Food industry', shortcut:'food'},
    { name:'Luxury industry', shortcut:'lux'}
];

var Goods = [
    { name:'Lemonade', industry:'food', type:'ordinary', groundvalue: 0.05 },
    { name:'Pants', industry:'text', type:'ordinary', groundvalue: 0.08 },
    { name:'Shirts', industry:'text', type:'ordinary', groundvalue: 0.07 },
    { name:'Fish', industry:'food', type:'food', groundvalue: 0.06 },
    { name:'Engine', industry:'auto', type:'ordinary', groundvalue: 0.15 },
    { name:'Cement', industry:'build', type:'ordinary', groundvalue: 0.04 },
    { name:'Chlorine', industry:'chem', type:'ordinary', groundvalue: 0.065 }, // TODO change type
    { name:'Radios', industry:'elec', type:'ordinary', groundvalue: 0.09 },
    { name:'Stone', industry:'prim', type:'ordinary', groundvalue: 0.045 },
    { name:'Wood', industry:'wood', type:'ordinary', groundvalue: 0.065 }, //TODO
    { name:'Oats ', industry:'agri', type:'ordinary', groundvalue: 0.045 }, // TODO type
    { name:'Wings', industry:'avi', type:'ordinary', groundvalue: 0.25 }, // TODO type
    { name:'Tank', industry:'mech', type:'ordinary', groundvalue: 0.08 }, // TODO all
    { name:'Iron', industry:'metal', type:'ordinary', groundvalue: 0.065 },
    { name:'Sweets', industry:'food', type:'ordinary', groundvalue: 0.055 },
    { name:'Watch', industry:'lux', type:'ordinary', groundvalue: 0.12 },
]