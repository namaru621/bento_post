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
    var setrange = 'B' + Math.floor((today_Day(today) + next_monday() + i));
    console.log(next_monday());
    console.log(username);
    usersheet.getRange(setrange).setValue(v);
  });
}

//指定したシートから注文状況を読み込む

//指定したシートから支払い金額を読み込む

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

//7 + 1 - 曜日(日0~6土)，つまりはつぎの月曜日の日付を取得
function next_monday() {
  var today = new Date();
  if (today.getDay == 0) {
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
    //対象のシートが存在していない時はシートを作成しカラム名を設定する
    var s = spreadsheet.insertSheet(sname);
    return s;
  }
}

//年明け~今日の日数を取得
function today_Day(today) {
  var newyearsday = new Date(today.getFullYear(), 0, 0);
  return (today.getTime() - newyearsday.getTime()) / 1000 / 3600 / 24;
}
