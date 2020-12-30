export class Constants {
  public static bookLocations: {label: string, value: string}[] = [
    {label:'Main by Computer Desk', value:"Main"},
    /*{label:'Credenza by Computer Desk', value:"Credenza"},*/
    {label:'Bathroom Under Sink', value:"Bathroom"},
    {label:'Brian\'s Bedroom', value:"Brians BR"},
    {label:'Extra Storage Room', value:"Extra Rm"}
  ];

  public static shelfs: {label: string, value: number}[] = [
    {label:'', value:-1},
    {label:'1 (bottom)', value:1},
    {label:'2', value:2},
    {label:'3', value:3},
    {label:'4', value:4},
    {label:'5', value:5},
    {label:'6', value:6},
    {label:'7', value:7},
    {label:'8', value:8},
    {label:'9', value:9},
    {label:'10', value:10}
  ];

  public static positions: {label: string, value: string}[] = [
    {label:'', value:null},
    {label:'Left', value:'Left'},
    {label:'Middle', value:'Middle'},
    {label:'Right', value:'Right'},
    {label:'Top', value:'Top'},
    {label:'Bottom', value:'Bottom'}
  ];

  public static bookTypes: {label: string, value: string}[] = [
    {label:'Kindle', value:'KINDLE'},
    {label:'Audible', value:'AUDIBLE'},
    {label:'Christian Audio', value:'CHRSTNAUDIO'},
    {label:'MP 3', value:'MP3'},
    {label:'PDF', value:'PDF'},
    {label:'Regular', value:'REGULAR'}
  ];
}