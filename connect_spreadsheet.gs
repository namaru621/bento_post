var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_TOKEN);
//var sheet = spreadsheet.getSheetByName('bento_sheet_1804');
//var data = sheet.getDataRange().getValues();

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
  var today = new Date();
  var setdate = new Date(today.getFullYear(), setday.slice(0, 2) - 1, setday.slice(2, 4));
  var usersheet = getSheet(username);
  console.log(setdate);
  var order_range = 'B' + (today_Day(setdate));
  usersheet.getRange(order_range).setValue(value);
  var state_range = 'C' + (today_Day(setdate));
  usersheet.getRange(state_range).setValue('a');
  var payment_range = 'D' + (today_Day(setdate));
  usersheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i")*370+COUNTIFS(B1:' + order_range + ', "f")*420+COUNTIFS(B1:' + order_range + ', "c")*420');  
}

function write_sheet_auto(value, username) {
  console.log(value);
  var today = new Date();
  var usersheet = getSheet(username);
  var autoflag = usersheet.getSheetValues(7,7,1,1)[0]
  var usrcal = CalendarApp.getCalendarById(CALENDAR); //特定のIDのカレンダーを取得
  var er = 'error';
  var _ = Underscore.load();
  if (autoflag == 't') {
    usersheet.getRange('G7').setValue('f');
    er = 'false';
  }
  else {
    var autoflag = _.zip.apply(_, usersheet.getSheetValues(7, 7, 2, 1))[0][0];
    for (var i=0; i<6; i++) {
        var day = today.getDate() + next_monday + i;
        var setdate = new Date(Math.floor(today.getFullYear()), today.getMonth(), today.getDate() + next_monday() + i);
        //for each(var eve in usrcal.getEventsForDay(setdate)) {
          //if (eve.getTitle() == '昼食会') {
            var order_range = 'B' + (today_Day(setdate));
            usersheet.getRange(order_range).setValue(value);
            var state_range = 'C' + (today_Day(setdate));
            usersheet.getRange(state_range).setValue('a');
            var payment_range = 'D' + (today_Day(setdate));
            usersheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i")*370+COUNTIFS(B1:' + order_range + ', "f")*420+COUNTIFS(B1:' + order_range + ', "c")*420');
          break;
          //}
      //}
    }
    usersheet.getRange('G7').setValue('t');
    usersheet.getRange('G8').setValue(value);
    er = 'true';
    console.log(value, er);
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
  var er = 'error';
  var autoflag = usersheet.getSheetValues(7,7,1,1)[0]
//  for each(var val in _.zip.apply(_, usersheet.getSheetValues(startday, 1, 5, 2))){
  for each(var val in usersheet.getSheetValues(startday, 1, 6, 2)){
    ret_message = ret_message + (val[0] + '').split(' ').slice(0, 3) + '\t' + val[1] + '\n';
  };
  if (autoflag == 't') {
    er = 'true';
  }
  else {
    er = 'false';
  }
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, ret_message + 'auto_order flag is ' + er + '.', 'ordering_bot');
}

//指定したシートから支払い金額を読み込む
function reading_payment(username){
  var today = new Date();
  var usersheet = getSheet(username);

  //前の金曜日までの金額を求める
  var lastFriday = today_Day(today) + next_monday() - 10;
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, 'お代金は ' + usersheet.getSheetValues(lastFriday, 4, 1, 1)[0][0] + ' 円です．', 'order');
}

//毎週金曜12時に実行
//次週のオートセット等を実行する
function weekly_set() {
  var today = new Date();
  var sheets = spreadsheet.getSheets();
  var usrcal = CalendarApp.getCalendarById(CALENDAR); //特定のIDのカレンダーを取得
  var _ = Underscore.load();
  var orderlist = "";
  for each(var sheet in sheets) {
    var getlist = _.zip.apply(_, sheet.getSheetValues(7, 7, 3, 1));
    var autoflag = getlist[0][0];
    var value = getlist[0][1];
    var username = getlist[0][2];
    //for (var i=0; i<6; i++) {
    for (var i=0; i<1; i++) {
      if (autoflag[0] == 't') {
        var setdate = new Date(Math.floor(today.getFullYear()), today.getMonth(), today.getDate() + next_monday() + i);
        //for each(var eve in usrcal.getEventsForDay(setdate)) {
          //if (eve.getTitle().indexOf('昼食会') != -1) {
            var order_range = 'B' + (today_Day(setdate));
            sheet.getRange(order_range).setValue(value);
            var state_range = 'C' + (today_Day(setdate));
            sheet.getRange(state_range).setValue('a');
            var payment_range = 'D' + (today_Day(setdate));
            sheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i")*370+COUNTIFS(B1:' + order_range + ', "f")*420+COUNTIFS(B1:' + order_range + ', "c")*420');  
          //}
        //}
      //注文状況まとめ
      }
      else {;}
      var order = sheet.getRange('B' + (today_Day(today) + next_monday() + i)).getValue();
      console.log(order, orderlist, username);
      if (order == 'i' || order == 'f') {
        orderlist = orderlist + '\n' + sheet.getRange('G9').getValue();
      }
    }
  }
  post_slack(SLACK_ACCESS_TOKEN, '#ordering_lunch', '来週月曜の注文状況...' + orderlist, 'ordering_bot');
}

//Slackからメンバー全員の名前を取り出し，シートを作成
function format_sheet() {
  var today = new Date();
  var newyearday = new Date(today.getFullYear(), 0);
  var listres = UrlFetchApp.fetch(USER_LIST);
  var listjson = JSON.parse(listres.getContentText());
  for each(var val in listjson['members']) {
    var usersheet = getSheet(val['name']);
    usersheet.getRange('G9').setValue(val['real_name']);
    var sourceRange = usersheet.getRange('A1').setValue(newyearday);
    sourceRange.autoFill(usersheet.getRange('A1:A366'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
    for (var i = 0; i < 366; i++){
      var order_range = 'B' + (today_Day(newyearday) + i);
      var state_range = 'C' + (today_Day(newyearday) + i);
      var payment_range = 'D' + (today_Day(newyearday) + i);
      usersheet.getRange(payment_range).setValue('=COUNTIFS(B1:' + order_range + ', "i", C1:' + state_range + ', "a")*370+COUNTIFS(B1:' + order_range + ', "f", C1:' + state_range + ', "a")*420+COUNTIFS(B1:' + order_range + ', "c", C1:' + state_range + ', "a")*420');
    }
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

function ConvertToNumber(strCol) {  
  var iNum = 0;
  var temp = 0;
   
  strCol = strCol.toUpperCase();
  for (i = strCol.length - 1; i >= 0; i--) {
    temp = strCol.charCodeAt(i) - 65; // 現在の文字番号;
    if(i != strCol.length - 1) {
      temp = (temp + 1) * Math.pow(26,(i + 1));
    }
    iNum = iNum + temp
  }
  return iNum;
}