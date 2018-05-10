var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_TOKEN);
//var sheet = spreadsheet.getSheetByName('bento_sheet_1804');
//var data = sheet.getDataRange().getValues();

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

//指定したシートに書き込む
function write_sheet(value, username) {  
  var today = new Date();
  var usersheet = getSheet(username);
  value.split('').forEach(function(v, i, a){
    var order_range = 'B' + (today_Day(today) + next_monday() + i);
    usersheet.getRange(order_range).setValue(v);
    var state_range = 'C' + (today_Day(today) + next_monday() + i);
    usersheet.getRange(state_range).setValue('a');
    var payment_range = 'D' + (today_Day(today) + next_monday() + i);
    usersheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i")*370+COUNTIFS(B1:' + order_range + ', "f")*420+COUNTIFS(B1:' + order_range + ', "c")*420');
  });
}

function write_sheet_ano(setday, value, username){
  var setdate = new Date(2018, setday.slice(0, 2) - 1, setday.slice(2, 4));
  var usersheet = getSheet(username);
  console.log(setdate);
  var order_range = 'B' + (today_Day(setdate));
  usersheet.getRange(order_range).setValue(value);
  var state_range = 'C' + (today_Day(setdate));
  usersheet.getRange(state_range).setValue('a');
  var payment_range = 'D' + (today_Day(setdate));
  usersheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i")*370+COUNTIFS(B1:' + order_range + ', "f")*420+COUNTIFS(B1:' + order_range + ', "c")*420');  
}

function write_sheet_auto(username) {
  var usersheet = getSheet(username);
  var autoflag = usersheet.getSheetValues(7,7,1,1)[0]
  var er = 'error';
  if (autoflag == 't') {
    usersheet.getRange('G7').setValue('f');
    er = 'false';
  }
  else {
    usersheet.getRange('G7').setValue('t');
    er = 'true';
  }
  return er;
}

//指定したシートから注文状況を読み込む
function reading_order(username){
  var today = new Date();
  var usersheet = getSheet(username);
  var startday = today_Day(today) + next_monday();
  var _ = Underscore.load();
  var ret_message = '';
//  for each(var val in _.zip.apply(_, usersheet.getSheetValues(startday, 1, 5, 2))){
  for each(var val in usersheet.getSheetValues(startday, 1, 6, 2)){
    ret_message = ret_message + (val[0] + '').split(' ').slice(0, 3) + '\t' + val[1] + '\n';
  };
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, ret_message, 'ordering_bot');
}

//指定したシートから支払い金額を読み込む
function reading_payment(username){
  var today = new Date();
  var usersheet = getSheet(username);

  //前の金曜日までの金額を求める
  var lastFriday = today_Day(today) + next_monday() - 10;
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, usersheet.getSheetValues(lastFriday, 4, 1, 1)[0][0], 'order');
}

function test_sheets(){
  var username = 'namaru621';
  reading_payment(username);
  reading_order(username);
}

//Slackからメンバー全員の名前を取り出し，シートを作成
function create_sheet() {
  var today = new Date();
  var newyearday = new Date(today.getFullYear(), 0, 1);
  var listres = UrlFetchApp.fetch(USER_LIST);
  var listjson = JSON.parse(listres.getContentText());
  for each(var val in listjson['members']) {
    var usersheet = getSheet(val['name']);
    var sourceRange = usersheet.getRange('A1').setValue(newyearday);
    sourceRange.autoFill(usersheet.getRange('A1:A366'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  }  
}

//今日から次の月曜日までの日数を取得
function next_monday() {
  var today = new Date();
  if (today.getDay() == '0') {
    return 1;
  }else{
    return 8 - today.getDay();
  }
}

function getSheet(sname){
  //対象となるシート名は一個しかないと仮定して、シートの一覧を取得してその中から名前が一致するものを探す
  var sheets = spreadsheet.getSheets();
  var sheet = underscoreGS._filter(sheets, function(s){
    return s.getName() == sname;
  })[0];
  
  if(sheet){
    //対象のシートが存在している時はそれを使う
    return sheet;
  }else{
    //対象のシートが存在していない時はシートを作成する
    var s = spreadsheet.insertSheet(sname);
    return s;
  }
}

//年明け~今日の日数を取得
function today_Day(today) {
  var newyearsday = new Date(today.getFullYear(), 0, 0);
  return Math.floor((today.getTime() - newyearsday.getTime()) / 1000 / 3600 / 24);
}
