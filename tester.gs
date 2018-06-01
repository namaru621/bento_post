function cal_test(){
  var myCals = CalendarApp.getCalendarById(CALENDAR); //特定のIDのカレンダーを取得
  var myEvents = myCals.getEventsForDay(new Date());
  
  console.log(myEvents[0].getTitle());
}

function test_sheets(){
  var username = 'namaru621';
  reading_payment(username);
  reading_order(username);
}


function order_test(){
  //weekly_order("order -w i", "namaru621");
  //spot_order("order -d 0621 n", "namaru621");
  auto_order("order -a i", "namaru621");
  //auto_order("check");
}

function myFunction() {  
  var today = new Date();  
  var setrange = 'F' + (today.getDate() + 1);
  
  //sheet.getRange(setrange).setValue(today.getDate());
  sheet.getRange(setrange).setValue('=SUM(A10:A13)');
  console.log(sheet.getSheetValues(10, 6, 1, 1)[0][0]);
  
  console.log(today);
  
  var listres = UrlFetchApp.fetch(USER_LIST);
  var listjson = JSON.parse(listres.getContentText());
  for each(var val in listjson['members']) {
    console.log(val['profile']);
  }
}

function today_Day_test() {
  var today = new Date();
  today_Day(today);
}